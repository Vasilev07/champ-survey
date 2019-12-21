import { isNil } from "lodash";
import { DB } from "../controllers/db-controller";
import { ISurveyData } from "../interfaces/survey-interface";
import { ISurvey } from "../models/survey-model";
import { CategoriesService } from "./categories-service";
import { CryptoService } from "./crypto-service";
import { UsersService } from "./users-service";

export class SurveysService {
    private categoryService: CategoriesService;
    private usersService: UsersService;
    constructor() {
        this.categoryService = new CategoriesService();
        this.usersService = new UsersService();
    }

    public async createSurvey(surveyData: ISurveyData): Promise<void> {

        const categoryId = await this.getCategoryIdByName(surveyData.category_name) ? 
            await this.getCategoryIdByName(surveyData.category_name): 
            new Error('no such category');

        const userId = await this.getUserIdByName(surveyData.username) ? 
            await this.getUserIdByName(surveyData.username): 
            new Error('no such user');
        
        if (categoryId instanceof Error) {
            throw categoryId;
        } 

        if (userId instanceof Error) {
            throw userId;
        } 

        const surveyToSave = new DB.Models.Survey({
            category_id: categoryId,
            user_id: userId,
            name: surveyData.surveyName,
            questionData: surveyData.questionData,
            createdAt: new Date(),
        });
        
        await surveyToSave.save((err) => {
            if (err) { throw new Error(err)};
        })
    }

    public async getCategoryIdByName(categoryName: string): Promise<string | undefined> {
        const foundCategory = await this.categoryService.getCategoryByName({ name: categoryName});
        if (!isNil(foundCategory)) {
            return foundCategory._id;
        }
    } 

    public async getUserIdByName(username: string): Promise<string | undefined> {
        const foundUser = await this.usersService.findUserByUsername(username);

        if (!isNil(foundUser) && foundUser._id) {
            
            return foundUser._id.toString();
        }

        return undefined;
    }

    public async getUserSurveysData(username: string, category: any): Promise<any> {
        const cryptography = new CryptoService();
        const categoryService = new CategoriesService();
        const userId = await this.getUserIdByName(username);
        const surveys = await DB.Models.Survey.find({user_id: userId});
        const serveysCount = surveys.length; 
        // console.log('surveys', surveys);

        if (!userId) {
            throw new Error('No user provied');
        }

        const surveyData = surveys.map(async (survey) => {
            const currentSurveyCategoryId = survey.category_id;

            const category = await categoryService.getCategoryById(currentSurveyCategoryId);
            
            if (!category) {
                throw new Error('no such category');
            }

            return {
                id: survey.id,
                name: survey.name,
                encryptedUrl: cryptography.encrypt(userId, survey.name),
                category: category.name,
                createdAt: new Date(),
                uniqueSubmissions: 0,
            }
        });
        
        // console.log('surveyData', surveyData);

        return await Promise.all(surveyData);
    }

    public async getSurvey(userId: string, surveyName: string): Promise<ISurvey | null> {
        return await DB.Models.Survey.findOne({ user_id: userId, name: surveyName });
    }

    public async getUserSurveyData(url: any): Promise<any> {
        const cryptography = new CryptoService();
        const decrypt = cryptography.decrypt(url);
        const [userId, , surveyName] = decrypt.split(/(\&\&)/);

        const survey = await this.getSurvey(userId, surveyName);

        if (!survey) {
            throw new Error('no such survey');
        }
        const category = await this.categoryService.getCategoryById(survey.category_id);
        if (!category) {
            throw new Error('no such category');
        }
        
        return {
            user_id: survey.user_id,
            survey_id: survey._id,
            name: survey.name,
            createdAt: survey.createdAt,
            categoryName: category.name,
            questionData: survey.questionData,
        };
    }
}