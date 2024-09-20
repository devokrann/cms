"use client";

import React, { useEffect, useState } from "react";

import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Center,
	Checkbox,
	Divider,
	Group,
	NumberFormatter,
	Pagination,
	Select,
	Skeleton,
	Stack,
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
import { Icon, IconChevronDown, IconChevronUp, IconSelector, IconTrash } from "@tabler/icons-react";
import { typeUser } from "@/types/user";
import { enumSort, enumUserStatus } from "@/types/enums";
import { enumRequest } from "@/types/enums";
import { parseDateYmd } from "@/handlers/parsers/date";
import ModalUserDelete from "../modals/user/Delete";
import InputSearchUser from "@/components/input/search/User";
import { capitalizeWord } from "@/handlers/parsers/string";

interface typeSortObject {
	order: enumSort;
	button: React.ReactNode;
}

enum enumTableUsers {
	NAME = "NAME",
	EMAIL = "EMAIL",
	ROLE = "ROLE",
	STATUS = "STATUS",
	CREATED = "CREATED",
}

export default function Users() {
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

	// paginate logic
	const [activePage, setPage] = useState(1);
	const [items, setItems] = useState<typeUser[]>([]);

	const divisors = [5, 10, 15, 20, 25];
	const [divisor, setDivisor] = useState<string | null>(divisors[0].toString());
	const divisorOptions = divisors.map(o => {
		return { value: o.toString(), label: `Show ${o}` };
	});

	useEffect(() => {
		if (users) {
			const chunkedUsers = chunkUsers(users!, Number(divisor));

			setItems(chunkedUsers[activePage - 1].map(item => item));
		}
	}, [users, activePage, divisor]);

	// sorting logic
	const getSortButtons = (field: enumTableUsers) => {
		return {
			ascending: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconChevronUp size={16} stroke={1.5} />
				</ActionIcon>
			),
			descending: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconChevronDown size={16} stroke={1.5} />
				</ActionIcon>
			),
			default: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconSelector size={16} stroke={1.5} />
				</ActionIcon>
			),
		};
	};

	const [nameOrder, setNameOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTableUsers.NAME).default,
	});
	const [emailOrder, setEmailOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTableUsers.EMAIL).default,
	});
	const [roleOrder, setRoleOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTableUsers.ROLE).default,
	});
	const [statusOrder, setStatusOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTableUsers.STATUS).default,
	});
	const [createdOrder, setCreatedOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTableUsers.CREATED).default,
	});

	const sortItems = (field: enumTableUsers) => {
		switch (field) {
			case enumTableUsers.NAME:
				setNameOrder(prevNameOrder => {
					if (prevNameOrder.order == enumSort.DEFAULT || prevNameOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'name' ascending
						// setItems(prevItems => [...prevItems].sort((a, b) => a.name.localeCompare(b.name)));

						setItems(prevItems => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...prevItems].filter(item => item.name);
							const nullNames = [...prevItems].filter(item => !item.name);

							// Sort the array with valid names
							validNames.sort((a, b) => a.name!.localeCompare(b.name!));

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.NAME).ascending,
						};
					} else {
						setItems(prevItems => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...prevItems].filter(item => item.name);
							const nullNames = [...prevItems].filter(item => !item.name);

							// Sort the array with valid names
							validNames.sort((a, b) => a.name!.localeCompare(b.name!)).reverse();

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTableUsers.NAME).descending,
						};
					}
				});
				break;

			case enumTableUsers.EMAIL:
				setEmailOrder(prevEmailOrder => {
					if (prevEmailOrder.order == enumSort.DEFAULT || prevEmailOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'email' ascending
						setItems(prevItems => [...prevItems].sort((a, b) => a.email.localeCompare(b.email)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.EMAIL).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'email' descending
						setItems(prevItems => [...prevItems].sort((a, b) => a.email.localeCompare(b.email)).reverse());

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTableUsers.EMAIL).descending,
						};
					}
				});
				break;

			case enumTableUsers.ROLE:
				setRoleOrder(prevRoleOrder => {
					if (prevRoleOrder.order == enumSort.DEFAULT || prevRoleOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'role' ascending
						setItems(prevItems => [...prevItems].sort((a, b) => a.role.localeCompare(b.role)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.ROLE).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'role' descending
						setItems(prevItems => [...prevItems].sort((a, b) => a.role.localeCompare(b.role)).reverse());

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTableUsers.ROLE).descending,
						};
					}
				});
				break;

			case enumTableUsers.STATUS:
				setStatusOrder(prevStatusOrder => {
					if (prevStatusOrder.order == enumSort.DEFAULT || prevStatusOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'status' ascending
						setItems(prevItems => [...prevItems].sort((a, b) => a.status.localeCompare(b.status)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.STATUS).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'status' descending
						setItems(prevItems =>
							[...prevItems].sort((a, b) => a.status.localeCompare(b.status)).reverse()
						);

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTableUsers.STATUS).descending,
						};
					}
				});
				break;

			case enumTableUsers.CREATED:
				setCreatedOrder(prevCreatedOrder => {
					if (prevCreatedOrder.order == enumSort.DEFAULT || prevCreatedOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'created at' ascending
						setItems(prevItems =>
							[...prevItems].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateA.getTime() - dateB.getTime(); // Sort by time value
							})
						);

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.CREATED).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'created at' descending
						setItems(prevItems =>
							[...prevItems].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateB.getTime() - dateA.getTime(); // Sort by time value
							})
						);

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTableUsers.CREATED).descending,
						};
					}
				});
				break;
		}
	};

	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const active = selectedRows.length > 0;

	const rows = items?.map(user => (
		<TableTr key={user.email} bg={selectedRows.includes(user.email) ? "var(--mantine-color-gray-1)" : undefined}>
			<Table.Td>
				<Center>
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
				</Center>
			</Table.Td>

			<TableTd>{user.name}</TableTd>
			<TableTd>{user.email}</TableTd>
			<TableTd>{capitalizeWord(user.role)}</TableTd>
			<TableTd>
				<Badge size="xs" variant="light" color={getStatusColor(user.status as enumUserStatus)}>
					{user.status}
				</Badge>
			</TableTd>
			<TableTd>{parseDateYmd(user.createdAt!)}</TableTd>
			<TableTd>
				<Center>
					<ModalUserDelete data={user}>
						<ActionIcon color="red" variant="light">
							<IconTrash size={16} stroke={1.5} />
						</ActionIcon>
					</ModalUserDelete>
				</Center>
			</TableTd>
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

	return (
		<Stack>
			<Card withBorder shadow="xs" padding={"xs"} style={{ overflow: "unset" }}>
				<Stack>
					<Group justify="space-between">
						<InputSearchUser />

						<Group gap={"xs"}>
							{/* <InputSelectUser /> */}
							<Select
								size="xs"
								w={120}
								defaultValue={divisorOptions[0].value}
								placeholder={divisorOptions[0].label}
								data={divisorOptions}
								value={divisor}
								onChange={setDivisor}
							/>
							<Divider orientation="vertical" />
							<Button size="xs">Clear Filters</Button>
						</Group>
					</Group>

					<Group>
						<Button size="xs" disabled={!active} color="red" variant="light">
							Deactivate ({selectedRows.length})
						</Button>
						<Button size="xs" disabled={!active} color="green" variant="light">
							Activate ({selectedRows.length})
						</Button>
					</Group>
				</Stack>
			</Card>

			<Card withBorder padding={0} shadow="xs" c={"inherit"}>
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
								<Center>
									<Checkbox
										size="xs"
										aria-label="Select row"
										checked={users?.length != 0 && selectedRows.length == users?.length}
										onChange={event =>
											setSelectedRows(
												event.currentTarget.checked ? users?.map(u => u.email)! : []
											)
										}
									/>
								</Center>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Name
									</Text>
									{nameOrder?.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Email
									</Text>
									{emailOrder?.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Role
									</Text>
									{roleOrder?.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Status
									</Text>
									{statusOrder?.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Created On
									</Text>
									{createdOrder?.button}
								</Group>
							</TableTh>

							<TableTh />
						</TableTr>
					</TableThead>

					<TableTbody>{!users ? [skeletonRow, skeletonRow, skeletonRow] : rows}</TableTbody>

					<TableCaption>
						<Group justify="space-between">
							<Text component="span" inherit>
								Showing <NumberFormatter thousandSeparator value={rows.length} /> of{" "}
								<NumberFormatter thousandSeparator value={users?.length} /> users
							</Text>

							{!users ? (
								<Group gap={"xs"}>
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
								</Group>
							) : (
								<Pagination
									size={"sm"}
									total={Math.ceil(users.length / Number(divisor))}
									value={activePage}
									onChange={setPage}
									defaultValue={1}
								/>
							)}
						</Group>
					</TableCaption>
				</Table>
			</Card>
		</Stack>
	);
}

const getStatusColor = (status: enumUserStatus) => {
	switch (status) {
		case enumUserStatus.ACTIVE:
			return "green";
		case enumUserStatus.SUSPENDED:
			return "yellow";
	}
};

const chunkUsers = (array: typeUser[], size: number): typeUser[][] => {
	if (!array.length) {
		return [];
	}

	const head = array.slice(0, size);
	const tail = array.slice(size);

	return [head, ...chunkUsers(tail, size)];
};
