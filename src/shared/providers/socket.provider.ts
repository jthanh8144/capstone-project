import { Socket } from 'socket.io'
import { socket } from '.'
import { UserRepository } from '../../app/repositories'

class SocketProvider {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public initialize() {
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
  }
}

export const socketProvider = new SocketProvider()
