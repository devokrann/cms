export const errors = {
	isEmpty: "Please fill out this field",
	isShort: (length: number) => `At least ${length} characters`,
	isLong: (length: number) => `At most ${length} characters`,
	isMatch: (field: string) => `${field}'s must match`,
	isInvalid: (field: string) => `Invalid ${field} format`,
	isPassword: "Must include an uppercase, lowercase, number and symbol",
	isText: "Exclude numbers here",
	isUnchecked: "Check this box to continue",

	isInauthentic: (field: string) => `Incorrect ${field}`,
};

export default errors;
