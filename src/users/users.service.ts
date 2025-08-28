import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, username:string, passwordHash: string) {
    const user = this.repo.create({ email,username, passwordHash });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async changePassword(email:string, passwordHash:string){
    const user = await this.findByEmail(email)
    if(user){
      user.passwordHash = passwordHash
      return this.repo.save(user)
    }
    return null
  }
  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  DeleteAccount(id: number){
    return this.repo.delete(id)
  }
  DeleteAll(){
    return this.repo.clear()
  }
}
