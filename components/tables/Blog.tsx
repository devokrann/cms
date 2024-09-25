"use client";

import React, { useState } from "react";

import {
	ActionIcon,
	Badge,
	Checkbox,
	Group,
	Table,
	TableCaption,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
} from "@mantine/core";

import { IconSelector } from "@tabler/icons-react";

import classes from "./Blog.module.scss";

export default function Blog() {
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const date = new Date(Date.now());

	const blog = [
		{
			title: "Inclusive Design: Accessible Websites for All Users",
			category: "category#1",
			created: date,
		},
		{
			title: "Web Design Trends 2023: Stay Ahead of the Curve",
			category: "category#2",
			created: date,
		},
		{
			title: "User-Centric Web Design: Strategies for Better UI/UX",
			category: "category#3",
			created: date,
		},
		{
			title: "Inclusive Design: Accessible Websites for All Users",
			category: "category#1",
			created: date,
		},
		{
			title: "Web Design Trends 2023: Stay Ahead of the Curve",
			category: "category#3",
			created: date,
		},
		{
			title: "User-Centric Web Design: Strategies for Better UI/UX",
			category: "category#2",
			created: date,
		},
		{
			title: "Inclusive Design: Accessible Websites for All Users",
			category: "category#4",
			created: date,
		},
		{
			title: "Web Design Trends 2023: Stay Ahead of the Curve",
			category: "category#1",
			created: date,
		},
		{
			title: "User-Centric Web Design: Strategies for Better UI/UX",
			category: "category#2",
			created: date,
		},
		{
			title: "Inclusive Design: Accessible Websites for All Users",
			category: "category#3",
			created: date,
		},
		{
			title: "Web Design Trends 2023: Stay Ahead of the Curve",
			category: "category#4",
			created: date,
		},
		{
			title: "User-Centric Web Design: Strategies for Better UI/UX",
			category: "category#2",
			created: date,
		},
	];

	const rows = blog.map(post => (
		<TableTr key={post.title} bg={selectedRows.includes(post.title) ? "var(--mantine-color-gray-1)" : undefined}>
			<Table.Td>
				<Checkbox
					size="xs"
					aria-label="Select row"
					checked={selectedRows.includes(post.title)}
					onChange={event =>
						setSelectedRows(
							event.currentTarget.checked
								? [...selectedRows, post.title]
								: selectedRows.filter(position => position !== post.title)
						)
					}
				/>
			</Table.Td>

			<TableTd>{post.title}</TableTd>

			<TableTd>
				<Badge color={"gray"} variant="light" size="xs">
					{post.category}
				</Badge>
			</TableTd>

			<TableTd>{post.created.toDateString()}</TableTd>
		</TableTr>
	));

	const sortButton = (
		<ActionIcon size={16} variant="light">
			<IconSelector size={16} stroke={1.5} />
		</ActionIcon>
	);

	return (
		<Table
			verticalSpacing={"sm"}
			classNames={{
				thead: classes.thead,
				caption: classes.caption,
			}}
		>
			<TableThead tt={"uppercase"}>
				<TableTr>
					<TableTh />

					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Title
							</Text>
							{sortButton}
						</Group>
					</TableTh>

					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Category
							</Text>
							{sortButton}
						</Group>
					</TableTh>

					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Created On
							</Text>
							{sortButton}
						</Group>
					</TableTh>
				</TableTr>
			</TableThead>

			<TableTbody>{rows}</TableTbody>

			<TableCaption>
				<Group justify="space-between">
					<Text component="span" inherit>
						Showing 10 of 73 posts
					</Text>

					<Text component="span" inherit>
						Pagination
					</Text>
				</Group>
			</TableCaption>
		</Table>
	);
}
