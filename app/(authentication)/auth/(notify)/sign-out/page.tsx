import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button, Flex, Group, Stack, Text, Title } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import AuthSignOut from "@/components/auth/signOut";

import { auth } from "@/auth";

export const metadata: Metadata = { title: "Sign Out" };

export default async function SignOut() {
	const session = await auth();

	!session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection containerized="xs" padded>
				<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"xl"}>
					<Stack gap={"xs"}>
						<Title ta={{ base: "center", md: "start" }} order={1} fw={"bold"}>
							Sign Out
						</Title>

						<Stack gap={0}>
							<Text ta={{ base: "center", md: "start" }}>Are you sure you want to sign out?</Text>
						</Stack>
					</Stack>

					<Group>
						<AuthSignOut>
							<Button>Sign Out</Button>
						</AuthSignOut>
						<Button
							component={Link}
							href={"/"}
							variant="light"
							rightSection={<IconArrowRight size={16} stroke={2} />}
						>
							Go Home
						</Button>
					</Group>
				</Flex>
			</LayoutSection>
		</LayoutPage>
	);
}
