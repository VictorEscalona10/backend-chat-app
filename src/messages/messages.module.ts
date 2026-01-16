import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { ChatModule } from '../chat/chat.module';
import { WsJwtStrategy } from './ws-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChatModule, JwtModule.register({ // ¡Configura JwtModule!
      secret: 'A9f#L2x!vQ7@eM3z$T8pW1^nK6&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL8@xP2#vM6$eN1^qT7&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL',
      signOptions: { expiresIn: '1d' },
    }),],
  providers: [MessagesGateway, WsJwtStrategy]
})
export class MessagesModule {}
