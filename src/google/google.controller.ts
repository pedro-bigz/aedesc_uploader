import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Public } from 'src/auth';

@Controller('google')
export class GoogleController {
  public constructor(private readonly googleService: GoogleService) {}

  @Public()
  @Get()
  public oAuth2Callback(@Query('code') code: string) {
    return this.googleService.setAuthorizationToken(code);
  }
}
