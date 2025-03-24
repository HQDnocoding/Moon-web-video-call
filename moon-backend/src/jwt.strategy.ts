import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


const _secretOrKey:string=process.env.JWTSECRET || "defaultPassword";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _secretOrKey, 
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
