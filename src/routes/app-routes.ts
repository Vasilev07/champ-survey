import { Request, Response } from 'express';
import { CategoriesController } from '../controllers/categories-controller';

export const init = (app: any) => {
    const categoriesController = new CategoriesController();
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
    });

    app.get('/create',async (request: Request, response: Response) => {
        if (!request.isAuthenticated()) {
            return response.redirect('/');
        }

        const categories = await categoriesController.getAllCategories();

        const model = {
            categories,
            // questionTypes,
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
        };
        return response.render('create-survey/create-survey-master', model);
    });

};