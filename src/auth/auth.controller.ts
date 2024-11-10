import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginSchema } from './dto';
import { Public } from './auth.decorator';
import { ZodValidationPipe } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  public signIn(@Body() { apiKey }: LoginDto) {
    return this.authService.signIn(apiKey);
  }

  @Post('check-token')
  public check(@Request() req: any) {
    return this.authService.verify(req.headers.authorization);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public refresh(@Body() body: any) {
    return this.authService.refresh(body);
  }
}
