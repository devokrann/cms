import React from "react";

import LayoutBody from "@/layouts/Body";

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<main>{children}</main>
		</LayoutBody>
	);
}
