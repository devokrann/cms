"use client";

import { addTag, getTags } from "@/handlers/database/tags";
import { capitalizeWords } from "@/handlers/parsers/string";
import { typeTag } from "@/types/tag";
import { Button, MultiSelect } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface typeOption {
	label: string;
	value: string;
}

export default function Blog({ label, description, placeholder, hoistChange, initialValue }: any) {
	const [value, setValue] = useState<string[]>(initialValue);
	const [searchValue, setSearchValue] = useState("");

	const [tagOptions, setTagOptions] = useState<typeOption[]>([]);

	const [loading, setLoading] = useState(false);

	const updateTags = async () => {
		try {
			setLoading(true);

			const value = searchValue.trim().toLowerCase();

			await addTag(value);

			setTagOptions([
				...tagOptions,
				{
					label: capitalizeWords(searchValue),
					value: value.toLowerCase(),
				},
			]);
		} catch (e) {
			console.error("X-> Failed to update tags:", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchTags = async () => {
			const result = await getTags();

			setTagOptions(
				result.map((t: typeTag) => {
					return { label: capitalizeWords(t.title), value: t.title };
				})
			);
		};

		fetchTags();
	}, []);

	useEffect(() => {
		if (initialValue[0] == "clear") {
			setValue([]);
			setSearchValue("");
		}
	}, [initialValue]);

	return (
		<MultiSelect
			label={label}
			description={description}
			placeholder={placeholder}
			data={tagOptions}
			value={value}
			onChange={value => {
				setValue(value);
				hoistChange(value);
			}}
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			nothingFoundMessage={
				<Button variant="light" size="xs" onClick={updateTags} loading={loading} fw={"normal"}>
					Create &apos;{searchValue}&apos;
				</Button>
			}
			searchable
			hidePickedOptions
			maxValues={10}
			maxDropdownHeight={200}
		/>
	);
}
