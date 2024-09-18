import React from "react";

import NextImage from "next/image";

import { Group, Image } from "@mantine/core";

import images from "@/assets/images";
import contact from "@/data/contact";

export default function Brand({ height }: { height?: number }) {
	return (
		<Group>
			<Image
				src={images.brand.logo.light}
				alt={contact.name.app}
				h={{ base: height ? height : 24 }}
				component={NextImage}
				width={1920}
				height={1080}
				priority
			/>
		</Group>
	);
}
