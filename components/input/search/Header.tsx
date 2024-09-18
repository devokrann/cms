"use client";

import React from "react";

import { TextInput } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconBlockquote, IconDashboard, IconSearch, IconUser } from "@tabler/icons-react";

export default function Header() {
	return (
		<>
			<TextInput
				onClick={spotlight.open}
				leftSection={<IconSearch size={16} stroke={1} />}
				placeholder="Search..."
				styles={{
					input: { paddingLeft: "var(--mantine-spacing-xl)" },
				}}
			/>

			<Spotlight
				actions={actions}
				nothingFound="Nothing found..."
				highlightQuery
				searchProps={{
					leftSection: <IconSearch size={20} stroke={1} />,
					placeholder: "Search...",
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
