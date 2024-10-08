"use client";

import { addTag, getTags } from "@/handlers/database/tags";
import { capitalizeWords } from "@/handlers/parsers/string";
import { TagGet } from "@/types/model/tag";
import {
	Button,
	CheckIcon,
	Combobox,
	ComboboxChevron,
	ComboboxDropdown,
	ComboboxDropdownTarget,
	ComboboxEmpty,
	ComboboxEventsTarget,
	ComboboxOption,
	ComboboxOptions,
	Group,
	Loader,
	MultiSelect,
	Pill,
	PillGroup,
	PillsInput,
	PillsInputField,
	ScrollAreaAutosize,
	Text,
	useCombobox,
} from "@mantine/core";
import { IconTag } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

export default function Blog({ label, description, placeholder, hoistChange, initialValue, size }: any) {
	const [value, setValue] = useState<string[]>(initialValue);
	const [search, setSearch] = useState("");
	const [data, setData] = useState<TagGet[]>([]);

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

	const [loading, setLoading] = useState(false);

	const handleValueRemove = (val: string) => setValue(current => current.filter(v => v !== val));

	const values = value.map(item => (
		<Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
			{item}
		</Pill>
	));

	const options = data
		.filter(item => !value.find(i => i == item.title.toLowerCase()))
		.filter(item => item.title.toLowerCase().includes(search.trim().toLowerCase()))
		.map(item => (
			<ComboboxOption
				value={item.title.toLowerCase()}
				key={item.title.toLowerCase()}
				active={value.includes(item.title.toLowerCase())}
			>
				<Group gap="sm">
					{value.includes(item.title.toLowerCase()) ? <CheckIcon size={12} /> : null}
					<span>{item.title}</span>
				</Group>
			</ComboboxOption>
		));

	const updateTags = async () => {
		try {
			setLoading(true);

			const value = search.trim().toLowerCase();

			const result = await addTag({ title: value });

			if (!result.tag.exists) {
				setData(prevData => [...prevData, result.tag.tag]);
			}
		} catch (e) {
			console.error("X-> Failed to update tags:", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (initialValue[0] == "clear") {
			setValue([]);
			setSearch("");
		}
	}, [initialValue]);

	return (
		<Combobox
			store={combobox}
			onOptionSubmit={val => {
				setValue(current => (current.includes(val) ? current.filter(v => v !== val) : [...current, val]));
				setSearch("");
				hoistChange && hoistChange(data.filter(t => value.includes(t.title.toLowerCase())).map(i => i.title));
			}}
			withinPortal={false}
		>
			<ComboboxDropdownTarget>
				<PillsInput
					onClick={() => combobox.openDropdown()}
					label={label}
					description={description}
					leftSection={<IconTag size={16} stroke={1.5} />}
					rightSection={<ComboboxChevron />}
					rightSectionPointerEvents="none"
				>
					<PillGroup>
						{values}

						<ComboboxEventsTarget>
							<PillsInputField
								onFocus={() => combobox.openDropdown()}
								onBlur={() => {
									combobox.closeDropdown();
									setSearch("");
								}}
								value={search}
								onChange={event => {
									combobox.openDropdown();
									combobox.updateSelectedOptionIndex();
									setSearch(event.currentTarget.value);
									hoistChange && hoistChange(data.filter(t => value.includes(t.title.toLowerCase())));
								}}
								onKeyDown={event => {
									if (event.key === "Backspace" && search.length === 0) {
										event.preventDefault();
										handleValueRemove(value[value.length - 1]);
									}
								}}
								placeholder={value.length > 0 ? "" : placeholder}
								size={size ? size : undefined}
							/>
						</ComboboxEventsTarget>
					</PillGroup>
				</PillsInput>
			</ComboboxDropdownTarget>

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
							<ComboboxOption onClick={updateTags} value={search.trim().toLowerCase()}>
								+ Create &apos;{search.trim().toLowerCase()}&apos;
							</ComboboxOption>
						) : (
							<ComboboxEmpty>
								<Text component="span" inherit fz={"xs"}>
									Nothing found...
								</Text>
							</ComboboxEmpty>
						)}
					</ScrollAreaAutosize>
				</ComboboxOptions>
			</ComboboxDropdown>
		</Combobox>
	);
}

function getAsyncData() {
	return new Promise<TagGet[]>(resolve => {
		setTimeout(() => resolve(getTags()), 0);
	});
}
