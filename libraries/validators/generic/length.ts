import errors from "../errors";
import empty from "./empty";

const hasLength = {
	string(val: string, min: number, max: number, action: Function) {
		return empty.string(val, () => {
			if (val.trim().length < min) {
				return errors.isShort(min);
			} else if (val.trim().length > max) {
				return errors.isLong(max);
			} else return action();
		});
	},

	number(val: number, min: number, max: number, action: Function) {
		return empty.number(val, () => {
			if (val < min) {
				return errors.isShort(min);
			} else if (val > max) {
				return errors.isLong(max);
			} else return action();
		});
	},
};

export default hasLength;
