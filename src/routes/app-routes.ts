import { Request, Response } from 'express';
import { CategoriesController } from '../controllers/categories-controller';
import { ConfigController } from '../controllers/config-controller';
import { SurveyController } from '../controllers/survey-controller';
import { UserController } from '../controllers/user-controller';
import { IUser } from '../models/user-model';
import { CryptoService } from '../services/crypto-service';

export const init = (app: any) => {
    const categoriesController = new CategoriesController();
    const configController = new ConfigController();
    const surveysController = new SurveyController();
    const userController = new UserController();
    const cryptoService = new CryptoService();

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
        // console.log('++++++++', param);
        // console.log('ASDASKJDASHJDKJASHDKJASHDKJASHDKJHASKJDH');
        try {
            const surveys = await surveysController.getUserSurveyData(param);
            // console.log('_______in controller', surveys)
            response.send(surveys);
        } catch (err) {
            response.status(500).json('err some fucking err');
        }
    });

    app.post('/check-survey-name', async (request: Request, response: Response) => {
        const username = request.body.username;

        const checkUniqueSurveyName = userController.validateUsername(username);

        response.send(checkUniqueSurveyName);
    });

    app.post('/generate-share', async (request: Request, response: Response) => {
        const body = request.body;

        if (!request || !request.user || !request.user) {
            throw new Error('no user attached to request')
        }
        const user = request.user as IUser;
        const encryptedUrl = cryptoService.encrypt(user.username, body.surveyName);
        const finalUrl = request.protocol + '://' + request.get('host') + '/preview/' + encryptedUrl;

        response.status(200).json(finalUrl);
    });

    app.get('/analyze/:url', async (request: Request, response: Response) => {

        response.render('preview-survey/statistic', {
            isAuthenticated: request.isAuthenticated(),
            user: request.user,
            surveyContentData: [{}],
        });
    });
};