import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './entities/messages.entity';
import { Repository } from 'typeorm';
import { ChatService } from '../chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway(
  {
    cors: { origin: '*' },
    namespace: '/chat'
  }
)

@UseGuards(WsJwtGuard)
export class MessagesGateway {
  @WebSocketServer()
  server: Server

  private userSocketMap = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  async handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    client.join(`chat_${data.chatId}`);
    console.log(`Cliente ${client.id} se unió al chat ${data.chatId}`);
  }

  @SubscribeMessage('send_message')
  async handdleMessage(@MessageBody() data: { chatId: string, userId: string, content: string }) {
    try {
      const message = this.messageRepository.create({
        chat_id: data.chatId,
        user_id: data.userId,
        content: data.content,
      })

      const savedMessage = await this.messageRepository.save(message);
      this.server.to(`chat_${data.chatId}`).emit('new_message', savedMessage);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return { event: 'message_error', success: false, error: 'Error al enviar mensaje' };
    }
  }
}
