import { IConfigData } from "../interfaces/config-interfavce";
import { ConfigService } from "../services/config-service";

export class ConfigController {
    private configService: ConfigService;

    constructor(){
        this.configService = new ConfigService();
    }
    
    public async getAllConfigs(): Promise<IConfigData[]> {
        return await this.configService.getAllConfigs();
    }

    public async getQuestionTypes(): Promise<any> {
        return await this.configService.getQuestionTypes();
    }
}