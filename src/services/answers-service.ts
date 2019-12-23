import { DB } from "../controllers/db-controller";
import { IAnswer } from "../models/answers-model";

export class AnswersService {
    public async submitAnswer(answerData: IAnswer): Promise<void> {
        console.log('____answerData', answerData.answer_data);
        console.log('____answerData TYPEOF', typeof answerData.answer_data);
        
        const answerToSave = new DB.Models.Answer({
            ...answerData,
            answer_data: answerData.answer_data,
            createdAt: new Date(),
        });
        await answerToSave.save((err) => {
            if(err) {throw new Error(err)}
        });
    }

    public formatDates = (submissionDate: Date): string => {
        let day = submissionDate.getDate();
        let dayAsString;
        let month = submissionDate.getMonth() + 1;
        let monthAsString;
        const year = submissionDate.getFullYear();
        if (day < 10) {
            dayAsString = '0' + day;
        }
        if (month < 10) {
            monthAsString = '0' + month;
        }
        return day + '/' + month + '/' + year;
    };

    public async getAllSubmissionsByDate(): Promise<any> {
        const submissions = await DB.Models.Answer.find({});
        const data = [] as any;
        const label = [] as any;
        const submissionDate = submissions.map((submission) => {
                if (submission.createdAt) {
                    return submission.createdAt;
                }
        });
        const dayOfSubmissionsIfExist: any = submissionDate.map((submissionDate) => {
            if (submissionDate) {
                return this.formatDates(submissionDate);
            }
        });
        const submissionDateMap = new Map();

        const dayOfSubmissions = dayOfSubmissionsIfExist.filter((day: any) => day !== undefined);

        dayOfSubmissions.forEach((date: string) => {
            if (submissionDateMap.has(date)) {
                const current = submissionDateMap.get(date);
                submissionDateMap.set(date, current + 1);
            } else {
                submissionDateMap.set(date, 1);
            }
        });
        console.log(submissionDateMap);

        submissionDateMap.forEach((value: number, key: string) => {
            console.log('key', key);
            console.log('value', value);
            data.push(value);
            label.push(key);
        })
        console.log(submissionDateMap);
        // label = label.slice(label.length - 7, 7);
        return {
            data,
            label,
        }
    }
}
