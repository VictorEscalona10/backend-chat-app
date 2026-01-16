import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    async findUserByEmail(email: string) {

        const findUser = await this.usersRepository.findOne({ where: { email: email.toLowerCase() } })

        if (!findUser) throw new NotFoundException('El usuario no existe')

        return findUser
    }

    async findUserById(user_id: string) {
        const findUser = await this.usersRepository.findOne({ where: { user_id } })

        if (!findUser) throw new NotFoundException('Usuario no encontrado')

        return findUser
    }


    async updateProfile(updateProfile: UpdateProfileDto, user_id: string) {
        const finduser = await this.findUserById(user_id)

        Object.assign(finduser, updateProfile)

        return this.usersRepository.save(finduser)
    }
}
