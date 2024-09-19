import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Button, Card, Divider, Group, Stack, Title } from "@mantine/core";
import HeroMain from "@/layouts/heros/Main";
import TableUsers from "@/components/tables/Users";
import InputSearchUser from "@/components/input/search/User";
import InputSelectUser from "@/components/input/select/User";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Users" };

export default function Users() {
	return (
		<LayoutPage my={"xl"}>
			<HeroMain />

			<LayoutSection margined="xl" containerized="responsive">
				<Group justify="space-between">
					<Title order={1} fz={"xl"}>
						Users
					</Title>

					<Button leftSection={<IconPlus size={16} stroke={1.5} />} component={Link} href={"/create/user"}>
						New User
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection margined="xl" containerized="responsive">
				<Stack>
					<Card withBorder shadow="xs" padding={"xs"} style={{ overflow: "unset" }}>
						<Group justify="space-between">
							<InputSearchUser />

							<Group gap={"xs"}>
								<InputSelectUser />
								<Divider orientation="vertical" />
								<Button size="xs">Clear Filters</Button>
							</Group>
						</Group>
					</Card>

					<Card withBorder padding={0} shadow="xs" c={"inherit"}>
						<TableUsers />
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
