import { Request, Response } from 'express';
import path from 'path';
import { AnswersController } from '../controllers/answers-controller';
import { CategoriesController } from '../controllers/categories-controller';
import { SurveyController } from '../controllers/survey-controller';
import { IUser } from '../models/user-model';

export const init = (app: any): void => {
    // console.log(data);
    const categoriesController = new CategoriesController();
    const surveysController = new SurveyController();
    const answersController = new AnswersController();

    app.set('views', path.join(__dirname, '../views'));

    app.post('/create', async (request: Request, response: Response) => {
        const surveyData = request.body;
        const user: any = request.user;

        await surveysController.createSurvey({
            ...surveyData, 
            questionData: JSON.parse(surveyData.questionData), 
            username: user.username
        });

        return response.status(200).json(request.body);
    });

    app.post('/create/category', async (request: Request, response: Response) => {
        const categoryName: string = request.body.categoryName;

        await categoriesController.createCategory({ name: categoryName });

        return response.redirect(200, '/create');
    });

    app.post('/get-user', (request: Request, response: Response) => {
        const userRequest = request.user;
       
        if (!userRequest) {
            return response.status(400).send('user not found');
        }

        return response.status(200).send(userRequest);
    });

    app.post('/user-surveys', async (request: Request, response: Response) => {
        const userRequest = request.user as IUser;
        const category = request.body.category;
        // console.log('userRequest', userRequest);
        // console.log('category', category);

        if (!userRequest) {
            return response.status(400).send('user not found');
        }

        const surveys = await surveysController.getUserSurveysData(userRequest.username, category);

        // console.log('serveys in routes', surveys);
        return response.status(200).send(surveys);
    });

    app.post('/submit', async (request: Request, response: Response) => {
        const data = { 
            ...JSON.parse(request.body.surveyData),
            answer_data: [...JSON.parse(request.body.answer_data)]
        };

        delete data.questionData;

        try {
            await answersController.submitAnswer(data);
        } catch (err) {
            console.log(err);
        }

        response.send(data);
    });

    app.post('/statistics', async (request: Request, response: Response) => {
        try {
            const statisticsPie = 
                await categoriesController.getAllUserCategories();
            const statisticsDataDonut =
                await surveysController.getAllQuestionTypes();
            const statisticsDataBarByDate =
                await answersController.getAllSubmissionsByDate();
            // const statisticsDataBarByDay =
            //     await dataController.getAllSubmissionsByDayOfWeek();
            const context = {
                labelPie: statisticsPie.label,
                dataPie: statisticsPie.data,
                labelDonut: statisticsDataDonut.label,
                dataDonut: statisticsDataDonut.data,
                labelBar: statisticsDataBarByDate.label,
                dataBar: statisticsDataBarByDate.data,
                // dataBarDay: statisticsDataBarByDay.label,
                // labelBarDay: statisticsDataBarByDay.data,
            };
            // console.log(context)
            response.status(200).send(context);
        } catch (error) {
            response.status(500).end();
        }
    })
};
