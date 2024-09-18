import React from "react";

import { Metadata } from "next";

import { Card, Flex, Group, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import Brand from "@/components/Brand";

export const metadata: Metadata = { title: "Welcome" };

export default async function Welcome() {
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
									Check Your Email
								</Title>

								<Stack gap={0}>
									<Text ta={{ base: "center" }}>
										Please check your your email for further instructions. Remember to check the
										spam/junk folder(s)
									</Text>
								</Stack>
							</Stack>
						</Flex>
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
