import { Controller, Get, UseGuards, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users Informations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private user: UsersService) {}

  @Get('me')
  @ApiOperation({summary: "Get user Profile Info"})
  me(@Req() req: any) {
    // req.user is from JwtStrategy.validate
    return req.user;
  }

  @Delete('delete-account')
  @ApiOperation({summary: "Delete User Account"})
  deleteAccount(@Req() req: any){
    return this.user.DeleteAccount(req.user.userId)
  }
  
  @Delete('delete-all')
  @ApiOperation({summary: "Delete All Users (for testing purposes)"})
  deleteAllusers(){
    return this.user.DeleteAll()
  }
}
