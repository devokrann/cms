import React from "react";

import { Metadata } from "next";
import Link from "next/link";

import { Button, Flex, Group, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import AuthSignIn from "@/components/auth/signIn";

import { IconArrowRight } from "@tabler/icons-react";

export const metadata: Metadata = { title: "Authentication Error" };

export default async function SignOut() {
	return (
		<LayoutPage>
			<LayoutSection containerized="xs" padded>
				<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"xl"}>
					<Stack gap={"xs"}>
						<Title ta={{ base: "center", md: "start" }} order={1} fw={"bold"}>
							Authenticaton Error
						</Title>

						<Stack gap={0}>
							<Text ta={{ base: "center", md: "start" }}>Seems we can’t sign you in.</Text>
							<Text ta={{ base: "center", md: "start" }}>
								Perhaps it&apos;s a temporary issue... Try again later.
							</Text>
						</Stack>
					</Stack>

					<Group>
						<AuthSignIn>
							<Button>Try Again</Button>
						</AuthSignIn>
						<Button
							component={Link}
							href={"/"}
							variant="light"
							rightSection={<IconArrowRight size={16} stroke={2} />}
						>
							Back Home
						</Button>
					</Group>
				</Flex>
			</LayoutSection>
		</LayoutPage>
	);
}
