import errors from "../errors";
import isEmpty from "../generic/empty";
import hasLength from "../generic/length";

const text = (val: string, min: number, max: number, withNumbers?: boolean) =>
	isEmpty.string(val, () =>
		hasLength.string(val, min, max, () => (withNumbers ? null : /[0-9]/.test(val.trim()) && errors.isText))
	);

export default text;
