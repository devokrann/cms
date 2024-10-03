import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Card, Divider, Group, Stack, Title } from "@mantine/core";
import FormPost from "@/partials/forms/Post";

export const metadata: Metadata = { title: "Posts" };

export default function Posts() {
	return (
		<LayoutPage stacked="xl">
			<LayoutSection>
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						New Post
					</Title>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<FormPost />
			</LayoutSection>
		</LayoutPage>
	);
}
