import { typeDatabaseFields } from "./database";

export enum enumUserRole {
	USER = "USER",
	ADMIN = "ADMININSTRATOR",
	DEV = "DEVELOPER",
}

export enum enumUserStatus {
	ACTIVE = "ACTIVE",
	SUSPENDED = "SUSPENDED",
}

export interface typeUser extends typeDatabaseFields {
	name?: string;
	email: string;
	password?: string;
	verified: boolean | number;
	role: string;
	status: string;
	posts: any[];
	coments: any[];
	replies: any[];
	otps: any[];
	otls: any[];
	profile: any;
	sessions: any;
	accounts: any;
}
