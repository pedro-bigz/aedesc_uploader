import { Injectable } from '@nestjs/common';
import { GoogleAuth } from './google.auth';
import credentials from '@credentials';

@Injectable()
export class GoogleService {
  private auth: any;

  public constructor() {}

  public authenticate(scopes: string[]) {
    this.auth = GoogleAuth.getInstance({
      credentials,
      scopes,
    });

    if (!this.auth.hasPermission()) {
      this.auth.userConsent();
    }

    return this.auth;
  }

  public setAuthorizationToken(token: string) {
    console.log({ token });
    this.auth.setAuthToken(token);
    return this.auth.requestAccessToken();
  }

  public getAuthorizationToken() {
    return this.auth.getAuthToken();
  }
}
