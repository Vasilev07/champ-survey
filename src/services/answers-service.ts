import { DB } from "../controllers/db-controller";
import { IAnswer } from "../models/answers-model";

export class AnswersService {
    public async submitAnswer(answerData: IAnswer): Promise<void> {
        console.log('____answerData', answerData.answer_data);
        console.log('____answerData TYPEOF', typeof answerData.answer_data);
        
        const answerToSave = new DB.Models.Answer({
            ...answerData,
            answer_data: answerData.answer_data,
        });
        await answerToSave.save((err) => {
            if(err) {throw new Error(err)}
        });
    } 
}