import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Group, Title } from "@mantine/core";
import TableBlog from "@/components/tables/Blog";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Posts" };

export default function Posts() {
	return (
		<LayoutPage stacked="xl">
			<LayoutSection>
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						Blog Posts
					</Title>

					<Button leftSection={<IconPlus size={16} stroke={1.5} />} component={Link} href={"/create/post"}>
						New Post
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<TableBlog />
			</LayoutSection>
		</LayoutPage>
	);
}
