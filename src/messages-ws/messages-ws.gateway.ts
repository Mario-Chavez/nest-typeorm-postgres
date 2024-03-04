import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    /* emite los clientes conectados */
    this.wss.emit(
      'clients-update',
      this.messagesWsService.getConnectedClient(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    /* client desconnect */
    this.wss.emit(
      'clients-update',
      this.messagesWsService.getConnectedClient(),
    );
  }

  /* escucha los mensajes */
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    const clientId = client.id;

    // Emite unicamente al cliente q manda msj
    //   client.emit('message-from-server', {
    //     fullName: 'Nombre del cliente',
    //     message: payload.message || 'no-message',
    //   });
    // }

    /* Emite a todos  Menos al  cliente que escribio */
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Nombre del cliente',
    //   message: payload.message || 'no-message',
    // });

    /* Emite a todos los clientes  */
    this.wss.emit('message-from-server', {
      fullName: 'Nombre del cliente',
      message: payload.message || 'no-message',
    });
  }
}
