import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...authProviders],
  exports: [AuthService],
})
export class AuthModule {}
