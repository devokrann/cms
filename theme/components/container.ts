import cx from "clsx";

import classes from "./Container.module.scss";

const container = {
	defaultProps: {
		mx: "auto",
	},

	classNames: (_: any, { size }: { size?: any }) => ({
		root: cx({ [classes.root]: size === "responsive" }),
	}),
};

export default container;
