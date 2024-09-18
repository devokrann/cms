"use client";

import React from "react";

import NextImage from "next/image";

import { ActionIcon, Group, Image } from "@mantine/core";

import { IconBrandAppleFilled, IconBrandFacebookFilled, IconBrandGoogleFilled } from "@tabler/icons-react";

import { signIn } from "next-auth/react";
import icons from "@/assets/icons";

export default function Providers() {
	return (
		<Group justify="center">
			<ActionIcon
				size={40}
				radius={"xl"}
				variant="light"
				onClick={async () => await signIn("google", { redirect: false, callbackUrl: "/" })}
			>
				<Group>
					<Image
						src={icons.search.google}
						alt={"google"}
						h={{ base: 24 }}
						component={NextImage}
						width={1920}
						height={1080}
						priority
					/>
				</Group>
			</ActionIcon>
			<ActionIcon size={40} radius={"xl"} variant="light">
				<Group>
					<Image
						src={icons.other.apple}
						alt={"apple"}
						h={{ base: 24 }}
						component={NextImage}
						width={1920}
						height={1080}
						priority
					/>
				</Group>
			</ActionIcon>
			<ActionIcon size={40} radius={"xl"} variant="light">
				<Group>
					<Image
						src={icons.social.facebook}
						alt={"facebook"}
						h={{ base: 24 }}
						component={NextImage}
						width={1920}
						height={1080}
						priority
					/>
				</Group>
			</ActionIcon>
		</Group>
	);
}
