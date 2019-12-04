import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { CategoriesController } from '../controllers/categories-controller';

export const init = (app: any): void => {
    // console.log(data);
    const categoriesController = new CategoriesController();
    app.set('views', path.join(__dirname, '../views'));

    app.get('/', (request: Request, response: Response, next: NextFunction) => {
        // response.send('Hello Georgi!');
        response.render('../views/index.pug');
    });

    app.post('/create/category', async (request: Request, response: Response) => {
        const categoryName: string = request.body.categoryName;

        await categoriesController.createCategory({ name: categoryName });

        return response.redirect('/create');
    });
};
