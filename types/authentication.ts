export interface typeSession {
	accessToken?: string;
	expires: string;
	user: {
		name: string;
		email: string;
		id: string;
		image: string;
	};
}
