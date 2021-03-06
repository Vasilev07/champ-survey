import { isNil } from "lodash";
import { Error } from "mongoose";
import { DB } from "../controllers/db-controller";
import { IUserData } from "../interfaces/user-interface";
import { CryptoService } from "./crypto-service";


export class UsersService {
    private cryptoService: CryptoService;

    constructor() {
        this.cryptoService = new CryptoService();
    }
    public async createUser(user: IUserData): Promise<any> {
        const hashedPassword = await this.cryptoService.hashPassword(user.password);
        const isUsernameTaken = await isNil(this.validateUsername(user.username));
        const isEmailInValid = await this.validateEmail(user.email);
        let doesPasswordsMatch: any;
        if(user.confirmationPassword) {
            doesPasswordsMatch = this.validatePasswords(user.password, user.confirmationPassword)
        }
        
        if (isUsernameTaken) {
            throw new Error('This username is already taken');
        }

        if (isEmailInValid instanceof Error) {
            return isEmailInValid;
        }

        if (!doesPasswordsMatch) {
            throw new Error('Passwords does not match');
        }

        const userToSave = new DB.Models.User({
            username: user.username,
            password: hashedPassword,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });

        await userToSave.save((err) => {
            if(err) {
                throw new Error(err);
            }
        })
    } 
    
    private validatePasswords(password: string, confirmationPassword: string): boolean {
        console.log(password);
        console.log(confirmationPassword);
        return password === confirmationPassword;
    }

    public async findUserByUsername(username: string): Promise<IUserData | null> {
        return await DB.Models.User.findOne({ username });
    }

    public async getAllEmails(): Promise<string[] | null> {
        const allUsers = await DB.Models.User.find({ })
        return allUsers.map((user) => user.email);
    }

    public async validateUsername(username: string): Promise<IUserData | null>{
        const searchForUser = await this.findUserByUsername(username);
        
        return searchForUser;
    }

    private async validateEmail(email: string): Promise<string | Error> {
        const emails = await this.getAllEmails();
        const isEmailTaken = emails ? emails.includes(email) : false;
        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const validateEmail = pattern.test(email);

        if (isEmailTaken) {
            throw new Error('This email is already taken');
        } else if (email === '') {
            throw new Error('This email is empty');
        } else if (validateEmail === false) {
            throw new Error('This email is invalid');
        } else {
            return email;
        }
    }
}
