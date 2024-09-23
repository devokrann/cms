import { typeDatabaseFields } from "./database";
import { typePost } from "./post";

export interface typeCategory extends typeDatabaseFields {
	title: string;

	posts?: typePost[];
}
