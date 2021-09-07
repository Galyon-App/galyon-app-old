import { Role } from "./role.model";

export class Token {
    uuid: string;
    email: string;
    logged_in: boolean;
    role: Role;
}
