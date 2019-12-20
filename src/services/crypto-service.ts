import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class CryptoService {
    private algorithm = 'aes-128-ctr';
    private key = new Buffer('9vApxLk5G3PAsJrM', 'utf8');
    private iv = new Buffer('FnJL7EDzjqWjcaY9', 'utf8');

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async comparePasswords(password: string, hash: any): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public encrypt(user: string, survey: string, date = null) {
        let text;
        if (date) {
            text = user + '&&' + survey + '&&' + date;
        } else {
            text = user + '&&' + survey;
        }
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    public decrypt(text: string): any {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');

        return dec;
    }
}