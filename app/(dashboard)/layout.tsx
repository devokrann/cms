import React from "react";

import LayoutBody from "@/layouts/Body";
import FooterMain from "@/partials/footers/Main";
import HeaderMain from "@/partials/headers/Main";
import AsideLeft from "@/partials/asides/Left";

import { Metadata } from "next";

export const metadata: Metadata = { title: `Dashboard` };

export default function LayoutDashboard({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
			header={<HeaderMain />}
			aside={{ left: { component: <AsideLeft />, withBorder: true }, gap: "md" }}
			footer={<FooterMain />}
		>
			<main>{children}</main>
		</LayoutBody>
	);
}
