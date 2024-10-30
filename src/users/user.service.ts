import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined; // Convert null to undefined
  }
  
  async findById(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user ?? undefined; // Convert null to undefined
  }
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password


    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
  
    await this.userRepository.update(userId, updateUserDto);
    
    // Since we know the user exists, we can safely assert it
    return this.findById(userId) as Promise<User>; // Use type assertion here
  }
  

  async delete(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.update(userId, { refreshToken: '' });
  }
}
