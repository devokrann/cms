export const capitalizeWord = (value: string) =>
	value.trim().toLowerCase().charAt(0).toUpperCase() + value.trim().toLowerCase().slice(1);

export const capitalizeWords = (words: string) => words.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

export const joinIds = (productId: string, variantId: string) => `${productId}-${variantId}`;

export const initialize = (words: string) =>
	words
		.split(" ")
		.map(word => word.charAt(0).toUpperCase())
		.join("");

export const crumbify = (url: string) => {
	const crumbs = [{ link: "/", label: "Home" }];

	let currentLink = "";

	url.split("/")
		.filter(crumb => crumb != "")
		.map(item => {
			currentLink += `/${item}`;
			item.length < 24 &&
				crumbs.push({
					link: currentLink,
					label: `${capitalizeWords(item.replaceAll("-", " "))}`,
				});
		});

	return crumbs;
};

export const linkify = (string: string) =>
	string
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-zA-Z0-9-]/g, "")
		.replace(/-+/g, "-");

export const unlinkify = (string: string) => capitalizeWords(string.toLowerCase().replaceAll("-", " "));

export const hasDatePassed = (dateString: string) => {
	// Split the input string into month and year
	const [month, year] = dateString.split("/").map(Number);

	// Get the current date
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
	const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year

	// Check if the provided year is in the past
	if (year < currentYear) {
		return true;
	}

	// If the year is the same, check if the month has passed
	if (year === currentYear && month < currentMonth) {
		return true;
	}

	// Otherwise, the date has not passed
	return false;
};
