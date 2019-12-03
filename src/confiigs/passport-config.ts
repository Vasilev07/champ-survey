import cookieParser from 'cookie-parser';
import session from 'express-session';
import { isNil } from 'lodash';
import passport from 'passport';
import * as passportLocal from 'passport-local';
import { IUserData } from '../interfaces/user-interface';
import { CryptoService } from '../services/crypto-service';
import { UsersService } from "../services/users-service";
import * as config from './index';

const cryptoService = new CryptoService();
const Strategy = passportLocal.Strategy;

export const passportInit = (app: any) => {
    const usersService = new UsersService();

    passport.use(new Strategy(async (username: any, password: any, done: any) => {
        const user = await usersService.findUserByUsername(username);
        if (!isNil(user)) {
            const comparePasswords = await cryptoService.comparePasswords;

            if (!user) {
                done(null, false, {
                    message: 'Incorrect username',
                });
            }

            const checkPasswords = comparePasswords(password, user.password);

            if (!checkPasswords) {
                done(null, false, {
                    message: 'Incorrect password',
                });
            }

            return done(null, user);
        }

    }));

    passport.serializeUser((user: IUserData, done) => {
        done(null, user.username);
    });

    passport.deserializeUser(async (username: string, done: any) => {
        let user;
        try {
            user = await usersService.findUserByUsername(username);

            if (!user) {
                return done(new Error('Invalid user'));
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });

    app.use(cookieParser());
    app.use(session({
        secret: config.secret,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};