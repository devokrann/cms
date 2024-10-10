"use client";

import React from "react";

import {
	ActionIcon,
	Anchor,
	Avatar,
	Center,
	Checkbox,
	Group,
	Skeleton,
	Stack,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Tooltip,
} from "@mantine/core";

import classes from "./Users.module.scss";
import { IconTrash, IconUserCheck, IconUserX } from "@tabler/icons-react";
import { enumTableUsers } from "@/types/enums";
import { parseDateYmd } from "@/handlers/parsers/date";
import ModalUserDelete from "../modals/user/Delete";
import Link from "next/link";
import { UserRelations } from "@/types/model/user";
import ModalUserActivate from "../modals/user/Activate";
import ModalUserDeactivate from "../modals/user/Deactivate";
import { useSortUsers } from "@/hooks/sort";
import BadgeStatusUser from "../badges/status/User";
import ActionIconSort from "../action-icon/Sort";
import { initialize } from "@/handlers/parsers/string";

export default function Users({
	users,
	setUsers,
	items,
	setItems,
	selectedRows,
	setSelectedRows,
}: {
	users: UserRelations[] | null;
	setUsers: any;
	items: UserRelations[];
	setItems: any;
	selectedRows: string[];
	setSelectedRows: any;
}) {
	const { sort, nameOrder, emailOrder, statusOrder, createdOrder } = useSortUsers(setUsers);

	const rows = items?.map(user => (
		<TableTr
			key={user.id}
			bg={
				selectedRows.includes(user.id)
					? "light-dark(var(--mantine-color-gray-1),var(--mantine-color-gray-light))"
					: undefined
			}
		>
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

			<TableTd w={tableWidths.name}>
				<Group gap={"xs"} wrap="nowrap">
					{!user.image ? (
						<Anchor inherit component={Link} href={`/listings/users/${user.id}`} underline="never">
							<Avatar>{initialize(user.name!)}</Avatar>
						</Anchor>
					) : (
						<Anchor inherit component={Link} href={`/listings/users/${user.id}`} underline="never">
							<Avatar src={user.image} alt={user.name!} />
						</Anchor>
					)}

					<Tooltip label={user.name} withArrow position="top-start" fz={"xs"}>
						<Text component="span" inherit lineClamp={1}>
							{user.name}
						</Text>
					</Tooltip>
				</Group>
			</TableTd>

			<TableTd w={tableWidths.email}>
				<Tooltip label={user.email} withArrow position="top-start" fz={"xs"}>
					<Anchor
						inherit
						component={Link}
						href={`/listings/users/${user.id}`}
						underline="hover"
						lineClamp={1}
					>
						{user.email}
					</Anchor>
				</Tooltip>
			</TableTd>

			<TableTd w={tableWidths.status}>
				<BadgeStatusUser user={user} />
			</TableTd>

			<TableTd w={tableWidths.created}>{parseDateYmd(user.createdAt!)}</TableTd>

			<TableTd w={tableWidths.actions}>
				<Group gap={"xs"} justify="center">
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

	return (
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
									aria-label="Select rows"
									checked={items.length > 0 && selectedRows.length == items.length}
									indeterminate={selectedRows.length > 0 && selectedRows.length != items.length}
									onChange={event =>
										setSelectedRows(event.currentTarget.checked ? items.map(u => u.id) : [])
									}
								/>
							)}
						</Center>
					</TableTh>

					<TableTh w={tableWidths.name}>
						<Group gap={"xs"}>
							<Text component="span" inherit fw={500}>
								Name
							</Text>

							{!users ? (
								<Skeleton h={16} w={16} />
							) : (
								<ActionIconSort order={nameOrder} sortFunction={() => sort(enumTableUsers.NAME)} />
							)}
						</Group>
					</TableTh>

					<TableTh w={tableWidths.email}>
						<Group gap={"xs"}>
							<Text component="span" inherit fw={500}>
								Email
							</Text>

							{!users ? (
								<Skeleton h={16} w={16} />
							) : (
								<ActionIconSort order={emailOrder} sortFunction={() => sort(enumTableUsers.EMAIL)} />
							)}
						</Group>
					</TableTh>

					<TableTh w={tableWidths.status}>
						<Group gap={"xs"}>
							<Text component="span" inherit fw={500}>
								Status
							</Text>

							{!users ? (
								<Skeleton h={16} w={16} />
							) : (
								<ActionIconSort order={statusOrder} sortFunction={() => sort(enumTableUsers.STATUS)} />
							)}
						</Group>
					</TableTh>

					<TableTh w={tableWidths.created}>
						<Group gap={"xs"}>
							<Text component="span" inherit fw={500}>
								Created
							</Text>

							{!users ? (
								<Skeleton h={16} w={16} />
							) : (
								<ActionIconSort
									order={createdOrder}
									sortFunction={() => sort(enumTableUsers.CREATED)}
								/>
							)}
						</Group>
					</TableTh>

					<TableTh w={tableWidths.actions} />
				</TableTr>
			</TableThead>

			<TableTbody>
				{!users ? (
					Array(15)
						.fill(0)
						.map((_, index) => skeletonRow)
				) : items.length > 0 ? (
					<>
						{/* {skeletonRow} */}
						{rows}
					</>
				) : (
					emptyRow
				)}
			</TableTbody>
		</Table>
	);
}

const tableWidths = {
	check: { md: "5%", lg: "5%" },
	name: { md: "20%", lg: "20%" },
	email: { md: "20%", lg: "20%" },
	status: { md: "15%", lg: "15%" },
	created: { md: "15%", lg: "15%" },
	actions: { md: "15%", lg: "15%" },
};

const skeletonRow = (
	<TableTr>
		<TableTd w={tableWidths.check}>
			<Center>
				<Skeleton h={16} w={16} my={4} />
			</Center>
		</TableTd>
		<TableTd w={tableWidths.name}>
			<Group gap={"xs"}>
				<Skeleton h={38} w={38} radius={"xl"} />
				<Skeleton h={12} w={"50%"} />
			</Group>
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
			<Group gap={"xs"} justify="center">
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
