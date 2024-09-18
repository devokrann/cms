import { initialize } from "@/handlers/parsers/string";
import { Avatar, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";

export default function Aside() {
	const session = useSession();

	return (
		<Flex direction={{ base: "column", lg: "row" }} align={"center"} gap={"md"} w={"100%"}>
			{session?.data?.user.image ? (
				<Avatar
					src={session.data.user.image}
					alt={session.data.user.name ? session.data.user.name : "User"}
					title={session.data?.user.name ? session.data?.user.name : "User"}
					w={{ base: 56, md: 120, lg: 56 }}
					h={{ base: 56, md: 120, lg: 56 }}
				/>
			) : (
				<Avatar
					alt={session.data?.user.name ? session.data?.user.name : "User"}
					title={session.data?.user.name ? session.data?.user.name : "User"}
					w={{ base: 56, md: 120, lg: 56 }}
					h={{ base: 56, md: 120, lg: 56 }}
				>
					{session.data?.user.name
						? initialize(session.data?.user.name)
						: session.data?.user.email?.charAt(0).toUpperCase()}
				</Avatar>
			)}

			<Stack gap={0}>
				<Title order={3} fz={"md"} ta={{ base: "center", lg: "start" }}>
					{session.data?.user.name}
				</Title>
				<Text fz={"xs"} c={"dimmed"} ta={{ base: "center", lg: "start" }}>
					{session.data?.user.email}
				</Text>
			</Stack>
		</Flex>
	);
}
