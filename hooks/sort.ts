import { enumSort, enumTablePosts, enumTableUsers } from "@/types/enums";
import { useState } from "react";

export const useSortUsers = (setList: any) => {
	const [nameOrder, setNameOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [emailOrder, setEmailOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [statusOrder, setStatusOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [createdOrder, setCreatedOrder] = useState<enumSort>(enumSort.DEFAULT);

	const sortItems = (field: enumTableUsers) => {
		switch (field) {
			case enumTableUsers.NAME:
				setNameOrder(prevNameOrder => {
					if (prevNameOrder == enumSort.DEFAULT || prevNameOrder == enumSort.DESCENDING) {
						setList((list: any[]) => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...list!].filter(item => item.name);
							const nullNames = [...list!].filter(item => !item.name);

							// Sort the array with valid names
							validNames.sort((a, b) => a.name!.localeCompare(b.name!));

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return enumSort.ASCENDING;
					} else {
						setList((list: any[]) => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...list!].filter(item => item.name);
							const nullNames = [...list!].filter(item => !item.name);

							// Sort the array with valid names
							validNames.sort((a, b) => a.name!.localeCompare(b.name!)).reverse();

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTableUsers.EMAIL:
				setEmailOrder(prevEmailOrder => {
					if (prevEmailOrder == enumSort.DEFAULT || prevEmailOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'email' ascending
						setList((list: any[]) => [...list!].sort((a, b) => a.email.localeCompare(b.email)));

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'email' descending
						setList((list: any[]) => [...list!].sort((a, b) => a.email.localeCompare(b.email)).reverse());

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTableUsers.STATUS:
				setStatusOrder(prevStatusOrder => {
					if (prevStatusOrder == enumSort.DEFAULT || prevStatusOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'status' ascending
						setList((list: any[]) => [...list!].sort((a, b) => a.status.localeCompare(b.status)));

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'status' descending
						setList((list: any[]) => [...list!].sort((a, b) => a.status.localeCompare(b.status)).reverse());

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTableUsers.CREATED:
				setCreatedOrder(prevCreatedOrder => {
					if (prevCreatedOrder == enumSort.DEFAULT || prevCreatedOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'created at' ascending
						setList((list: any[]) =>
							[...list!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateA.getTime() - dateB.getTime(); // Sort by time value
							})
						);

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'created at' descending
						setList((list: any[]) =>
							[...list!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateB.getTime() - dateA.getTime(); // Sort by time value
							})
						);

						return enumSort.DESCENDING;
					}
				});
				break;
		}
	};

	return { sort: sortItems, nameOrder, emailOrder, statusOrder, createdOrder };
};

export const useSortBlog = (setList: any) => {
	const [titleOrder, setTitleOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [categoryOrder, setCategoryOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [statusOrder, setStatusOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [authorOrder, setAuthorOrder] = useState<enumSort>(enumSort.DEFAULT);
	const [createdOrder, setCreatedOrder] = useState<enumSort>(enumSort.DEFAULT);

	const sortItems = (field: enumTablePosts) => {
		switch (field) {
			case enumTablePosts.TITLE:
				setTitleOrder(prevTitleOrder => {
					if (prevTitleOrder == enumSort.DEFAULT || prevTitleOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'title' ascending
						setList((list: any) => [...list!].sort((a, b) => a.title.localeCompare(b.title)));

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'title' descending
						setList((list: any) => [...list!].sort((a, b) => a.title.localeCompare(b.title)).reverse());

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTablePosts.CATEGORY:
				setCategoryOrder(prevCategoryOrder => {
					if (prevCategoryOrder == enumSort.DEFAULT || prevCategoryOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'category' ascending
						setList((list: any) =>
							[...list!].sort((a, b) => a.category?.title.localeCompare(b.category?.title!)!)
						);

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'category' descending
						setList((list: any) =>
							[...list!].sort((a, b) => a.category?.title.localeCompare(b.category?.title!)!).reverse()
						);

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTablePosts.STATUS:
				setCategoryOrder(prevStatusOrder => {
					if (prevStatusOrder == enumSort.DEFAULT || prevStatusOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'category' ascending
						setList((list: any) => [...list].sort((a, b) => a.status.localeCompare(b.status)));

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'category' descending
						setList((list: any) => [...list].sort((a, b) => a.status.localeCompare(b.status)).reverse());

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTablePosts.AUTHOR:
				setAuthorOrder(prevAuthorOrder => {
					if (prevAuthorOrder == enumSort.DEFAULT || prevAuthorOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'author' ascending
						setList((list: any) => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...list!].filter(item => item.user);
							const nullNames = [...list!].filter(item => !item.user);

							// Sort the array with valid names
							validNames.sort((a, b) => a.user.name!.localeCompare(b.user.name!));

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'author' descending
						setList((list: any) => {
							// Split the array into two: one with valid names and one with null names
							const validNames = [...list!].filter(item => item.user);
							const nullNames = [...list!].filter(item => !item.user);

							// Sort the array with valid names
							validNames.sort((a, b) => a.user.name!.localeCompare(b.user.name!)).reverse();

							// Concatenate the sorted valid names array with the null names array
							return [...validNames, ...nullNames];
						});

						return enumSort.DESCENDING;
					}
				});
				break;

			case enumTablePosts.CREATED:
				setCreatedOrder(prevCreatedOrder => {
					if (prevCreatedOrder == enumSort.DEFAULT || prevCreatedOrder == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'created at' ascending
						setList((list: any) =>
							[...list!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateA.getTime() - dateB.getTime(); // Sort by time value
							})
						);

						return enumSort.ASCENDING;
					} else {
						// Create a shallow copy of items and sort by 'created at' descending
						setList((list: any) =>
							[...list!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateB.getTime() - dateA.getTime(); // Sort by time value
							})
						);

						return enumSort.DESCENDING;
					}
				});
				break;
		}
	};

	return { sort: sortItems, titleOrder, categoryOrder, statusOrder, authorOrder, createdOrder };
};
