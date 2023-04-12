import { Socket } from 'socket.io'
import { socket } from '.'

class SocketProvider {
  public initialize() {
    socket.on('connection', (sk: Socket) => {
      console.log('Socket connected')

      sk.on('disconnect', () => {
        console.log('Socket connected')
      })

      sk.on('message', (data) => {
        socket.emit('selecting', data)
      })
    })
  }
}

export const socketProvider = new SocketProvider()
