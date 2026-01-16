import { Controller, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateUser(@Req() req: Request & { user: User }, @Body() updateUser: UpdateProfileDto) {
      return this.usersService.updateProfile(updateUser, req.user.user_id)
  }
}
