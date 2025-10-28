import { Injectable, OnModuleInit, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createAdminUser();
  }

  private async createAdminUser() {
    const adminEmail = 'admin@maw9it.com';
    const adminExists = await this.userRepository.findOne({ 
      where: { email: adminEmail } 
    });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash('Admin123!', 12);
      
      const adminUser = this.userRepository.create({
        nom: 'Admin',
        prenom: 'System',
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(adminUser);
      console.log(' Compte admin créé avec succès');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { nom, prenom, email, password, role } = createUserDto;

    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = this.userRepository.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(user);

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'nom', 'prenom', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'nom', 'prenom', 'email', 'role', 'createdAt']
    });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'nom', 'prenom', 'email', 'password', 'role', 'createdAt']
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await this.userRepository.findOne({ 
        where: { email: updateData.email } 
      });
      
      if (emailExists) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Empêcher la suppression de l'admin principal
    if (user.email === 'admin@maw9it.com') {
      throw new BadRequestException('Impossible de supprimer le compte admin principal');
    }

    await this.userRepository.delete(id);
    
    return { message: 'Utilisateur supprimé avec succès' };
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: ['id', 'nom', 'prenom', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async getDrivers(): Promise<User[]> {
    return this.getUsersByRole(UserRole.DRIVER);
  }

  async getMechanics(): Promise<User[]> {
    return this.getUsersByRole(UserRole.MECHANIC);
  }

  async getPassengers(): Promise<User[]> {
    return this.getUsersByRole(UserRole.PASSENGER);
  }

  async getAdmins(): Promise<User[]> {
    return this.getUsersByRole(UserRole.ADMIN);
  }
}