import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Card, Divider, Group, Stack, Title } from "@mantine/core";
import HeroMain from "@/layouts/heros/Main";

import InputSearchBlog from "@/components/input/search/Blog";
import InputSelectBlog from "@/components/input/select/Blog";
import TableBlog from "@/components/tables/Blog";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Posts" };

export default function Posts() {
	return (
		<LayoutPage my={"xl"}>
			<HeroMain />

			<LayoutSection margined="xl" containerized="responsive">
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						Blog Posts
					</Title>

					<Button leftSection={<IconPlus size={16} stroke={1.5} />} component={Link} href={"/create/post"}>
						New Post
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection margined="xl" containerized="responsive">
				<Stack>
					<Card withBorder shadow="xs" padding={"xs"}>
						<Group justify="space-between">
							<InputSearchBlog />

							<Group gap={"xs"}>
								<InputSelectBlog />
								<Divider orientation="vertical" />
								<Button size="xs">Clear Filters</Button>
							</Group>
						</Group>
					</Card>

					<Card withBorder padding={0} shadow="xs" c={"inherit"}>
						<TableBlog />
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
