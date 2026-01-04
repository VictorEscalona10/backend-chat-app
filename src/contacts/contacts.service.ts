import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
    private usersService: UsersService,
    private chatService: ChatService
  ) { }

  async createContact(createContactDto: CreateContactDto, user_id: string) {
    const { email, nickname } = createContactDto

    const findUser = await this.usersService.findUserByEmail(email)

    if (findUser.user_id === user_id) throw new BadRequestException('No puedes agregarte a ti mismo en los contactos')

    const findContactByEmail = await this.contactRepository.findOne({
      where: { email, user_id: user_id }
    })

    if (findContactByEmail) throw new BadRequestException('Ya tienes un contacto con este correo')

    const findContactByNickname = await this.contactRepository.findOne({
      where: { nickname, user_id: user_id }
    })

    if (findContactByNickname) throw new BadRequestException('Ya tienes un contacto con este nombre')


    const createContact = this.contactRepository.create({
      user_id: user_id,
      nickname,
      email
    })

    const saveContact = await this.contactRepository.save(createContact)

    await this.chatService.createChat(user_id, findUser.user_id)

    return {
      message: 'Contacto registrado',
      contact: saveContact
    }
  }

  async getAllContacts(user_id: string) {
    const getAllContacts = await this.contactRepository.find({ where: { user_id } })
    return getAllContacts
  }

}
