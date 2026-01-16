import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromSocket(client);
      
      if (!token) {
        throw new WsException('Token no proporcionado');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'A9f#L2x!vQ7@eM3z$T8pW1^nK6&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL8@xP2#vM6$eN1^qT7&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL',
      });

      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        username: payload.username,
      };

      return true;
    } catch (error) {
      throw new WsException('No autorizado');
    }
  }

  private extractTokenFromSocket(socket: Socket): string | null {
    // El token puede venir en:
    // 1. Los query parameters: ws://localhost?token=xxx
    // 2. En el handshake auth: socket.auth.token
    // 3. En los headers (no común en WebSockets)
    
    const token = 
      socket.handshake.auth?.token ||
      socket.handshake.query?.token as string ||
      null;
    
    return token;
  }
}