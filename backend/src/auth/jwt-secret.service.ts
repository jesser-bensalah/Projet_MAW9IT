import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class JwtSecretService {
  private secret: string;

  constructor() {
    this.secret = this.generateDynamicSecret();
    console.log(' JWT Secret généré dynamiquement :', this.secret);
  }

  getSecret(): string {
    return this.secret;
  }

  private generateDynamicSecret(): string {
    const factors = [
      process.env.NODE_ENV || 'development',
      new Date().toISOString(),
      crypto.randomBytes(32).toString('hex'),
      process.pid.toString(),
    ];

    return crypto.createHash('sha256').update(factors.join(':')).digest('hex');
  }
}
