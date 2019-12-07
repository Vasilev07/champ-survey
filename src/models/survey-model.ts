import { Document, model, Model, Schema } from 'mongoose';

export declare interface ISurvey extends Document {
    name: string;
    user_id: string;
    category_id: string;
};
export interface SurveyModel extends Model<ISurvey> {};

export class Survey {
    private _model: Model<ISurvey>;

    constructor() {
        const surveySchema = new Schema({
            name: String,
            user_id: String,
            category_id: String,
        });

        this._model = model<ISurvey>('Survey', surveySchema);
    }

    public get model(): Model<ISurvey> {
        return this._model;
    }
}