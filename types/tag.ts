import { typeDatabaseFields } from "./database";
import { typePost } from "./post";

export interface typeTag extends typeDatabaseFields {
	title: string;

	posts?: typePost[];
}
