import React from "react";

import LayoutBody from "@/layouts/Body";
import NavbarMain from "@/partials/navbars/Main";
import FooterMain from "@/partials/footers/Main";
import HeaderMain from "@/partials/headers/Main";
import AsideUser from "@/partials/asides/User";
import LayoutSection from "@/layouts/Section";
import NavbarUser from "@/partials/navbars/User";

import AffixTop from "@/components/affixi/Top";

import contact from "@/data/contact";
import { Metadata } from "next";

import { Divider, Stack } from "@mantine/core";

export const metadata: Metadata = { title: { default: "Account", template: `%s - Account - ${contact.name.app}` } };

export default function LayoutAccount({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
			header={<HeaderMain />}
			nav={<NavbarMain />}
			aside={{
				gap: 48,
				left: {
					component: <AsideUser />,
					width: { md: 30, lg: 22.5 },
					withBorder: true,
				},
			}}
			footer={<FooterMain />}
		>
			<LayoutSection component={"main"} padded>
				<Stack gap={48}>
					<LayoutSection hiddenFrom="md">
						<NavbarUser />
					</LayoutSection>

					<Divider hiddenFrom="md" />

					{children}
				</Stack>
			</LayoutSection>

			<AffixTop />
		</LayoutBody>
	);
}
