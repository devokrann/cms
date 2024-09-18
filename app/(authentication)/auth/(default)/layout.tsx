import React from "react";

import { Center } from "@mantine/core";

import LayoutBody from "@/layouts/Body";

export interface typeParams {
	userId: string;
	token: string;
}

export default function LayoutDefault({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<Center mih={"100vh"} px={{ md: 40 }}>
				{children}
			</Center>
		</LayoutBody>
	);
}
