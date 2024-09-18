import React from "react";

import { Metadata } from "next";
import Link from "next/link";

import { Button, Card, Flex, Group, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import AuthSignIn from "@/components/auth/signIn";

import { IconArrowRight } from "@tabler/icons-react";
import Brand from "@/components/Brand";

export const metadata: Metadata = { title: "Authentication Error" };

export default async function SignOut() {
	return (
		<LayoutPage>
			<LayoutSection containerized="xs" padded>
				<Stack gap={40}>
					<Group justify="center">
						<Brand height={32} />
					</Group>

					<Card withBorder>
						<Flex direction={"column"} align={{ base: "center" }} gap={"xl"}>
							<Stack gap={"xs"}>
								<Title ta={{ base: "center" }} order={1} fw={"bold"}>
									Authenticaton Error
								</Title>

								<Stack gap={0}>
									<Text ta={{ base: "center" }}>Seems we can’t sign you in.</Text>
									<Text ta={{ base: "center" }}>
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
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
