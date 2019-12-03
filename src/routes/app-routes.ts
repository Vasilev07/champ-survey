import { Request, Response } from 'express';

export const init = (app: any) => {
    app.get('/', async (request: Request, response: Response) => {
        // const statisticsData = await dataController.getAllUsersCategories();
        const context = {
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
            label: 'test',
            data: 'test',
        };

        response.render('shared-views/master', context);
    });

    app.get('/index', async (request: Request, response: Response) => {
        let categories = [];
        if (!request.isAuthenticated()) {
            return response.redirect('/');
        }

        try {
            // categories = await dataController.getAllCategories();
        } catch (err) {
            categories = [];
        }

        return response.render('index', {
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
            // categories,
        });
    })

};