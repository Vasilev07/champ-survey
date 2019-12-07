import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { CategoriesController } from '../controllers/categories-controller';
import { SurveyController } from '../controllers/survey-controller';

export const init = (app: any): void => {
    // console.log(data);
    const categoriesController = new CategoriesController();
    const surveysController = new SurveyController();

    app.set('views', path.join(__dirname, '../views'));

    app.get('/', (request: Request, response: Response, next: NextFunction) => {
        // response.send('Hello Georgi!');
        response.render('../views/index.pug');
    });

    app.post('/create', async (request: Request, response: Response) => {
        const surveyData = request.body;
        const username: any = request.body;
        console.log(username);

        await surveysController.createSurvey({...surveyData, user_name: username});

        return response.status(200).json(request.body);
    });

    app.post('/create/category', async (request: Request, response: Response) => {
        const categoryName: string = request.body.categoryName;

        await categoriesController.createCategory({ name: categoryName });

        return response.redirect(200, '/create');
    });
};
