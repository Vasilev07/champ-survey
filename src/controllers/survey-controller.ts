import { ICategoryData } from "../interfaces/category-interface";
import { ISurveyData } from "../interfaces/survey-interface";
import { SurveysService } from "../services/surveys-service";

export class SurveyController {
    private surveysService: SurveysService;

    constructor() {
        this.surveysService = new SurveysService();
    }
    public async createSurvey(serveyData: ISurveyData): Promise<void> {
        await this.surveysService.createSurvey(serveyData);
    }

    public async getUserSurveysData(username: string, category: ICategoryData): Promise<any> {
        return await this.surveysService.getUserSurveysData(username, category);
    }

    public async getUserSurveyData(url: string): Promise<any> {
        return await this.surveysService.getUserSurveyData(url);
    }

    public async getAllQuestionTypes(): Promise<any> {
        return await this.surveysService.getAllQuestionTypes();
    }
}