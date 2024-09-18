import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, Divider, Group, Stack } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthPasswordForgot from "@/partials/forms/auth/password/Forgot";
import AuthHeader from "@/partials/auth/Header";
import Brand from "@/components/Brand";

import { auth } from "@/auth";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function Forgot() {
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
									title: "Forgot Password",
									desc: "An email containing a password reset link will be sent to the provided address.",
								}}
							/>

							<Divider />

							<FormAuthPasswordForgot />
						</Stack>
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
