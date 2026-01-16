// strategies/ws-jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor() {
    super({
      jwtFromRequest: (socket: Socket) => {
        return socket.handshake.auth?.token || 
               socket.handshake.query?.token as string;
      },
      ignoreExpiration: false,
      secretOrKey: 'A9f#L2x!vQ7@eM3z$T8pW1^nK6&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL8@xP2#vM6$eN1^qT7&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}