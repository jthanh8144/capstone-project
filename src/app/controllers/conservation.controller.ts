import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import {
  LIMIT_CHAT_SELECTED,
  MessageEncryptTypeEnum,
  MessageTypeEnum,
} from '../../shared/constants'
import { socket } from '../../shared/providers'
import {
  ParticipantRepository,
  MessageRepository,
  UserRepository,
} from '../repositories'
import { AuthRequest } from '../typings'
import { SendMessageDto } from '../dtos'
import { Not } from 'typeorm'

export class ConservationController {
  private messageRepository: MessageRepository
  private participantRepository: ParticipantRepository
  private userRepository: UserRepository

  constructor() {
    this.messageRepository = new MessageRepository()
    this.participantRepository = new ParticipantRepository()
    this.userRepository = new UserRepository()
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
}
