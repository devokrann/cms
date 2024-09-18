import { Stack, Text, Title } from "@mantine/core";
import React from "react";

export default function Header({ data }: { data: { title: string; desc: string } }) {
	return (
		<Stack gap={"xs"}>
			<Title order={2} ta={{ base: "center", md: "start" }}>
				{data.title}
			</Title>
			<Text ta={{ base: "center", md: "start" }}>{data.desc}</Text>
		</Stack>
	);
}
