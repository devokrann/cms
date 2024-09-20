"use client";

import React, { useState } from "react";

import {
	Combobox,
	ComboboxChevron,
	ComboboxDropdown,
	ComboboxEmpty,
	ComboboxFooter,
	ComboboxGroup,
	ComboboxOption,
	ComboboxOptions,
	ComboboxTarget,
	Group,
	InputBase,
	Loader,
	ScrollAreaAutosize,
	Text,
	useCombobox,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { enumRequest } from "@/types/enums";
import { typeUser } from "@/types/user";

export default function User() {
	const [value, setValue] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<typeUser[]>([]);

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => {
			if (data.length === 0 && !loading) {
				setLoading(true);
				getAsyncData().then(response => {
					setData(response);
					setLoading(false);
					combobox.resetSelectedOption();
				});
			}
		},
	});

	const [search, setSearch] = useState("");

	const shouldFilterOptionsEmail = data.every(item => item.email !== search);

	const filteredOptionsEmail = shouldFilterOptionsEmail
		? data.filter(item => item.email.includes(search.trim()))
		: data;

	const optionsEmail = filteredOptionsEmail.map(item => (
		<ComboboxOption key={item.email} value={item.email}>
			{item.email}
		</ComboboxOption>
	));

	const dataNames = data.filter(i => i.name);

	const shouldFilterOptionsName = dataNames.every(item => item.name !== search);

	const filteredOptionsName = shouldFilterOptionsName
		? dataNames.filter(item => item.name?.toLowerCase()?.includes(search.trim().toLowerCase()))
		: dataNames;

	const optionsName = filteredOptionsName.map(item => (
		<ComboboxOption key={item.email} value={item.name!}>
			{item.name}
		</ComboboxOption>
	));

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={val => {
				setValue(val);
				setSearch(val);
				combobox.closeDropdown();
			}}
		>
			<ComboboxTarget>
				<InputBase
					size="xs"
					w={240}
					value={search}
					onChange={event => {
						combobox.openDropdown();
						combobox.updateSelectedOptionIndex();
						setSearch(event.currentTarget.value);
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => {
						combobox.closeDropdown();
						setSearch(value || "");
					}}
					pointer
					leftSection={<IconSearch size={16} stroke={1.5} />}
					rightSection={<ComboboxChevron />}
					placeholder="Search users..."
					rightSectionPointerEvents="none"
				/>
			</ComboboxTarget>

			<ComboboxDropdown>
				<ComboboxOptions>
					<ScrollAreaAutosize mah={200} offsetScrollbars scrollbarSize={8}>
						<ComboboxGroup label="Search by Name">
							{loading ? (
								<ComboboxEmpty>
									<Group justify="center">
										<Loader type="dots" size={18} />
									</Group>
								</ComboboxEmpty>
							) : optionsName.length > 0 ? (
								optionsName
							) : (
								<Combobox.Empty>
									<Text component="span" inherit fz={"xs"}>
										Nothing found...
									</Text>
								</Combobox.Empty>
							)}
						</ComboboxGroup>

						<ComboboxGroup label="Search by Email">
							{loading ? (
								<ComboboxEmpty>
									<Group justify="center">
										<Loader type="dots" size={18} />
									</Group>
								</ComboboxEmpty>
							) : optionsEmail.length > 0 ? (
								optionsEmail
							) : (
								<Combobox.Empty>
									<Text component="span" inherit fz={"xs"}>
										Nothing found...
									</Text>
								</Combobox.Empty>
							)}
						</ComboboxGroup>
					</ScrollAreaAutosize>
				</ComboboxOptions>
			</ComboboxDropdown>
		</Combobox>
	);
}

const getUsers = async () => {
	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
		method: enumRequest.GET,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});

	const res = await response.json();

	return res.users;
};

function getAsyncData() {
	return new Promise<typeUser[]>(resolve => {
		setTimeout(() => resolve(getUsers()), 0);
	});
}
