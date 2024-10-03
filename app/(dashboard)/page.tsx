import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Group, Title } from "@mantine/core";

export const metadata: Metadata = { title: "Overview" };

export default function Overview() {
	return (
		<LayoutPage>
			<LayoutSection>
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						Overview
					</Title>
				</Group>
			</LayoutSection>
		</LayoutPage>
	);
}
