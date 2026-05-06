import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Length(6, 30, { message: 'Username must be between 6 and 30 characters' })
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符'
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(6, 30, { message: 'Password must be between 6 and 30 characters' })
  password: string;
}
