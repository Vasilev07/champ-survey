import { flatten } from "lodash";
import { DB } from "../controllers/db-controller";
import { IConfigData } from "../interfaces/config-interfavce";

export class ConfigService {

    public async createConfig(): Promise<void> {
        const questionTypes: string[] = [
            "slider", 
            "date", 
            "emoji", 
            "multiple-choice", 
            "single-choice", 
            "text-box"
        ];
        const config = new DB.Models.Config({ questionTypes });

        await config.save((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }

    public async getAllConfigs(): Promise<IConfigData[]> {
        return await DB.Models.Config.find({ });
    }

    public async getQuestionTypes(): Promise<IConfigData[]> {
        const allConfigs = await this.getAllConfigs();

        const questionTypesConfig = allConfigs.filter((config) => config.questionTypes !== (undefined || null));
        return flatten(
            questionTypesConfig.map((currentQuestionTypesConfig) => currentQuestionTypesConfig.questionTypes) as any
        );
    }

    public async checkIfQuestionTypesExist(): Promise<void | undefined> {
        const questionTypes = await this.getQuestionTypes();

        if (questionTypes.length > 0) {
            return;
        }

        await this.createConfig();
    }
}