"use client";

import { Modal, Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import FormUserAccountDelete from "@/partials/forms/user/settings/Delete";
import { useSession } from "next-auth/react";

export default function Account() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Modal opened={opened} onClose={close} centered title="Account Erasure">
				<Stack>
					<Text>
						Deleting your account will permanently remove all data associated with it.{" "}
						<Text component="span" inherit c="red.6">
							Proceed with caution. This action is irreversible.
						</Text>
					</Text>
					<FormUserAccountDelete />
				</Stack>
			</Modal>

			<Button color="red.6" variant="light" onClick={open}>
				Delete Account
			</Button>
		</>
	);
}
