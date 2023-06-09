import { Socket } from 'socket.io'
import { createAdapter } from '@socket.io/mongo-adapter'

import { socket } from '.'
import { environment } from '../constants'
import { logger } from './logger.provider'
import mongoClient from '../configs/mongo.config'
import { UserRepository } from '../../app/repositories'

class SocketProvider {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async initialize() {
    try {
      await mongoClient.connect()
      const mongoCollection = mongoClient
        .db(environment.mongo.database)
        .collection(environment.mongo.collection)
      socket.adapter(createAdapter(mongoCollection))
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
