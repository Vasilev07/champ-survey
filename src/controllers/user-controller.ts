import { IUserData } from '../interfaces/user-interface';
import { UsersService } from '../services/users-service';

export class UserController {
    public usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();
    }
    public async createUser(user: IUserData): Promise<any> {
       return await this.usersService.createUser(user);
    }

    public async validateUsername(username: string): Promise<IUserData | null> {
        return await this.usersService.validateUsername(username);
    }
}