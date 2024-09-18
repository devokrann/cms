import React from "react";

import { Box, Stack } from "@mantine/core";

import { typePage } from "@/types/layout";

export default function Page({
	children,
	padded,
	stacked,
	...restProps
}: typePage & React.ComponentProps<typeof Box & typeof Stack>) {
	return (
		<Box
			component={stacked ? Stack : "article"}
			w={"100%"}
			gap={stacked ? (typeof stacked == "boolean" ? 64 : stacked) : undefined}
			py={padded ? (typeof padded == "boolean" ? 64 : padded) : undefined}
			{...restProps}
		>
			{children}
		</Box>
	);
}
