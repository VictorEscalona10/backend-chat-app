import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { JwtStrategy } from './jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'A9f#L2x!vQ7@eM3z$T8pW1^nK6&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL8@xP2#vM6$eN1^qT7&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard]
})
export class AuthModule { }