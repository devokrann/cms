export interface TimeDifference {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

export enum DateType {
	PAST = "past",
	FUTURE = "future",
}
