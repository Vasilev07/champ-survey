import { Document, model, Model, Schema } from 'mongoose';

export declare interface ICategory extends Document {
    name: string;
};
export interface CategoryModel extends Model<ICategory> {};

export class Category {
    private _model: Model<ICategory>;

    constructor() {
        const categorySchema = new Schema({
            name: String,
        });

        this._model = model<ICategory>('Category', categorySchema);
    }

    public get model(): Model<ICategory> {
        return this._model;
    }
}