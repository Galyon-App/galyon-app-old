import { Role } from "./role.model";

export class User {
    uuid: string;
    uname: string;
    email: string;
    phone: string;
    fname: string;
    lname: string;
    role: Role;
    token?: string;
}
