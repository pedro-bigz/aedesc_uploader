import { Controller, Get } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('channels')
  public getChannels() {
    console.log('channels');
    return this.youtubeService.getChannels();
  }
}
