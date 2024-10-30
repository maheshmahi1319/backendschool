import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { username, password, role } = createUserDto;

    // Hash the password
    const hashedPassword = await this.hashPassword(password);

    // Create a new user with hashed password
    const user = await this.userService.create({
      username,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex'); // Generate a random salt
    const hash = createHash('sha256')
      .update(password + salt)
      .digest('hex');
    return `${salt}:${hash}`; // Return salt and hash
  }

  async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = await this.userService.findOne(username);
    if (user) {
  
    const [salt, hash] = user.password.split(':');
    const newHash = createHash('sha256')
      .update(password + salt)
      .digest('hex');
    return hash === newHash; // Compare hashes
    }
    return false;
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
  
    // Log for debugging
    console.log(`User found: ${user ? 'Yes' : 'No'}`);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match: ${isMatch}`);
      if (isMatch) {
        return user; // Return user if the password matches
      }
    }
    
    return null; // Return null if credentials are invalid
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findOne(payload.username);
    if (user?.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.jwtService.sign(
        { username: user?.username, role: user?.role },
        { expiresIn: "15m" }
      ),
    };
  }

  async validateRefreshToken(refreshToken: string): Promise<number | null> {
    try {
      const payload = this.jwtService.verify(refreshToken); // Verify the token
      const user = await this.userService.findOne(payload.username); // Get the user
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (user?.refreshToken !== refreshToken) {
        // Check if the stored refresh token matches
        throw new UnauthorizedException("Invalid refresh token");
      }

      return user?.id; // Return the user's ID if valid
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: number) {
    await this.userService.removeRefreshToken(userId);
  }
}
