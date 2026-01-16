import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>) { }
    
    async createChat(first_user_id: string, second_user_id: string) {
        const findChat = await this.chatRepository.findOne({
            where: [
                { first_user_id, second_user_id },
                { first_user_id: second_user_id, second_user_id: first_user_id }
            ]
        })

        if(findChat) return findChat

        const createChat = this.chatRepository.create({first_user_id, second_user_id})

        return this.chatRepository.save(createChat)
    }

    async getChatById(chat_id: string) {
        return this.chatRepository.findOne({ where: { chat_id } });
    }
}
