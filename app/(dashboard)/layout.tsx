import React from "react";

import LayoutBody from "@/layouts/Body";
import NavbarMain from "@/partials/navbars/Main";
import FooterMain from "@/partials/footers/Main";
import HeaderMain from "@/partials/headers/Main";

import AffixTop from "@/components/affixi/Top";
import { Metadata } from "next";
import contact from "@/data/contact";

export const metadata: Metadata = { title: { default: "Dashboard", template: `%s - Dashboard - ${contact.name.app}` } };

export default function LayoutDashboard({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody header={<HeaderMain />} nav={<NavbarMain />} footer={<FooterMain />}>
			<main>{children}</main>

			<AffixTop />
		</LayoutBody>
	);
}
