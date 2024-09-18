import errors from "../errors";

const isEmpty = {
	string: (val: string, action: Function) => (val.trim() ? action() : errors.isEmpty),

	number: (val: number, action: Function) => (val ? action() : errors.isEmpty),

	checkbox: (val: boolean) => !val && errors.isUnchecked,
};

export default isEmpty;
