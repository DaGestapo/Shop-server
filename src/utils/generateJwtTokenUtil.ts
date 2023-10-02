import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '../model/userModels';

export default (id: string, email: string, username: string, role: UserRoleEnum): string | null => {
    if(!process.env.SECRET_KEY) return null;
    return jwt.sign(
        {id, username, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}