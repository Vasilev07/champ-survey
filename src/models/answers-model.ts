import { Document, model, Model, Schema } from 'mongoose';

export declare interface IAnswer extends Document {
    user_id: string;
    survey_id: string;
    survey_name: string;
    answer_data: any[];
    createdAt: Date,
};
export interface AnswerModel extends Model<IAnswer> {};

export class Answer {
    private _model: Model<IAnswer>;

    constructor() {
        const answerSchema = new Schema({
            user_id: String,
            survey_id: String,
            survey_name: String,
            answer_data: Array,
            createdAt: Date,
        });

        this._model = model<IAnswer>('Answers', answerSchema);
    }

    public get model(): Model<IAnswer> {
        return this._model;
    }
}