import { Socket } from 'socket.io'
import { socket } from '.'

class SocketProvider {
  public initialize() {
    socket.on('connection', (sk: Socket) => {
      console.log('Socket connected', sk.id)
      const { roomId } = sk.handshake.query
      if (typeof roomId === 'string') {
        sk.join(roomId)
      }

      sk.on('disconnect', () => {
        console.log('Socket disconnected')
        sk.disconnect()
      })
    })
  }
}

export const socketProvider = new SocketProvider()
