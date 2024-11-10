import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import _omit from 'lodash/omit';

@Injectable()
export class AuthService {
  public constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async signIn(password: string): Promise<any> {
    const apiKey = this.configService.get('API_KEY');

    console.log({
      password,
      apiKey,
      isEquals: bcrypt.compareSync(password, apiKey),
    });
    if (!bcrypt.compareSync(password, apiKey)) {
      throw new UnauthorizedException();
    }

    const payload = {
      uuid: uuidv4(),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '8h',
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '9h',
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });

    return { accessToken, refreshToken };
  }

  private extractTokenFromAuthorization(authorization: string): string {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }

  public async verify(authorization: string) {
    try {
      const hasAccess = this.jwtService.verify(
        this.extractTokenFromAuthorization(authorization),
      );

      return { hasAccess };
    } catch (error) {
      return { hasAccess: false };
    }
  }

  public async refresh(requestBody: any) {
    const token = requestBody.refreshToken;

    const jwtPayload = await this.jwtService.verifyAsync<{}>(token, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    const payload = _omit(jwtPayload, ['exp', 'iat']);

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '4h',
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5h',
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });

    return { accessToken, refreshToken };
  }
}
