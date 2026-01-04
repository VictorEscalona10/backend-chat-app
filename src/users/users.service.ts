import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    async findUserByEmail(email: string) {

        const findUser = await this.usersRepository.findOne({ where: { email: email.toLowerCase() } })

        if(!findUser) throw new NotFoundException('El usuario no existe')

        return findUser
    }
}
