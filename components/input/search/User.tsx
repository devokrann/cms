"use client";

import React, { useState } from "react";

import {
	Combobox,
	ComboboxChevron,
	ComboboxDropdown,
	ComboboxEmpty,
	ComboboxOption,
	ComboboxOptions,
	ComboboxTarget,
	Group,
	InputBase,
	InputPlaceholder,
	Loader,
	useCombobox,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { enumRequest } from "@/types/request";
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

	const options = data.map(item => (
		<ComboboxOption value={item.email} key={item.email}>
			{item.name}
		</ComboboxOption>
	));

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={val => {
				setValue(val);
				combobox.closeDropdown();
			}}
		>
			<ComboboxTarget>
				<InputBase
					size="xs"
					w={240}
					component="button"
					type="button"
					pointer
					leftSection={<IconSearch size={16} stroke={1.5} />}
					rightSection={<ComboboxChevron />}
					onClick={() => combobox.toggleDropdown()}
					rightSectionPointerEvents="none"
				>
					{value || <InputPlaceholder>Search users...</InputPlaceholder>}
				</InputBase>
			</ComboboxTarget>

			<ComboboxDropdown>
				<ComboboxOptions>
					{loading ? (
						<ComboboxEmpty>
							<Group justify="center">
								<Loader type="dots" size={18} />
							</Group>
						</ComboboxEmpty>
					) : (
						options
					)}
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
