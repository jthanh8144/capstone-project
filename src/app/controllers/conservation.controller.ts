import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import {
  ConservationEnum,
  LIMIT_CHAT_SELECTED,
  MessageEncryptTypeEnum,
  MessageTypeEnum,
} from '../../shared/constants'
import { socket } from '../../shared/providers'
import {
  ParticipantRepository,
  MessageRepository,
  UserRepository,
  ConservationRepository,
  ConservationSettingRepository,
} from '../repositories'
import { AuthRequest } from '../typings'
import {
  NewConservationDto,
  SendMessageDto,
  UpdateConservationSettingDto,
} from '../dtos'
import { Not } from 'typeorm'

export class ConservationController {
  private messageRepository: MessageRepository
  private participantRepository: ParticipantRepository
  private userRepository: UserRepository
  private conservationRepository: ConservationRepository
  private conservationSettingRepository: ConservationSettingRepository

  constructor() {
    this.messageRepository = new MessageRepository()
    this.participantRepository = new ParticipantRepository()
    this.userRepository = new UserRepository()
    this.conservationRepository = new ConservationRepository()
    this.conservationSettingRepository = new ConservationSettingRepository()
  }

  public getMessagesOfConservation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { page } = req.query
      const [messages, total] =
        await this.messageRepository.getMessagesOfConservation(
          id,
          typeof page === 'string' && !isNaN(+page) && +page > 0
            ? +page
            : undefined,
        )
      res.status(StatusCodes.OK).json({
        success: true,
        messages,
        totalPage: Math.ceil(total / LIMIT_CHAT_SELECTED),
      })
    } catch (error) {
      next(error)
    }
  }

  public sendChat = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { userId } = req
      const { message, messageType, encryptType }: SendMessageDto = req.body
      const user = await this.userRepository.findOne({ where: { id: userId } })
      const mess = await this.messageRepository.save(
        this.messageRepository.create({
          senderId: userId,
          conservationId: id,
          message,
          messageType: MessageTypeEnum[messageType],
          encryptType:
            MessageEncryptTypeEnum[MessageEncryptTypeEnum[encryptType]],
        }),
      )
      const participants = await this.participantRepository.find({
        where: { conservationId: id, userId: Not(userId) },
      })
      socket
        .to(participants.map((participant) => participant.userId))
        .emit('message', {
          conservationId: id,
          user,
          messageId: mess.id,
          message,
          messageType,
          encryptType,
        })
      res.status(StatusCodes.OK).json({ success: true, messageId: mess.id })
    } catch (error) {
      next(error)
    }
  }

  public newChat = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const {
        receiverId,
        message,
        messageType,
        encryptType,
      }: NewConservationDto = req.body
      const conservation = await this.conservationRepository.save(
        this.conservationRepository.create({
          creatorId: userId,
          type: ConservationEnum.secret,
        }),
      )
      const [user, mess, participants] = await Promise.all([
        this.userRepository.findOne({ where: { id: userId } }),
        this.messageRepository.save(
          this.messageRepository.create({
            message,
            messageType: MessageTypeEnum[messageType],
            encryptType,
            senderId: userId,
            conservation,
          }),
        ),
        this.participantRepository.save([
          this.participantRepository.create({ conservation, userId }),
          this.participantRepository.create({
            conservation,
            userId: receiverId,
          }),
        ]),
        this.conservationSettingRepository.save([
          this.conservationSettingRepository.create({ conservation, userId }),
          this.conservationSettingRepository.create({
            conservation,
            userId: receiverId,
          }),
        ]),
      ])
      socket
        .to(
          participants
            .filter((participant) => participant.id !== userId)
            .map((participant) => participant.userId),
        )
        .emit('message', {
          conservationId: conservation.id,
          user,
          messageId: mess.id,
          message,
          messageType,
          encryptType,
        })
      res.status(StatusCodes.OK).json({
        success: true,
        conservationId: conservation.id,
        messageId: mess.id,
      })
    } catch (error) {
      next(error)
    }
  }

  public getConservationSetting = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { id } = req.params
      const setting = await this.conservationSettingRepository.findOne({
        where: {
          conservationId: id,
          userId,
        },
      })
      res.status(StatusCodes.OK).json({ success: true, setting })
    } catch (error) {
      next(error)
    }
  }

  public updateConservationSetting = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const data: UpdateConservationSettingDto = req.body
      await this.conservationSettingRepository.updateSetting(id, data)
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Update conservation success!' })
    } catch (error) {
      next(error)
    }
  }
}
