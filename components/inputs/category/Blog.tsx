"use client";

import React, { useState } from "react";

import {
	Button,
	Combobox,
	ComboboxChevron,
	ComboboxDropdown,
	ComboboxEmpty,
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
import { typeCategory } from "@/types/category";
import { addCategory, getCategories } from "@/handlers/database/categories";
import { capitalizeWords } from "@/handlers/parsers/string";

export default function Blog({ hoistChange, label, placeholder, description, error, required, size }: any) {
	const [value, setValue] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<typeCategory[]>([]);

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

	const shouldFilterOptions = data.every(item => item.title.toLowerCase() !== search.trim().toLowerCase());

	const filteredOptions = shouldFilterOptions
		? data.filter(item => item.title.toLowerCase().includes(search.trim().toLowerCase()))
		: data;

	const options = filteredOptions.map(item => (
		<ComboboxOption key={item.id} value={item.title}>
			{item.title}
		</ComboboxOption>
	));

	const updateCategories = async () => {
		try {
			setLoading(true);

			const value = capitalizeWords(search.trim());

			const result = await addCategory(value);

			if (!result.category.exists) {
				setData(prevData => [...prevData, result.category.category]);
			}
		} catch (e) {
			console.error("X-> Failed to update categories:", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={val => {
				combobox.closeDropdown();
				setValue(val);
				setSearch(val);
				hoistChange && hoistChange(data.find(u => u.title == val)?.id);
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
						hoistChange && hoistChange(data.find(u => u.title == event.target.value)?.id);
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
					description={description}
					leftSection={<IconSearch size={16} stroke={1.5} />}
					rightSection={<ComboboxChevron />}
					rightSectionPointerEvents="none"
					error={error}
				/>
			</ComboboxTarget>

			<ComboboxDropdown>
				<ComboboxOptions>
					<ScrollAreaAutosize mah={200} offsetScrollbars scrollbarSize={8}>
						{loading ? (
							<ComboboxEmpty>
								<Group justify="center">
									<Loader type="dots" size={18} />
								</Group>
							</ComboboxEmpty>
						) : options.length > 0 ? (
							options
						) : (
							<Combobox.Empty>
								{search.trim().length > 0 ? (
									<Button
										variant="light"
										size="xs"
										onClick={updateCategories}
										loading={loading}
										fw={"normal"}
									>
										Create &apos;{capitalizeWords(search.trim())}&apos;
									</Button>
								) : (
									<Text component="span" inherit fz={"xs"}>
										Nothing found...
									</Text>
								)}
							</Combobox.Empty>
						)}
					</ScrollAreaAutosize>
				</ComboboxOptions>
			</ComboboxDropdown>
		</Combobox>
	);
}

function getAsyncData() {
	return new Promise<typeCategory[]>(resolve => {
		setTimeout(() => resolve(getCategories()), 0);
	});
}
