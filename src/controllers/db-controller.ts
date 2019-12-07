import { connect, connection, Connection } from 'mongoose';
import { Category, CategoryModel } from '../models/category-model';
import { Config, ConfigModel } from '../models/config-model';
import { Survey, SurveyModel } from '../models/survey-model';
import { User, UserModel } from '../models/user-model';

declare interface IModels {
    User: UserModel;
    Category: CategoryModel;
    Survey: SurveyModel;
    Config: ConfigModel;
}

export class DB {

    private static instance: DB;
    private uri: string = "mongodb://localhost:27017/blueprint";
    private _db: Connection; 
    private _models: IModels;

    private constructor() {
        connect(this.uri, { useNewUrlParser: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            User: new User().model,
            Category: new Category().model,
            Survey: new Survey().model,
            Config: new Config().model,
            // this is where we initialise all models
        }
    }

    public static get Models() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error: Error) {
        console.log('Mongoose has errored', error);
    }
}