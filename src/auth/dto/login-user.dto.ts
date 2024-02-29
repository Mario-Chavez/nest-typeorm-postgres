import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email for login',
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password for login',
    minLength: 6,
    maxLength: 50,
    example: 'Abcd123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S*$/, {
    message:
      'The password must have an Uppercase letter, a lowercase letter, and a number. No spaces allowed.',
  })
  password: string;
}
