import { Socket } from 'socket.io'
import { createAdapter } from '@socket.io/redis-streams-adapter'

import { socket } from '.'
import { logger } from './logger.provider'
import redisClient from '../configs/redis.config'
import { UserRepository } from '../../app/repositories'

class SocketProvider {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async initialize() {
    try {
      await redisClient.connect()
      socket.adapter(createAdapter(redisClient))
      socket.on('connection', async (sk: Socket) => {
        console.log('Socket connected', sk.id)
        const { roomId } = sk.handshake.query
        if (typeof roomId === 'string') {
          sk.join(roomId)
          await this.userRepository.updateUser(roomId, { isOnline: true })
        }

        sk.on('disconnect', async () => {
          console.log('Socket disconnected')
          sk.disconnect()
          if (typeof roomId === 'string') {
            await this.userRepository.updateUser(roomId, { isOnline: false })
          }
        })
      })
    } catch (err: any) {
      logger.error(err.message)
    }
  }
}

export const socketProvider = new SocketProvider()
