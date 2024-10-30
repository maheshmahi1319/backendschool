import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username!: string; // Use ! to indicate this will be assigned later

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password!: string; // Use ! to indicate this will be assigned later

  @ApiProperty({ description: 'The role of the user' })
  @IsString()
  @IsNotEmpty()
  role!: string; // Use ! to indicate this will be assigned later
}
