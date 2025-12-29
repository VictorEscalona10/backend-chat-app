import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'), // Convertir a número
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Tu código de verificación',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verifica tu cuenta</h2>
          <p>Gracias por registrarte. Usa el siguiente código para completar tu registro:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${code}</h1>
          </div>
          <p>Este código expirará en 10 minutos.</p>
          <p>Si no solicitaste este registro, ignora este email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} Tu App. Todos los derechos reservados.</p>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}