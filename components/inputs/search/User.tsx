"use client";

import React, { useEffect, useState } from "react";

import {
	Combobox,
	ComboboxChevron,
	ComboboxDropdown,
	ComboboxEmpty,
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
import { getUsers } from "@/handlers/database/users";
import { UserGet } from "@/types/model/user";

export default function User({ hoistChange, label, placeholder, error, required, size, initialValue }: any) {
	const [value, setValue] = useState<string | null>(initialValue);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<UserGet[]>([]);

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
		<ComboboxOption key={item.id} value={item.email}>
			{item.email}
		</ComboboxOption>
	));

	const dataNames = data.filter(i => i.name);

	const shouldFilterOptionsName = dataNames.every(item => item.name !== search);

	const filteredOptionsName = shouldFilterOptionsName
		? dataNames.filter(item => item.name?.toLowerCase()?.includes(search.trim().toLowerCase()))
		: dataNames;

	const optionsName = filteredOptionsName.map(item => (
		<ComboboxOption key={item.id} value={item.name!}>
			{item.name}
		</ComboboxOption>
	));

	useEffect(() => {
		if (initialValue == "clear") {
			setSearch("");
			setValue("");
		}
	}, [initialValue]);

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={val => {
				combobox.closeDropdown();
				setValue(val);
				setSearch(val);
				hoistChange && hoistChange(data.find(u => u.email == val || u.name == val)?.id);
			}}
		>
			<ComboboxTarget>
				<InputBase
					size={size ? size : undefined}
					value={search}
					onChange={event => {
						combobox.openDropdown();
						combobox.updateSelectedOptionIndex();
						setSearch(event.currentTarget.value);
						hoistChange &&
							hoistChange(
								data.find(u => u.email == event.target.value || u.name == event.target.value)?.id
							);
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => {
						combobox.closeDropdown();
						setSearch(value || "");
					}}
					pointer
					required={required}
					label={label}
					placeholder={placeholder}
					leftSection={<IconSearch size={16} stroke={1.5} />}
					rightSection={<ComboboxChevron />}
					rightSectionPointerEvents="none"
					error={error}
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

function getAsyncData() {
	return new Promise<UserGet[]>(resolve => {
		setTimeout(() => resolve(getUsers()), 0);
	});
}
