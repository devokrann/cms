export interface typeFormContact {
	fname: string;
	lname: string;
	email: string;
	phone: string | null;
	subject: string;
	message: string;
}

export interface typeSignUp {
	email: string;
	password: string;
}

export interface typeSignIn {
	email: string;
	password: string;
	remember: boolean;
}
