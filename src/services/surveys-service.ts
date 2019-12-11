import { isNil } from "lodash";
import { DB } from "../controllers/db-controller";
import { ISurveyData } from "../interfaces/survey-interface";
import { CategoriesService } from "./categories-service";
import { UsersService } from "./users-service";

export class SurveysService {
    private categoryService: CategoriesService;
    private usersService: UsersService;
    constructor() {
        this.categoryService = new CategoriesService();
        this.usersService = new UsersService();
    }
    public async createSurvey(surveyData: ISurveyData): Promise<void> {
        console.log('surveyData', surveyData);
        const categoryId = await this.getCategoryIdByName(surveyData.category_name) ? 
            await this.getCategoryIdByName(surveyData.category_name): 
            new Error('no such category');
        const userId =  !isNil(await this.getUserIdByName(surveyData.username)) ? 
            await this.getCategoryIdByName(surveyData.username): 
            new Error('no such user');
        
        if (categoryId instanceof Error) {
            throw categoryId;
        } 

        if (userId instanceof Error) {
            throw userId;
        } 
        console.log('surveyData.questionData', surveyData.questionData);
        const surveyToSave = new DB.Models.Survey({
            category_id: categoryId,
            user_id: userId,
            name: surveyData.surveyName,
            questionData: surveyData.questionData,
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
        console.log('foundUser', foundUser);
        if (!isNil(foundUser)) {
            return foundUser._id;
        }
    }
}