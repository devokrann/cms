import React from "react";

import { Box, Container } from "@mantine/core";

import { typeSection } from "@/types/layout";

import classes from "./Section.module.scss";

export default function Section({
	containerized,
	padded,
	margined,
	className,
	bordered,
	shadowed,
	bg,
	children,
	...restProps
}: typeSection & React.ComponentProps<typeof Box & typeof Container>) {
	return (
		<Box
			component={"section"}
			py={padded ? (typeof padded == "boolean" ? 64 : padded) : ""}
			my={margined ? (typeof margined == "boolean" ? 64 : margined) : ""}
			className={
				(className ? `${className}` : "") +
				(bordered ? ` ${classes.border}` : "") +
				(shadowed ? ` ${classes.shadow}` : "")
			}
			bg={bg}
			{...restProps}
		>
			{containerized ? (
				<Container size={typeof containerized == "boolean" ? "" : containerized}>
					<React.Fragment>{children}</React.Fragment>
				</Container>
			) : (
				<React.Fragment>{children}</React.Fragment>
			)}
		</Box>
	);
}
