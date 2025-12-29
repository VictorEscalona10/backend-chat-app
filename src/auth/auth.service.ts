import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyLoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: data.email } 
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ConflictException('El usuario ya está registrado y verificado');
      }
      
      // Si existe pero no está verificado, actualizamos el código
      const code = this.generateVerificationCode();
      existingUser.verificationCode = code;
      existingUser.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      await this.usersRepository.save(existingUser);
      await this.emailService.sendVerificationCode(data.email, code);
      
      return { 
        message: 'Código de verificación reenviado', 
        email: data.email 
      };
    }

    // Generar código de verificación
    const verificationCode = this.generateVerificationCode();
    
    // Crear usuario sin verificar
    const user = this.usersRepository.create({
      email: data.email,
      username: data.username,
      birthdate: data.birthDate,
      profilePhotoUrl: data.profilePhotoUrl || null,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    await this.usersRepository.save(user);
    
    // Enviar email con el código
    await this.emailService.sendVerificationCode(data.email, verificationCode);

    return { 
      message: 'Código de verificación enviado a tu email', 
      email: data.email 
    };
  }

  async resendCode(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isVerified) {
      throw new BadRequestException('El usuario ya está verificado');
    }

    // Generar nuevo código
    const newCode = this.generateVerificationCode();
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    await this.usersRepository.save(user);
    await this.emailService.sendVerificationCode(email, newCode);

    return { 
      message: 'Nuevo código enviado', 
      email 
    };
  }

  private generateVerificationCode(): string {
    // Generar código de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(loginDto: LoginDto) {
    const { email } = loginDto;

    const user = await this.usersRepository.findOne({ 
      where: { email } 
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario está verificado
    if (!user.isVerified) {
      throw new UnauthorizedException('Usuario no verificado. Por favor verifica tu email primero.');
    }

    // Generar código de login
    const loginCode = this.generateVerificationCode();
    user.loginCode = loginCode;
    user.loginCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    
    await this.usersRepository.save(user);
    await this.emailService.sendLoginCode(email, loginCode);

    return { 
      message: 'Código de inicio de sesión enviado a tu email', 
      email 
    };
  }

  async verifyLogin(verifyLoginDto: VerifyLoginDto) {
    const { email, code } = verifyLoginDto;

    const user = await this.usersRepository.findOne({ 
      where: { email } 
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Usuario no verificado');
    }

    // Verificar código de login y expiración
    if (user.loginCode !== code) {
      throw new BadRequestException('Código incorrecto');
    }

    if (!user.loginCodeExpires || new Date() > user.loginCodeExpires) {
      throw new BadRequestException('El código ha expirado');
    }

    // Limpiar el código de login después de usarlo
    user.loginCode = null;
    user.loginCodeExpires = null;
    await this.usersRepository.save(user);

    // Generar JWT
    const payload = { 
      sub: user.user_id, 
      email: user.email, 
      username: user.username 
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      }
    };
  }

  // Actualiza el verifyCode existente para que también genere JWT
  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const { email, code } = verifyCodeDto;

    const user = await this.usersRepository.findOne({ 
      where: { email } 
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isVerified) {
      throw new BadRequestException('El usuario ya está verificado');
    }

    // Verificar código y expiración
    if (user.verificationCode !== code) {
      throw new BadRequestException('Código incorrecto');
    }

    if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires) {
      throw new BadRequestException('El código ha expirado');
    }

    // Marcar usuario como verificado
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    
    await this.usersRepository.save(user);

    // Generar JWT automáticamente después de verificar
    const payload = { 
      sub: user.user_id, 
      email: user.email, 
      username: user.username 
    };
    const token = this.jwtService.sign(payload);

    return { 
      message: 'Usuario verificado exitosamente', 
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      }
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
      select: ['user_id', 'email', 'username', 'birthdate', 'isVerified', 'profilePhotoUrl', 'createdAt']
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}