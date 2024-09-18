import errors from "../errors";
import isEmpty from "../generic/empty";

const phone = (val: string) =>
	isEmpty.string(val, () => !/^(07)\d{8}$/.test(val.trim()) && errors.isInvalid("phone number"));

export default phone;
