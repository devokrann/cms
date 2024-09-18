import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";

import { Center, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import FormUserNotifications from "@/partials/forms/user/Notifications";
import FormUserAccountPassword from "@/partials/forms/user/settings/Password";
import ModalDeleteAccount from "@/components/modal/delete/Account";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Notifications" };

export default async function Notifications() {
	const session = await auth();

	!session && redirect(process.env.NEXT_PUBLIC_SIGN_IN_URL!);

	return (
		<LayoutPage stacked>
			<LayoutSection>
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12 }}>
						<Stack gap={"xl"}>
							<Title order={2} fw={"bold"}>
								Notification Settings
							</Title>
							<FormUserNotifications />
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
