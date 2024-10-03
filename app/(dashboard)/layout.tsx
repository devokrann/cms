import React from "react";

import LayoutShell from "@/layouts/Shell";
import HeroMain from "@/layouts/heros/Main";
import FooterMain from "@/partials/footers/Main";

import { Metadata } from "next";
import contact from "@/data/contact";
import { Box, Stack } from "@mantine/core";

export const metadata: Metadata = { title: { default: `Dashboard`, template: `%s - ${contact.name.app}` } };

export default function LayoutDashboard({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutShell>
			<Box>
				<Stack p={"md"} gap={"xl"}>
					<HeroMain />

					{children}
				</Stack>

				<FooterMain />
			</Box>
		</LayoutShell>
	);
}
