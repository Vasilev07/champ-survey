import { Request, Response } from 'express';
import { CategoriesController } from '../controllers/categories-controller';
import { ConfigController } from '../controllers/config-controller';
import { SurveyController } from '../controllers/survey-controller';

export const init = (app: any) => {
    const categoriesController = new CategoriesController();
    const configController = new ConfigController();
    const surveysController = new SurveyController();

    app.get('/', async (request: Request, response: Response) => {
        // const categories = await categoriesController.getAllCategories();
        // const context = {
        //     isAuthenticated: request.isAuthenticated(),
        //     user: request.user,
        //     label: [],
        //     data: [],
        // };

        response.render('../views/shared-views/master.pug');
    });

    app.get('/index', async (request: Request, response: Response) => {
        if (!request.isAuthenticated()) {
            return response.redirect('/');
        }

        const categories = await categoriesController.getAllCategories();
        // console.log(categories);
        return response.render('index', {
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
            categories,
        });
    });

    app.get('/create',async (request: Request, response: Response) => {
        if (!request.isAuthenticated()) {
            return response.redirect('/');
        }

        const categories = await categoriesController.getAllCategories();
        const questionTypes = await configController.getQuestionTypes();

        const model = {
            categories,
            questionTypes,
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
        };
        
        return response.render('create-survey/create-survey-master', model);
    });

    app.get('/preview/:url', async (request: Request, response: Response) => {
        response.render('preview-survey/preview', {
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
        });
    });

    app.get('/:url', async (request: Request, response: Response) => {
        const param = request.params.url;
        console.log('++++++++', param);
        console.log('ASDASKJDASHJDKJASHDKJASHDKJASHDKJHASKJDH');
        try {
            const surveys = await surveysController.getUserSurveyData(param);
            console.log('_______in controller', surveys)
            response.send(surveys);
        } catch (err) {
            response.status(500).json('err some fucking err');
        }
    })
};