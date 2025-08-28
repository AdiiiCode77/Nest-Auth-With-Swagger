import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(email: string, username:string, password: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create(email, username, passwordHash);

    return this.sign(user.id, user.email, user.username);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user.id, user.email, user.username);
  }

  async changePassword(email: string, newPassword: string){
    const user = await this.users.findByEmail(email)
    if(user){
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.users.changePassword(email,passwordHash)
      return this.sign(user.id,user.email, user.username)
      
    }
  }
  private sign(sub: number, email: string, username: string) {
    const access_token = this.jwt.sign({ sub, email, username });
    return { access_token };
  }

}
