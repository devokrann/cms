export interface Contact {
	fname: string;
	lname: string;
	email: string;
	phone: string | null;
	subject: string;
	message: string;
}

export interface SignUp {
	email: string;
	password: string;
}

export interface SignIn {
	email: string;
	password: string;
	remember: boolean;
}
