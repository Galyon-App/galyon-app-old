import { Role } from "./role.model";

export class Users {
    uuid: string = '';
    email: string = '';
    phone: string = '';
    username: string = '';
    type: Role = Role.User;
    cover: string = '';
    first_name: string = '';
    last_name: string = '';
}