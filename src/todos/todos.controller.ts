import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateTodoDto) {
    return this.todos.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.todos.findAllFor(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: number) {
    return this.todos.findOneFor(req.user.userId, Number(id));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: number, @Body() dto: UpdateTodoDto) {
    return this.todos.updateFor(req.user.userId, Number(id), dto);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Req() req: any, @Param('id') id: number) {
    return this.todos.removeFor(req.user.userId, Number(id));
  }
}
