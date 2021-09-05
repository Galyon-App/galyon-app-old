import { Role } from "./role.model";

export class User {
    uuid: string;
    email: string;
    logged_in: boolean;
    role: Role;
}
