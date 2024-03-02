import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConectedClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  private conectedClients: ConectedClients = {};

  registerClient(client: Socket) {
    this.conectedClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getConnectedClient(): string[] {
    return Object.keys(this.conectedClients);
  }
}
