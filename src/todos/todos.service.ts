import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UsersService } from '../users/users.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
    private users: UsersService,
  ) {}

async create(ownerId: number, dto: CreateTodoDto) {
  const owner = await this.users.findById(ownerId);
  if (!owner) {
    throw new NotFoundException('Owner not found'); // handle properly
  }

  const todo = this.repo.create({
    ...dto,
    owner, // now owner is a real User, not null
  });

  return this.repo.save(todo);
}


  findAllFor(ownerId: number) {
    return this.repo.find({ where: { owner: { id: ownerId } } });
  }

  async findOneFor(ownerId: number, id: number) {
    const todo = await this.repo.findOne({ where: { id }, relations: { owner: true } });
    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.owner.id !== ownerId) throw new ForbiddenException();
    return todo;
  }

  async updateFor(ownerId: number, id: number, dto: UpdateTodoDto) {
    const todo = await this.findOneFor(ownerId, id);
    Object.assign(todo, dto);
    return this.repo.save(todo);
  }

  async removeFor(ownerId: number, id: number) {
    const todo = await this.findOneFor(ownerId, id);
    await this.repo.remove(todo);
    return { deleted: true };
  }
}
