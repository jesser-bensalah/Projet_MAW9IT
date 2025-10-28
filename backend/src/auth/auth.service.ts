import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtSecretService } from './jwt-secret.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private jwtSecretService: JwtSecretService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: any }> {
    const { nom, prenom, email, password, confirmPassword, role } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    if (role === UserRole.ADMIN) {
      throw new BadRequestException('Inscription en tant qu\'admin non autorisée');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({ nom, prenom, email, password: hashedPassword, role });
    await this.userRepository.save(user);

    const payload = { email: user.email, sub: user.id, role: user.role, iss: 'maw9it-app', aud: 'maw9it-users' };
    const access_token = this.jwtService.sign(payload, { secret: this.jwtSecretService.getSecret() });

    const { password: _, ...userWithoutPassword } = user;
    return { access_token, user: userWithoutPassword };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'nom', 'prenom', 'email', 'password', 'role', 'createdAt']
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { email: user.email, sub: user.id, role: user.role, iss: 'maw9it-app', aud: 'maw9it-users' };
    const access_token = this.jwtService.sign(payload, { secret: this.jwtSecretService.getSecret() });

    const { password: _, ...userWithoutPassword } = user;
    return { access_token, user: userWithoutPassword };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: this.jwtSecretService.getSecret() });
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nom', 'prenom', 'email', 'role', 'createdAt']
    });

    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');
    return user;
  }
}
