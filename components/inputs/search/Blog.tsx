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
import { typePost } from "@/types/post";
import { getPosts } from "@/handlers/database/posts";

export default function Blog({ hoistChange, label, placeholder, error, required, size, initialValue }: any) {
	const [value, setValue] = useState<string | null>(initialValue);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<typePost[]>([]);

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

	const shouldFilterOptionsTitle = data.every(item => item.title.toLowerCase() !== search.trim().toLowerCase());

	const filteredOptionsTitle = shouldFilterOptionsTitle
		? data.filter(item => item.title.toLowerCase().includes(search.trim().toLowerCase()))
		: data;

	const optionsTitle = filteredOptionsTitle.map(item => (
		<ComboboxOption key={item.id} value={item.title}>
			<Text component="span" inherit lineClamp={1}>
				{item.title}
			</Text>
		</ComboboxOption>
	));

	const dataAuthor = data.filter(i => i.user.name);

	const shouldFilterOptionsAuthor = dataAuthor.every(
		item => item.user.name?.toLowerCase() !== search.trim().toLowerCase()
	);

	const filteredOptionsAuthor = shouldFilterOptionsAuthor
		? dataAuthor.filter(item => item.user.name?.toLowerCase()?.includes(search.trim().toLowerCase()))
		: dataAuthor;

	const optionsAuthor = filteredOptionsAuthor.map(item => (
		<ComboboxOption key={item.id} value={item.user.name!}>
			{item.user.name}
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
				// hoistChange && hoistChange(data.find(u => u.email == val || u.name == val)?.id);
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
						// hoistChange &&
						// 	hoistChange(
						// 		data.find(u => u.email == event.target.value || u.name == event.target.value)?.id
						// 	);
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
					w={400}
				/>
			</ComboboxTarget>

			<ComboboxDropdown>
				<ComboboxOptions>
					<ScrollAreaAutosize mah={200} offsetScrollbars scrollbarSize={8}>
						<ComboboxGroup label="Search by Title">
							{loading ? (
								<ComboboxEmpty>
									<Group justify="center">
										<Loader type="dots" size={18} />
									</Group>
								</ComboboxEmpty>
							) : optionsTitle.length > 0 ? (
								optionsTitle
							) : (
								<Combobox.Empty>
									<Text component="span" inherit fz={"xs"}>
										Nothing found...
									</Text>
								</Combobox.Empty>
							)}
						</ComboboxGroup>

						<ComboboxGroup label="Search by Author">
							{loading ? (
								<ComboboxEmpty>
									<Group justify="center">
										<Loader type="dots" size={18} />
									</Group>
								</ComboboxEmpty>
							) : optionsAuthor.length > 0 ? (
								optionsAuthor
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
	return new Promise<typePost[]>(resolve => {
		setTimeout(() => resolve(getPosts()), 0);
	});
}
