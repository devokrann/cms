import errors from "../errors";
import isEmpty from "../generic/empty";

const email = (val: string) =>
	isEmpty.string(val, () => !/^\S+@\S+\.\S+$/.test(val.trim()) && errors.isInvalid("email"));

export default email;
