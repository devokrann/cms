"use client";

import { useCallback, useEffect, useState } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useField } from "@mantine/form";

export default function Text({ size, placeholder, value }: any) {
	const field = useField({ initialValue: value });

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

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

	const handleSortChange = (name: string) => {
		const queryString = `?${createQueryString(name, field.getValue().trim().toLowerCase())}`;
		router.replace(`${pathname}${field.getValue().trim() ? queryString : ""}`);
	};

	useEffect(() => {
		if (field.isTouched()) {
			handleSortChange("search");
		}
	}, [field.getValue().trim()]);

	return (
		<TextInput
			{...field.getInputProps()}
			size={size}
			placeholder={placeholder}
			leftSection={<IconSearch size={16} stroke={1.5} />}
			rightSection={
				field.getValue().trim() ? (
					<ActionIcon variant="light" size={20} onClick={() => field.setValue("")}>
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
	);
}
