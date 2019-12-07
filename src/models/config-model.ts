import { Document, model, Model, Schema } from 'mongoose';

export declare interface IConfig extends Document {
    questionTypes?: string[];
};
export interface ConfigModel extends Model<IConfig> {};

export class Config {
    private _model: Model<IConfig>;

    constructor() {
        const configSchema = new Schema({
            questionTypes: Array,
        });

        this._model = model<IConfig>('Config', configSchema);
    }

    public get model(): Model<IConfig> {
        return this._model;
    }
}