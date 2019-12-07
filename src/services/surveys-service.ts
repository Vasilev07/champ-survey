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
        const categoryId = await this.getCategoryIdByName(surveyData.category_name) ? 
            await this.getCategoryIdByName(surveyData.category_name): 
            new Error('no such category');
        const userId =  !isNil(await this.getUserIdByName(surveyData.user_name)) ? 
            await this.getCategoryIdByName(surveyData.user_name): 
            new Error('no such user');
        console.log('categoryId', categoryId);
        console.log(surveyData.user_name);
        console.log('userId', userId);
        if (categoryId instanceof Error) {
            throw categoryId;
        } 

        if (userId instanceof Error) {
            throw userId;
        } 
    
        const surveyToSave = new DB.Models.Survey({
            category_id: categoryId,
            user_id: userId,
            name: surveyData.name,
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

        if (!isNil(foundUser)) {
            return foundUser._id;
        }
    }
}