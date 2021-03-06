import { IAnswer } from "../models/answers-model";
import { AnswersService } from "../services/answers-service";

export class AnswersController {
    private answersService: AnswersService;

    constructor() {
        this.answersService = new AnswersService();
    }

    public async submitAnswer(answerData: IAnswer): Promise<void> {
        await this.answersService.submitAnswer(answerData);
    }

    public async getAllSubmissionsByDate(): Promise<any> {
        return await this.answersService.getAllSubmissionsByDate();
    }

    public async getAllSubmissionsByDayOfWeek(): Promise<any> {
        return await this.answersService.getAllSubmissionsByDayOfWeek();
    }
}