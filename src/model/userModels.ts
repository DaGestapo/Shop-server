
export  interface UserI {
    id: string;
    username: string;
    email: string;
    password: string;
    role?: string;
}

export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

