import { enumDateType } from "@/types/enums";

interface TimeDifference {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

export const getTimeDifference = (
	targetDate: Date,
	dateType: enumDateType
): { valid: boolean; difference?: TimeDifference } => {
	const currentDate = new Date();

	let valid: boolean;

	let years: number;
	let months: number;
	let days: number;
	let hours: number;
	let minutes: number;
	let seconds: number;

	// handle different date types
	switch (dateType) {
		case enumDateType.PAST:
			valid = targetDate < currentDate;

			if (!valid) {
				return { valid };
			} else {
				years = currentDate.getFullYear() - targetDate.getFullYear();
				months = currentDate.getMonth() + years * 12 - targetDate.getMonth();
				days = currentDate.getDate() - targetDate.getDate();
				hours = currentDate.getHours() - targetDate.getHours();
				minutes = currentDate.getMinutes() - targetDate.getMinutes();
				seconds = currentDate.getSeconds() - targetDate.getSeconds();

				return { valid, difference: { years, months, days, hours, minutes, seconds } };
			}
		case enumDateType.FUTURE:
			valid = targetDate > currentDate;

			if (!valid) {
				return { valid };
			} else {
				years = targetDate.getFullYear() - currentDate.getFullYear();
				months = targetDate.getMonth() - currentDate.getMonth() + years * 12;
				days = targetDate.getDate() - currentDate.getDate();
				hours = targetDate.getHours() - currentDate.getHours();
				minutes = targetDate.getMinutes() - currentDate.getMinutes();
				seconds = targetDate.getSeconds() - currentDate.getSeconds();

				return { valid, difference: { years, months, days, hours, minutes, seconds } };
			}
		default:
			throw new Error("Unsupported date type");
	}
};

export const parseDateYmd = (dateStr: Date) => {
	const date = new Date(dateStr);

	// Format date as 'yy/mm.dd'
	const formattedDate = date.toLocaleDateString("en-GB", {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
	});

	const finalFormat = formattedDate.replace("/", "/").replace("/", ".");

	return finalFormat; // "24/09.16"
};
