"use client";

import React, { useEffect, useState } from "react";

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
import { IconCategory, IconSearch } from "@tabler/icons-react";
import { addCategory, getCategories } from "@/handlers/database/categories";
import { capitalizeWords } from "@/handlers/parsers/string";
import { CategoryGet } from "@/types/model/category";

export default function Blog({ hoistChange, label, placeholder, description, required, size, initialValue }: any) {
	const [value, setValue] = useState<string | null>(initialValue);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<CategoryGet[]>([]);

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

			const result = await addCategory({ title: value });

			if (!result.category.exists) {
				setData(prevData => [...prevData, result.category.category]);
				setValue(capitalizeWords(search.trim()));
				setSearch(capitalizeWords(search.trim()));
			}
		} catch (e) {
			console.error("X-> Failed to update categories:", e);
		} finally {
			setLoading(false);
		}
	};

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
					leftSection={<IconCategory size={16} stroke={1.5} />}
					rightSectionPointerEvents="none"
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
						) : search.trim().length > 0 ? (
							<ComboboxOption onClick={updateCategories} value={search.trim().toLowerCase()}>
								+ Create &apos;{capitalizeWords(search.trim())}&apos;
							</ComboboxOption>
						) : (
							<Combobox.Empty>
								<Text component="span" inherit fz={"xs"}>
									Nothing found...
								</Text>
							</Combobox.Empty>
						)}
					</ScrollAreaAutosize>
				</ComboboxOptions>
			</ComboboxDropdown>
		</Combobox>
	);
}

function getAsyncData() {
	return new Promise<CategoryGet[]>(resolve => {
		setTimeout(() => resolve(getCategories()), 0);
	});
}
