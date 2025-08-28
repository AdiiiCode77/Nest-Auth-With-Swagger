import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UsersService } from '../users/users.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
  
   findAllForTodos() {
    return this.repo.find();
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

async findByUsername(username: string) {
  return this.userRepo.findOne({ where: { username }, relations: { todos: true } });
}
  removeAll(){
    return this.repo.clear()
  }

  async gettodosActivity(ownerId: number) {
    console.log("Owner ID:", ownerId); // Debugging line
    const user = await this.userRepo.findOne({ where: { id: ownerId }, relations: { todos: true } })
    if(!user) throw new NotFoundException('User not found')
    const todos = await this.repo.find({where: {owner: {id: ownerId}}})
    if(todos){
      const completedCount = todos.filter(todo => todo.done).length;
      const incompletedCount = todos.filter(todo => !todo.done).length;
    return {
      message: "Hello " + user.username + ", you have completed " + completedCount + " todos and have " + incompletedCount + " todos remaining.",
      completedTodos: completedCount,
    }
    }
    else
    return 0
}
}
