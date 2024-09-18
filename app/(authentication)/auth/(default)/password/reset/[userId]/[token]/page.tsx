import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Stack, Group, Card, Divider } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthPasswordReset from "@/partials/forms/auth/password/Reset";
import AuthHeader from "@/partials/auth/Header";
import Brand from "@/components/Brand";

import { auth } from "@/auth";

import { typeParams } from "../../../../layout";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Reset({ params }: { params: typeParams }) {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection padded containerized={"xs"}>
				<Stack gap={40}>
					<Group justify="center">
						<Brand height={32} />
					</Group>

					<Card withBorder>
						<Stack>
							<AuthHeader
								data={{
									title: "Reset Password",
									desc: "Enter a new strong password for your account.",
								}}
							/>

							<Divider />

							<FormAuthPasswordReset data={params} />
						</Stack>
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
