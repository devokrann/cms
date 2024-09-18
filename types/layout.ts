import React from "react";

import { sizes, widths } from "./mantine";

export interface typeBody {
	bar?: React.ReactNode;
	header?: React.ReactNode;
	nav?: React.ReactNode;
	hero?: React.ReactNode;
	children: React.ReactNode;
	aside?: {
		gap?: string | number;
		left?: {
			component: React.ReactNode;
			width?: widths;
			withBorder?: boolean;
		};
		right?: {
			component: React.ReactNode;
			width?: widths;
			withBorder?: boolean;
		};
	};
	footer?: React.ReactNode;
}

export interface typePage {
	padded?: boolean | number | sizes;
	stacked?: boolean | number | sizes;
	children: React.ReactNode;
}

export interface typeSection {
	containerized?: boolean | sizes | "responsive";
	padded?: boolean | number | sizes;
	margined?: boolean | number | sizes;
	className?: string;
	bordered?: boolean;
	shadowed?: boolean;
	withClerk?: boolean;
	children: React.ReactNode;
}
