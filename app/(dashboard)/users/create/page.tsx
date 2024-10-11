import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Card, Divider, Group, Stack, Title } from "@mantine/core";
import FormUser from "@/partials/forms/User";

export const metadata: Metadata = { title: "User" };

export default function User() {
	return (
		<LayoutPage stacked='xl'>
			<LayoutSection>
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						New User
					</Title>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<FormUser />
			</LayoutSection>
		</LayoutPage>
	);
}
