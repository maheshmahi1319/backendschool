import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string; // Use ! to indicate this will be assigned later

  @IsString()
  @IsNotEmpty()
  password!: string; // Use ! to indicate this will be assigned later

  @IsString()
  @IsNotEmpty()
  role!: string; // Use ! to indicate this will be assigned later
}
