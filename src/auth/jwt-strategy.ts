import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'A9f#L2x!vQ7@eM3z$T8pW1^nK6&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL8@xP2#vM6$eN1^qT7&rY0uJ5*bC4+oD7=ZqX9~sH2%gV8|mN3<jE6>lF0?iA1]tB5[uR4{cS7}dO9hG3!kL',
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { user_id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}