import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createContact(@Body() createContactDto: CreateContactDto, @Req() req: Request & { user: User }) {
    return this.contactsService.createContact(createContactDto, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all')
  getAllContact(@Req() req: Request & { user: User }) {
    return this.contactsService.getAllContacts(req.user.user_id);
  }


}
