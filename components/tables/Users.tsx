"use client";

import React, { useState } from "react";

import {
	ActionIcon,
	Checkbox,
	Group,
	Table,
	TableCaption,
	TableScrollContainer,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
} from "@mantine/core";

import classes from "./Users.module.scss";
import { IconSelector } from "@tabler/icons-react";

export default function Users() {
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const date = new Date(Date.now());

	const users = [
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
		{ name: "Jane Doe", email: "jane@example.com", status: "ACTIVE", created: date },
	];

	const rows = users.map(user => (
		<TableTr key={user.name} bg={selectedRows.includes(user.email) ? "var(--mantine-color-gray-1)" : undefined}>
			<Table.Td>
				<Checkbox
					size="xs"
					aria-label="Select row"
					checked={selectedRows.includes(user.email)}
					onChange={event =>
						setSelectedRows(
							event.currentTarget.checked
								? [...selectedRows, user.email]
								: selectedRows.filter(position => position !== user.email)
						)
					}
				/>
			</Table.Td>

			<TableTd>{user.name}</TableTd>
			<TableTd>{user.email}</TableTd>
			<TableTd>{user.status}</TableTd>
			<TableTd>{user.created.toDateString()}</TableTd>
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
								Name
							</Text>
							{sortButton}
						</Group>
					</TableTh>
					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Email
							</Text>
							{sortButton}
						</Group>
					</TableTh>
					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Statue
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
						Showing 25 of 367 users
					</Text>

					<Text component="span" inherit>
						Pagination
					</Text>
				</Group>
			</TableCaption>
		</Table>
	);
}
