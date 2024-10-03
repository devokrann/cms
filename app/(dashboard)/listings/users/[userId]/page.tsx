import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";
import { Grid, GridCol, Title } from "@mantine/core";
import HeroMain from "@/layouts/heros/Main";
import { getUsers } from "@/handlers/database/users";
import { typeParams } from "../layout";
import { UserRelations } from "@/types/model/user";

export const metadata: Metadata = { title: "User Details" };

export default async function User({ params }: { params: typeParams }) {
	const users: UserRelations[] = await getUsers();
	const user = users.find(u => u.id == params.userId);

	return (
		<LayoutPage my={"xl"}>
			<HeroMain />

			<Title order={1} fz={"xl"}>
				{user?.name ? user.name : user?.email}
			</Title>

			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<LayoutSection margined="xl" containerized="responsive">
						form
					</LayoutSection>
				</GridCol>
				<GridCol span={{ base: 12, md: 8 }}></GridCol>
			</Grid>
		</LayoutPage>
	);
}
