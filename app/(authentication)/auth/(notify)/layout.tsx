import React from "react";

import { Center } from "@mantine/core";

import LayoutBody from "@/layouts/Body";

export default function Notify({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<Center mih={"100vh"}>{children}</Center>
		</LayoutBody>
	);
}
