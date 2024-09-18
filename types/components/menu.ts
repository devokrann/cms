import { Icon } from "@tabler/icons-react";
import { typeLink } from "../link";

export interface typeMenu extends typeLink {
	subLinks?: typeLink[];
}

export interface typeMenuNavbar extends typeMenu {
	leftSection?: Icon;
	rightSection?: Icon;
}
