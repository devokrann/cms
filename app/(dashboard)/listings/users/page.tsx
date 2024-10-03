import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Group, Title } from "@mantine/core";
import TableUsers from "@/components/tables/Users";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Users" };

export default function Users() {
	return (
		<LayoutPage stacked="xl">
			<LayoutSection>
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						Users
					</Title>

					<Button leftSection={<IconPlus size={16} stroke={1.5} />} component={Link} href={"/create/user"}>
						New User
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<TableUsers />
			</LayoutSection>
		</LayoutPage>
	);
}
