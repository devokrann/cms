import errors from "../errors";
import isEmpty from "../generic/empty";
import hasLength from "../generic/length";

const password = (val: string, min: number, max: number) =>
	isEmpty.string(val, () =>
		hasLength.string(
			val,
			min,
			max,
			() =>
				!(
					/[$&+,:;=?@#|'<>.^*()%!-]/.test(val.trim()) &&
					/[0-9]/.test(val.trim()) &&
					/[a-z]/.test(val.trim()) &&
					/[A-Z]/.test(val.trim())
				) && errors.isPassword
		)
	);

export default password;
