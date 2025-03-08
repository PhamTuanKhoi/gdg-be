import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { WebsocketsService } from './websockets.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'calibration', path: '/s' })
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketsService: WebsocketsService) {}

  @SubscribeMessage('calibration')
  handleData(@ConnectedSocket() client: Socket): void {
    this.server.emit('sync', { data: 'data' });
  }
}
