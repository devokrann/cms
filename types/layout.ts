import React from "react";

import { Sizes, Widths } from "./mantine";

export interface Body {
	bar?: React.ReactNode;
	header?: React.ReactNode;
	nav?: React.ReactNode;
	hero?: React.ReactNode;
	children: React.ReactNode;
	aside?: {
		gap?: string | number;
		left?: {
			component: React.ReactNode;
			width?: Widths;
			withBorder?: boolean;
		};
		right?: {
			component: React.ReactNode;
			width?: Widths;
			withBorder?: boolean;
		};
	};
	footer?: React.ReactNode;
}

export interface Page {
	padded?: boolean | number | Sizes;
	stacked?: boolean | number | Sizes;
	children: React.ReactNode;
}

export interface Section {
	containerized?: boolean | Sizes | "responsive";
	padded?: boolean | number | Sizes;
	margined?: boolean | number | Sizes;
	className?: string;
	bordered?: boolean;
	shadowed?: boolean;
	withClerk?: boolean;
	children: React.ReactNode;
}
