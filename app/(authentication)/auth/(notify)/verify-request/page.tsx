import React from "react";

import { Metadata } from "next";

import { Flex, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = { title: "Welcome" };

export default async function Welcome() {
	return (
		<LayoutPage>
			<LayoutSection containerized="xs" padded>
				<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"xl"}>
					<Stack gap={"xs"}>
						<Title ta={{ base: "center", md: "start" }} order={1} fw={"bold"}>
							Check Your Email
						</Title>

						<Stack gap={0}>
							<Text ta={{ base: "center", md: "start" }}>
								Please check your your email for further instructions. Remember to check the spam/junk
								folder(s)
							</Text>
						</Stack>
					</Stack>
				</Flex>
			</LayoutSection>
		</LayoutPage>
	);
}
