import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private conectedClients: ConectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId }); //user desde la db

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');

    this.conectedClients[client.id] = {
      socket: client, //de socket
      user: user, //del user de nuestra db
    };
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getConnectedClient(): string[] {
    return Object.keys(this.conectedClients);
  }

  /* extrae el nombre del usuario desde la db */
  getUserFullName(socketId: string) {
    return this.conectedClients[socketId].user.fullName;
  }
}
