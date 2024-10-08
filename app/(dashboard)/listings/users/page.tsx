"use client";

import React, { useEffect, useState } from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Button, Card, Divider, Group, NumberFormatter, Skeleton, Stack, Text, Title } from "@mantine/core";
import TableUsers from "@/components/tables/Users";
import Link from "next/link";
import { IconPlus, IconUserPlus, IconUserX, IconX } from "@tabler/icons-react";
import { UserRelations } from "@/types/model/user";
import { getUsers } from "@/handlers/database/users";
import { usePaginate } from "@/hooks/paginate";
import FormFilterUsers from "@/partials/forms/filter/Users";
import ModalUserActivate from "@/components/modals/user/Activate";
import ModalUserDeactivate from "@/components/modals/user/Deactivate";
import SelectDivisor from "@/components/select/Divisor";
import PaginationTable from "@/components/pagination/Table";

export default function Users() {
	const [users, setUsers] = useState<UserRelations[] | null>(null);
	const [filteredUsers, setFilteredUsers] = useState<UserRelations[] | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const result = await getUsers();

			setUsers(result);
			setFilteredUsers(result);
		};

		fetchUsers();
	}, []);

	// paginate logic
	const divisors = [5, 10, 15, 20, 25];
	const [divisor, setDivisor] = useState<string | null>(divisors[0].toString());
	const { activePage, setActivePage, items, setItems } = usePaginate(filteredUsers!, divisor!);

	// table logic
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	useEffect(() => {
		setSelectedRows(selectedRows.filter(i => items?.find(u => u.id == i)));
	}, [items]);

	return (
		<LayoutPage stacked="xl">
			<LayoutSection>
				<Group justify="space-between" align="end">
					<Title order={1} fz={"xl"}>
						Users
					</Title>

					<Button
						leftSection={<IconPlus size={16} stroke={1.5} />}
						component={Link}
						href={"/create/user"}
						size="xs"
					>
						New User
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<Stack>
					<Card withBorder shadow="xs" padding={"xs"}>
						<Stack>
							<FormFilterUsers users={users} setFilteredUsers={setFilteredUsers} />

							<Divider />

							<Group justify="space-between">
								<Group>
									{!users ? (
										<Skeleton h={28} w={96} />
									) : (
										<Button
											size="xs"
											disabled={selectedRows.length < 1}
											color="red"
											variant="light"
											leftSection={<IconX size={16} stroke={1} />}
											onClick={() => setSelectedRows([])}
										>
											Clear Selection ({selectedRows.length})
										</Button>
									)}

									{!users ? (
										<Skeleton h={28} w={96} />
									) : (
										<ModalUserDeactivate
											selections={items.filter(i => selectedRows.includes(i.id))}
											users={users!}
											setUsers={setUsers}
											setSelectedRows={setSelectedRows}
										>
											<Button
												size="xs"
												disabled={selectedRows.length < 1}
												color="yellow"
												variant="light"
												leftSection={<IconUserX size={16} stroke={1} />}
											>
												Deactivate Users ({selectedRows.length})
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
											<Button
												size="xs"
												disabled={selectedRows.length < 1}
												color="green"
												variant="light"
												leftSection={<IconUserPlus size={16} stroke={1} />}
											>
												Activate Users ({selectedRows.length})
											</Button>
										</ModalUserActivate>
									)}
								</Group>

								{!users ? (
									<Skeleton h={28} w={120} />
								) : (
									<SelectDivisor divisors={divisors} divisor={divisor} setDivisor={setDivisor} />
								)}
							</Group>
						</Stack>
					</Card>

					<Card withBorder shadow="xs" padding={0}>
						<TableUsers
							users={users!}
							setUsers={setUsers}
							items={items}
							setItems={setItems}
							selectedRows={selectedRows}
							setSelectedRows={setSelectedRows}
						/>
					</Card>

					<Card withBorder shadow="xs" padding={"xs"}>
						<Group justify="space-between">
							{!users ? (
								<Skeleton h={16} w={160} />
							) : (
								<Text component="span" inherit fz={"xs"}>
									Showing <NumberFormatter thousandSeparator value={items.length} /> of{" "}
									<NumberFormatter thousandSeparator value={filteredUsers?.length} /> users
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
								<PaginationTable
									list={filteredUsers!}
									divisor={divisor!}
									activePage={activePage}
									setActivePage={setActivePage}
								/>
							)}
						</Group>
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
