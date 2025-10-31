import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('✅ WebSocket Server initialized');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() messageData: { sender: string; content: string; timestamp: string }) {
    console.log('📨 Message received from:', messageData.sender);
    
    // SAUVEGARDER dans la base de données
    const savedMessage = await this.messagesRepository.save({
      sender: messageData.sender,
      content: messageData.content,
      timestamp: new Date(),
    });
    
    console.log('💾 Message saved to database:', savedMessage.id);
    console.log('📤 Broadcasting to ALL clients:', messageData);
    
    // DIFFUSER À TOUS LES CLIENTS
    this.server.emit('messageReceived', messageData);
    
    return messageData;
  }

  handleConnection(client: any) {
    console.log('🔗 Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('🔌 Client disconnected:', client.id);
  }
}