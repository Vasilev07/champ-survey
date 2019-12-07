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
}