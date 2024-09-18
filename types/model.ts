interface typeModified {
	createdAt: Date;
	updatedAt: Date;
}

export interface typeUser extends typeModified {
	id: string;
	name?: string;
	email: string;
	password?: string;
	verified: boolean | number;
	role: string;
	posts: any[];
	coments: any[];
	replies: any[];
	otps: any[];
	otls: any[];
	profile: any;
	sessions: any;
	accounts: any;
}
