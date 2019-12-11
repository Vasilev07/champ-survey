import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UserController } from '../controllers/user-controller';
import { IUserData } from '../interfaces/user-interface';

export const init = (app: any): void => {
    const userController = new UserController();

    app.post('/validate', async (request: Request, response: Response, next: NextFunction) => {
        const userModel = request.body;

        const userObject: IUserData = {
            username: userModel.username,
            email: userModel.email,
            firstname: userModel.firstname,
            lastname: userModel.lastname,
            password: userModel.password,
            confirmationPassword: userModel.confirmationPassword,
        };
        
        try {
            const user = await userController.createUser(userObject);
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return response.redirect('/');
                }
                request.logIn(user, (error) => {
                    if (error) {
                        return next(error);
                    }
                    return response.status(200).redirect('/index');
                });
            })(request, response, next);
        } catch (err) {
            console.log(err);
            response.status(400).json(err);
        }
    }, passport.authenticate('local', {
        successRedirect: '/index',
    }));
};
