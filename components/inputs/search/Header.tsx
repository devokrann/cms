"use client";

import React from "react";

import { Text, TextInput } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconBlockquote, IconDashboard, IconSearch, IconUser } from "@tabler/icons-react";

export default function Header() {
	return (
		<>
			<TextInput
				onClick={spotlight.open}
				leftSection={<IconSearch size={16} stroke={1.5} />}
				styles={{
					input: { paddingLeft: "var(--mantine-spacing-xl)" },
				}}
				component={"button"}
			>
				<Text component="span" inherit fz={"xs"} c={"dimmed"}>
					Search all...
				</Text>
			</TextInput>

			<Spotlight
				actions={actions}
				nothingFound="Nothing found"
				highlightQuery
				searchProps={{
					leftSection: <IconSearch size={20} stroke={1.5} />,
					placeholder: "Search all...",
				}}
			/>
		</>
	);
}

const actions: SpotlightActionData[] = [
	{
		id: "overview",
		label: "Overview",
		description: "Get an overview of all the system data",
		onClick: () => console.log("overview"),
		leftSection: <IconDashboard size={24} stroke={1} />,
	},
	{
		id: "users",
		label: "Users",
		description: "Get all information about system users",
		onClick: () => console.log("users"),
		leftSection: <IconUser size={24} stroke={1} />,
	},
	{
		id: "blog",
		label: "Blog",
		description: "Get all information about user posts",
		onClick: () => console.log("blog"),
		leftSection: <IconBlockquote size={24} stroke={1} />,
	},
];
