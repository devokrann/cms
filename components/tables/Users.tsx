"use client";

import React, { useEffect, useState } from "react";

import {
	ActionIcon,
	Anchor,
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
	Tooltip,
} from "@mantine/core";

import classes from "./Users.module.scss";
import {
	IconChevronDown,
	IconChevronUp,
	IconSelector,
	IconTrash,
	IconUserCheck,
	IconUserExclamation,
	IconUserX,
} from "@tabler/icons-react";
import { enumSort, enumUserStatus } from "@/types/enums";
import { parseDateYmd } from "@/handlers/parsers/date";
import ModalUserDelete from "../modals/user/Delete";
import InputSearchUser from "@/components/inputs/search/User";
import { capitalizeWord, linkify } from "@/handlers/parsers/string";
import Link from "next/link";
import { getUsers } from "@/handlers/database/users";
import { UserRelations } from "@/types/model/user";
import ModalUserDeactivate from "../modals/user/Deactivate";
import ModalUserActivate from "../modals/user/Activate";
import { useSearchParams } from "next/navigation";

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
	// const searchParams = useSearchParams();

	// const paramName = searchParams.get("name");

	// useEffect(() => {
	// 	if (paramName) {
	// 		setItems(users?.filter(i => linkify(i.name!)?.includes(linkify(paramName)))!);
	// 	}
	// }, [paramName]);

	const [users, setUsers] = useState<UserRelations[] | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const result = await getUsers();
			setUsers(result);
		};

		fetchUsers();
	}, []);

	// paginate logic
	const [activePage, setPage] = useState(1);
	const [items, setItems] = useState<UserRelations[]>([]);

	const divisors = [5, 10, 15, 20, 25];
	const [divisor, setDivisor] = useState<string | null>(divisors[0].toString());
	const divisorOptions = divisors.map(o => {
		return { value: o.toString(), label: `Show ${o}` };
	});

	useEffect(() => {
		if (users) {
			const chunkedUsers = chunkUsers(users!, Number(divisor));

			if (chunkedUsers[activePage - 1]) {
				setItems(chunkedUsers[activePage - 1].map(item => item));
			} else {
				if (activePage > 1) {
					setPage(activePage - 1);
				} else {
					setItems([]);
				}
			}
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
						setUsers(prevUsers => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...prevUsers!].filter(item => item.name);
							const nullNames = [...prevUsers!].filter(item => !item.name);

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
						setUsers(prevUsers => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...prevUsers!].filter(item => item.name);
							const nullNames = [...prevUsers!].filter(item => !item.name);

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
						setUsers(prevUsers => [...prevUsers!].sort((a, b) => a.email.localeCompare(b.email)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.EMAIL).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'email' descending
						setUsers(prevUsers => [...prevUsers!].sort((a, b) => a.email.localeCompare(b.email)).reverse());

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
						setUsers(prevUsers => [...prevUsers!].sort((a, b) => a.role.localeCompare(b.role)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.ROLE).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'role' descending
						setUsers(prevUsers => [...prevUsers!].sort((a, b) => a.role.localeCompare(b.role)).reverse());

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
						setUsers(prevUsers => [...prevUsers!].sort((a, b) => a.status.localeCompare(b.status)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTableUsers.STATUS).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'status' descending
						setUsers(prevUsers =>
							[...prevUsers!].sort((a, b) => a.status.localeCompare(b.status)).reverse()
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
						setUsers(prevUsers =>
							[...prevUsers!].sort((a, b) => {
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
						setUsers(prevUsers =>
							[...prevUsers!].sort((a, b) => {
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

	const tableWidths = {
		check: { md: "5%", lg: "5%" },
		name: { md: "20%", lg: "20%" },
		email: { md: "25%", lg: "25%" },
		status: { md: "15%", lg: "15%" },
		created: { md: "15%", lg: "15%" },
		actions: { md: "10%", lg: "10%" },
	};

	const rows = items?.map(user => (
		<TableTr key={user.id} bg={selectedRows.includes(user.id) ? "var(--mantine-color-gray-1)" : undefined}>
			<TableTd w={tableWidths.check}>
				<Center>
					<Checkbox
						size="xs"
						aria-label="Select row"
						checked={selectedRows.includes(user.id)}
						onChange={event =>
							setSelectedRows(
								event.currentTarget.checked
									? [...selectedRows, user.id]
									: selectedRows.filter(position => position !== user.id)
							)
						}
					/>
				</Center>
			</TableTd>

			<TableTd w={tableWidths.name}>{user.name}</TableTd>

			<TableTd w={tableWidths.email}>
				<Anchor inherit component={Link} href={`/listings/users/${user.id}`} underline="always">
					{user.email}
				</Anchor>
			</TableTd>

			<TableTd w={tableWidths.status}>
				<Badge size="xs" variant="light" color={getStatusColor(user.status as enumUserStatus)}>
					{user.status}
				</Badge>
			</TableTd>

			<TableTd w={tableWidths.created}>{parseDateYmd(user.createdAt!)}</TableTd>

			<TableTd w={tableWidths.actions}>
				<Group gap={"xs"}>
					{user.status == "INACTIVE" ? (
						<ModalUserActivate
							selection={user}
							users={users!}
							setUsers={setUsers}
							setSelectedRows={setSelectedRows}
						>
							<Tooltip withArrow label={"Activate account"}>
								<ActionIcon color="green" variant="light">
									<IconUserCheck size={16} stroke={1.5} />
								</ActionIcon>
							</Tooltip>
						</ModalUserActivate>
					) : (
						<ModalUserDeactivate
							selection={user}
							users={users!}
							setUsers={setUsers}
							setSelectedRows={setSelectedRows}
						>
							<Tooltip withArrow label="Deactivate account">
								<ActionIcon color="yellow" variant="light">
									<IconUserX size={16} stroke={1.5} />
								</ActionIcon>
							</Tooltip>
						</ModalUserDeactivate>
					)}

					<ModalUserDelete user={user} users={users!} setUsers={setUsers}>
						<Tooltip
							withArrow
							label={
								user.status == "ACTIVE"
									? "The account must first be deactivated before deletion"
									: "Delete account"
							}
							w={user.status == "ACTIVE" ? 200 : undefined}
							multiline={user.status == "ACTIVE" ? true : false}
						>
							<ActionIcon color="red" variant="light" disabled={user.status == "ACTIVE"}>
								<IconTrash size={16} stroke={1.5} />
							</ActionIcon>
						</Tooltip>
					</ModalUserDelete>
				</Group>
			</TableTd>
		</TableTr>
	));

	const skeletonRow = (
		<TableTr>
			<TableTd w={tableWidths.check}>
				<Skeleton h={16} w={16} my={4} />
			</TableTd>
			<TableTd w={tableWidths.name}>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd w={tableWidths.email}>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd w={tableWidths.status}>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd w={tableWidths.created}>
				<Skeleton h={12} w={"80%"} my={4} />
			</TableTd>
			<TableTd w={tableWidths.actions}>
				<Group gap={"xs"}>
					<Skeleton h={24} w={24} my={4} />
					<Skeleton h={24} w={24} my={4} />
				</Group>
			</TableTd>
		</TableTr>
	);

	const emptyRow = (
		<TableTr>
			<TableTd colSpan={10}>
				<Group justify="center" my={"xl"}>
					<Text component="span" inherit ta={"center"}>
						No Users Found
					</Text>
				</Group>
			</TableTd>
		</TableTr>
	);

	return (
		<Stack>
			<Card withBorder shadow="xs" padding={"xs"} style={{ overflow: "unset" }}>
				<Stack>
					<Group justify="space-between">
						{!users ? (
							<Skeleton h={28} w={240} />
						) : (
							<InputSearchUser size={"xs"} placeholder={"Search users..."} />
						)}

						<Group gap={"xs"}>
							{!users ? (
								<Skeleton h={28} w={120} />
							) : (
								<Select
									size="xs"
									w={120}
									defaultValue={divisorOptions[0].value}
									placeholder={divisorOptions[0].label}
									data={divisorOptions}
									value={divisor}
									onChange={setDivisor}
									allowDeselect={false}
									withCheckIcon={false}
								/>
							)}

							<Divider orientation="vertical" />

							{!users ? <Skeleton h={28} w={96} /> : <Button size="xs">Clear Filters</Button>}
						</Group>
					</Group>

					<Group>
						{!users ? (
							<Skeleton h={28} w={96} />
						) : (
							<ModalUserDeactivate
								selections={items.filter(i => selectedRows.includes(i.id))}
								users={users!}
								setUsers={setUsers}
								setSelectedRows={setSelectedRows}
							>
								<Button size="xs" disabled={!active} color="yellow" variant="light">
									Deactivate ({selectedRows.length})
								</Button>
							</ModalUserDeactivate>
						)}

						{!users ? (
							<Skeleton h={28} w={96} />
						) : (
							<ModalUserActivate
								selections={items.filter(i => selectedRows.includes(i.id))}
								users={users!}
								setUsers={setUsers}
								setSelectedRows={setSelectedRows}
							>
								<Button size="xs" disabled={!active} color="green" variant="light">
									Activate ({selectedRows.length})
								</Button>
							</ModalUserActivate>
						)}
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
					<TableThead tt={"uppercase"} fz={"xs"}>
						<TableTr>
							<TableTh w={tableWidths.check}>
								<Center>
									{!users ? (
										<Skeleton h={16} w={16} />
									) : (
										<Checkbox
											size="xs"
											aria-label="Select row"
											checked={items.length != 0 && selectedRows.length == items.length}
											onChange={event =>
												setSelectedRows(
													event.currentTarget.checked ? items?.map(u => u.id)! : []
												)
											}
										/>
									)}
								</Center>
							</TableTh>

							<TableTh w={tableWidths.name}>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Name
									</Text>
									{nameOrder?.button}
								</Group>
							</TableTh>

							<TableTh w={tableWidths.email}>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Email
									</Text>
									{emailOrder?.button}
								</Group>
							</TableTh>

							<TableTh w={tableWidths.status}>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Status
									</Text>
									{statusOrder?.button}
								</Group>
							</TableTh>

							<TableTh w={tableWidths.created}>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Created
									</Text>
									{createdOrder?.button}
								</Group>
							</TableTh>

							<TableTh w={tableWidths.actions} />
						</TableTr>
					</TableThead>

					<TableTbody>
						{!users ? [skeletonRow, skeletonRow, skeletonRow] : users.length > 0 ? rows : emptyRow}
					</TableTbody>

					<TableCaption>
						<Group justify="space-between">
							{!users ? (
								<Skeleton h={16} w={160} />
							) : (
								<Text component="span" inherit>
									Showing <NumberFormatter thousandSeparator value={rows.length} /> of{" "}
									<NumberFormatter thousandSeparator value={users?.length} /> users
								</Text>
							)}

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
		case enumUserStatus.INACTIVE:
			return "yellow";
	}
};

const chunkUsers = (array: UserRelations[], size: number): UserRelations[][] => {
	if (!array.length) {
		return [];
	}

	const head = array.slice(0, size);
	const tail = array.slice(size);

	return [head, ...chunkUsers(tail, size)];
};
