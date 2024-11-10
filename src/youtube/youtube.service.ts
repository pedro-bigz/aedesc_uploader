import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { GoogleService } from 'src/google';
import { Youtube } from './utils';
import { SCOPES } from './youtube.constants';

@Injectable()
export class YoutubeService {
  private readonly youtube: Youtube;

  public constructor(private readonly googleService: GoogleService) {
    this.youtube = new Youtube(this.googleService.authenticate(SCOPES));
  }

  public getChannels() {
    return this.youtube.getChannels();
  }

  public async uploadVideo(content: any) {
    const videoFilePath = './content/output.mov';
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `${content.prefix} ${content.searchTerm}`;
    const videoTags = [content.searchTerm, ...content.sentences[0].keywords];
    const videoDescription = content.sentences
      .map((sentence) => {
        return sentence.text;
      })
      .join('\n\n');

    const requestParameters = {
      part: 'snippet, status',
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    };

    console.log('> [youtube-robot] Starting to upload the video to YouTube');
    const youtubeResponse = await this.youtube.insertVideos(requestParameters, {
      onUploadProgress: onUploadProgress,
    });

    console.log(
      `> [youtube-robot] Video available at: https://youtu.be/${youtubeResponse.data.id}`,
    );
    return youtubeResponse.data;

    function onUploadProgress(event) {
      const progress = Math.round((event.bytesRead / videoFileSize) * 100);
      console.log(`> [youtube-robot] ${progress}% completed`);
    }
  }
}
