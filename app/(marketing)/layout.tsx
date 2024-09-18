import React from "react";

import LayoutBody from "@/layouts/Body";
import NavbarMain from "@/partials/navbars/Main";
import FooterMain from "@/partials/footers/Main";
import HeaderMain from "@/partials/headers/Main";

import AffixTop from "@/components/affixi/Top";

export default function LayoutMarketing({
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
