import { youtube_v3 } from 'googleapis';
import { GoogleAuth } from '../../google/google.auth';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';

export interface SpreadsheetData {
  spreadsheetId: string;
  range?: string;
}

export const YOUTUBE_DEFAULT_VERSION = 'v3';

export class Youtube {
  private auth: GoogleAuth;
  private youtube: youtube_v3.Youtube;

  public constructor(auth: GoogleAuth) {
    this.auth = auth;
    this.youtube = this.auth.google.youtube({
      version: YOUTUBE_DEFAULT_VERSION,
      auth: this.auth.getAuth(),
    });
  }

  public getYoutube() {
    return this.youtube;
  }

  public getChannels() {
    return this.youtube.channels;
  }

  public insertVideos(...args: any[]): GaxiosPromise<youtube_v3.Schema$Video> {
    return this.youtube.videos.insert(...args);
  }
}
