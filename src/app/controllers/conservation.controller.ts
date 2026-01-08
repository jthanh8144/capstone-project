import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { In, Not } from 'typeorm'

import {
  ConservationEnum,
  LIMIT_CHAT_SELECTED,
  MessageEncryptTypeEnum,
  MessageTypeEnum,
} from '../../shared/constants'
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
import { addEventJob, getPageFromQuery } from '../utils/functions'

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
      const realPage = getPageFromQuery(page) || 1
      const [messages, total] =
        await this.messageRepository.getMessagesOfConservation(id, realPage)
      const totalPage = Math.ceil(total / LIMIT_CHAT_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        messages,
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
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
        relations: { user: true },
      })
      await addEventJob({
        to: participants.map((participant) => participant.userId),
        eventName: 'message',
        data: {
          conservationId: id,
          user,
          messageId: mess.id,
          message,
          messageType: MessageTypeEnum[messageType],
          encryptType,
        },
        firebaseData: {
          tokens: participants
            .map((participant) => participant.user.fcmToken)
            .filter((token) => !!token),
          notification: {
            title: 'Safe talk',
            body: `${user.fullName} send you a message!`,
          },
        },
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
      const sendTo = participants.filter(
        (participant) => participant.userId !== userId,
      )
      const participantsWithFcm = await this.participantRepository.find({
        where: { id: In(sendTo.map((participant) => participant.id)) },
        relations: { user: true },
      })
      await addEventJob({
        to: sendTo.map((participant) => participant.userId),
        eventName: 'message',
        data: {
          conservationId: conservation.id,
          user,
          messageId: mess.id,
          message,
          messageType: MessageTypeEnum[messageType],
          encryptType,
        },
        firebaseData: {
          tokens: participantsWithFcm
            .map((participant) => participant.user.fcmToken)
            .filter((token) => !!token),
          notification: {
            title: 'Safe talk',
            body: `${user.fullName} send you a message!`,
          },
        },
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
