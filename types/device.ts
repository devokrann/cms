import { typeDatabaseFields } from "./database";
import { typeIpInfo } from "./ipInfo";

interface typeIPOS extends typeIpInfo {
	os: string;
}

export interface typeDevice extends typeIPOS {
	session: any;
}
