"use client";

import React, { useEffect, useState } from "react";

import {
	ActionIcon,
	Badge,
	Checkbox,
	Group,
	NumberFormatter,
	Skeleton,
	Table,
	TableCaption,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
} from "@mantine/core";

import classes from "./Users.module.scss";
import { IconSelector } from "@tabler/icons-react";
import { enumUserStatus, typeUser } from "@/types/user";
import { enumRequest } from "@/types/request";
import { parseDateYmd } from "@/handlers/parsers/date";

export default function Users() {
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [users, setUsers] = useState<typeUser[] | null>(null);

	useEffect(() => {
		const getUsers = async () => {
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
				method: enumRequest.GET,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const res = await response.json();

			// asign users
			setUsers(res.users);
		};

		getUsers();
	}, []);

	const rows = users?.map(user => (
		<TableTr key={user.email} bg={selectedRows.includes(user.email) ? "var(--mantine-color-gray-1)" : undefined}>
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
			<TableTd>{user.role}</TableTd>
			<TableTd>
				<Badge size="xs" variant="light" color={getStatusColor(user.status as enumUserStatus)}>
					{user.status}
				</Badge>
			</TableTd>
			<TableTd>{parseDateYmd(user.createdAt!)}</TableTd>
		</TableTr>
	));

	const skeletonRow = (
		<TableTr>
			<TableTd />

			<TableTd>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
		</TableTr>
	);

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
					<TableTh>
						<Checkbox
							size="xs"
							aria-label="Select row"
							checked={selectedRows.length == users?.length}
							onChange={event =>
								setSelectedRows(event.currentTarget.checked ? users?.map(u => u.email)! : [])
							}
						/>
					</TableTh>

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
								Role
							</Text>
							{sortButton}
						</Group>
					</TableTh>
					<TableTh>
						<Group gap={"xs"}>
							<Text component="span" inherit>
								Status
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

			<TableTbody>{!users ? [skeletonRow, skeletonRow, skeletonRow] : rows}</TableTbody>

			<TableCaption>
				<Group justify="space-between">
					<Text component="span" inherit>
						Showing <NumberFormatter thousandSeparator value={users?.length} /> of{" "}
						<NumberFormatter thousandSeparator value={users?.length} /> users
					</Text>

					<Text component="span" inherit>
						Pagination
					</Text>
				</Group>
			</TableCaption>
		</Table>
	);
}

const getStatusColor = (status: enumUserStatus) => {
	switch (status) {
		case enumUserStatus.ACTIVE:
			return "green";
		case enumUserStatus.SUSPENDED:
			return "red";
	}
};
