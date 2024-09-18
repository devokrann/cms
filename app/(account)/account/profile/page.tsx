import React from "react";

import { Anchor, Avatar, Divider, Flex, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormUserProfileDetails from "@/partials/forms/user/profile/Details";
import FormUserAccountPassword from "@/partials/forms/user/settings/Password";
import ModalDeleteAccount from "@/components/modal/delete/Account";

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
	const session = await auth();

	!session && redirect(process.env.NEXT_PUBLIC_SIGN_IN_URL!);

	return (
		<LayoutPage stacked>
			<LayoutSection>
				<Grid>
					<GridCol span={{ base: 12 }}>
						<Title order={2} fz={"xl"}>
							Personal Details
						</Title>
					</GridCol>

					<GridCol span={{ base: 12, md: 8, lg: 5.5 }}>
						<FormUserProfileDetails />
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection>
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12, md: 8, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Update Password
							</Title>
							<FormUserAccountPassword />
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection>
				<Stack gap={"lg"} align="start">
					<Title order={2} fz={"xl"}>
						Delete Account
					</Title>
					<Stack gap={"xs"}>
						<Text>
							Our deletion process complies with the{" "}
							<Anchor inherit href="https://gdpr.eu/" target="_blank">
								GDPR regulations
							</Anchor>
							, which requires us to permanently delete user data upon request. As such, deleting your
							account will permanently remove all data associated with it and therefore be irreversible.
						</Text>
					</Stack>

					<ModalDeleteAccount />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
