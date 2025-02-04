"use client";

import React, { useCallback, useEffect, useState } from "react";

import { ActionIcon, Button, Group, Select, Skeleton, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch, IconX } from "@tabler/icons-react";
import { StatusUser } from "@prisma/client";
import { capitalizeWord, linkify } from "@/handlers/parsers/string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserRelations } from "@/types/model/user";

export default function Users({
	users,
	setFilteredUsers,
	setSelectedRows,
}: {
	users: any;
	setFilteredUsers: any;
	setSelectedRows: any;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const paramSearch = searchParams.get("search");
	const paramStatus = searchParams.get("status");

	const [search, setSearch] = useState<string>(paramSearch ? paramSearch : "");
	const [status, setStatus] = useState<string>(paramStatus ? paramStatus.toUpperCase() : "");

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const form = useForm({ initialValues: { search: search, status: status } });

	const handleReset = async () => {
		const clearForm = async () => {
			form.setValues({ search: "", status: "" });
			setSelectedRows([]);
		};

		const clearParams = async () => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("search", "");
			params.set("status", "");

			router.replace(`${pathname}?${params.toString()}`);
			router.replace(pathname);
		};

		await clearForm();
		await clearParams();
	};

	useEffect(() => {
		if (form.isTouched()) {
			router.replace(`${pathname}?${createQueryString("search", form.values.search.trim().toLowerCase())}`);
		}
	}, [form.values.search]);

	useEffect(() => {
		if (form.isTouched()) {
			router.replace(`${pathname}?${createQueryString("status", capitalizeWord(form.values.status))}`);
		}
	}, [form.values.status]);

	useEffect(() => {
		setFilteredUsers(
			users
				?.filter((i: UserRelations) => {
					if (paramSearch) {
						return (
							linkify(i.name!)?.includes(linkify(paramSearch.trim())) ||
							linkify(i.email)?.includes(linkify(paramSearch.trim()))
						);
					} else {
						return i;
					}
				})!
				.filter((i: UserRelations) => {
					if (paramStatus) {
						return i.status == paramStatus.toUpperCase();
					} else {
						return i;
					}
				})
		);

		setSearch(paramSearch ? paramSearch : "");
		setStatus(paramStatus ? paramStatus.toUpperCase() : "");
	}, [users, paramSearch, paramStatus]);

	return (
		<form>
			<Group justify="space-between">
				<Group gap={"xs"}>
					{!users ? (
						<Skeleton h={30} w={{ base: 360 }} />
					) : (
						<TextInput
							{...form.getInputProps("search")}
							size={"xs"}
							placeholder={"Search users by name, email..."}
							leftSection={<IconSearch size={16} stroke={1.5} />}
							rightSection={
								form.values.search.trim() ? (
									<ActionIcon
										variant="light"
										size={20}
										onClick={() => form.setFieldValue("search", "")}
									>
										<IconX size={16} stroke={1.5} />
									</ActionIcon>
								) : undefined
							}
							styles={{
								input: {
									padding: "0 var(--mantine-spacing-xl)",
								},
							}}
							w={{ base: 360 }}
						/>
					)}

					{!users ? (
						<Skeleton h={30} w={120} />
					) : (
						<Select
							data={[
								{ label: "All (Status)", value: "" },
								{ label: capitalizeWord(StatusUser.ACTIVE), value: StatusUser.ACTIVE },
								{ label: capitalizeWord(StatusUser.INACTIVE), value: StatusUser.INACTIVE },
							]}
							{...form.getInputProps("status")}
							defaultValue={"all"}
							allowDeselect={false}
							withCheckIcon={false}
							w={120}
							size="xs"
							placeholder={"Filter by Status"}
						/>
					)}
				</Group>

				{!users ? (
					<Skeleton h={30} w={96} />
				) : (
					<Button size="xs" onClick={handleReset}>
						Clear Filters
					</Button>
				)}
			</Group>
		</form>
	);
}
