import { Controller, Post, Body, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({summary: "Create a Account"})
  @ApiOkResponse({ schema: { example: { access_token: '...' } } })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({summary: "Login With Email and Password"})
  @ApiOkResponse({ schema: { example: { access_token: '...' } } })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Put('change-password')
  @ApiOperation({summary: "Change User Password"})
  changePassword(@Body() dto: LoginDto){
    return this.auth.changePassword(dto.email, dto.password)
  }
}
