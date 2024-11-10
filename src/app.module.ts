import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from './common';
import { AuthController, AuthModule, AuthService } from './auth';
import { YoutubeModule } from './youtube/youtube.module';
import { GoogleModule } from './google';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    }),
    CommonModule,
    AuthModule,
    GoogleModule,
    YoutubeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
  exports: [AuthService],
})
export class AppModule {}
