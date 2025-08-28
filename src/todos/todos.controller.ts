import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Todos Handling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  create(@Req() req: any, @Body() dto: CreateTodoDto) {
    return this.todos.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({summary:"Get all the todos of a user "})
  findAll(@Req() req: any) {
    return this.todos.findAllFor(req.user.userId);
  }

  @Get('all')
  @ApiOperation({summary: "Get todos of all users"})
  findAllForTodos(@Req() req: any)
  {
     return this.todos.findAllForTodos()
  }
  @Get(':id')
  @ApiOperation({ summary: 'Create a new todo' })
  findOne(@Req() req: any, @Param('id') id: number) {
    return this.todos.findOneFor(req.user.userId, Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  update(@Req() req: any, @Param('id') id: number, @Body() dto: UpdateTodoDto) {
    return this.todos.updateFor(req.user.userId, Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Req() req: any, @Param('id') id: number) {
    return this.todos.removeFor(req.user.userId, Number(id));
  }

  @Delete('delete-all')
  @ApiOperation({summary: "Delete All Todos (for testing purposes)"})
    deleteAlltodos(){
      return this.todos.removeAll()
    }
  
  @Get('/search/:username')
  @ApiOperation({summary:"get Todos by Username"})
  getTodoByUsername(@Param('username') username: string){
    return this.todos.findByUsername(username)
  }

  @Get('/activity/count')
  @ApiOperation({summary: "Get User's Completed Todos Count"})
  gettodosActivity(@Req() req:any){
    return this.todos.gettodosActivity(req.user.userId)
  }
}
