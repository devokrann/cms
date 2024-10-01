import { IpInfo } from "./ipInfo";

interface IPOS extends IpInfo {
	os: string;
}

export interface Device extends IPOS {
	session: any;
}
