import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import UserService from '../services/users/user.service';
import config from '../../includes/config/config';
import * as constants from '../../includes/config/constants';
import { Request } from 'express';
import { IPayloadJWT } from '../../types';

class JwtMiddleware {
  protected UserService: UserService;
  protected JwtOptions: { secretOrKey: string; jwtFromRequest: (req: Request) => string };

  constructor() {
    this.JwtOptions = {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    this.UserService = new UserService();
  }

  verify: VerifiedCallback = async (payload: IPayloadJWT, done:any) => {
    try {
      if (payload.type !== constants.TOKEN_TYPE_ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await this.UserService.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  };

  getStrategy() {
    const jwtStrategy = new Strategy(this.JwtOptions, this.verify);
    return jwtStrategy;
  }
}

export default new JwtMiddleware();