import { google, GoogleApis, oauth2_v2 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthProps, GoogleCredentials } from './google.types';
import { InternalServerErrorException } from '@nestjs/common';

export class GoogleAuth {
  private auth: OAuth2Client;
  private authUrl: string;
  private authToken: string;
  private scopes: string[];
  public google: GoogleApis;

  private static instance: GoogleAuth;

  private constructor({ credentials, scopes }: GoogleAuthProps) {
    this.google = google;
    this.scopes = scopes;
    this.auth = new google.auth.OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris[2],
    );
  }

  public hasPermission() {
    return Boolean(this.authUrl);
  }

  public userConsent() {
    this.authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });

    console.log({ authUrl: this.authUrl });

    return this;
  }

  public static getInstance(args?: GoogleAuthProps) {
    if (!GoogleAuth.instance && !args) {
      throw new Error('GoogleAuthProps is required');
    }
    if (!GoogleAuth.instance && args) {
      GoogleAuth.instance = new GoogleAuth(args);
    }

    return GoogleAuth.instance;
  }

  public getAuth() {
    return this.auth;
  }

  public getAuthUrl() {
    return this.authUrl;
  }

  public getAuthToken() {
    return this.authToken;
  }

  public static getAuthToken() {
    return this.getInstance().getAuthToken();
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  public static setAuthToken(authToken: string) {
    this.getInstance().setAuthToken(authToken);
  }

  public async requestAccessToken() {
    console.log({ authToken: this.authToken });

    try {
      const requestPromise = new Promise((resolve, reject) => {
        this.auth.getToken(this.authToken, (error, tokens) => {
          if (error) {
            reject(error);
          }

          resolve(tokens);
        });
      });

      this.auth.setCredentials(await requestPromise);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
