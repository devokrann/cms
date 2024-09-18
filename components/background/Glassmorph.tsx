import React from "react";

import { Box } from "@mantine/core";

import classes from "./Glassmorph.module.scss";

export default function Glassmorph({ children }: { children: React.ReactNode }) {
	return (
		<Box className={classes.root}>
			<div className={classes.underlay}></div>
			{children}
		</Box>
	);
}
