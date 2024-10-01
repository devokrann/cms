import { User, Prisma } from "@prisma/client";

// Type for creating a user (without id and relations)
export type UserCreate = Prisma.UserCreateInput;

// Type for updating a user (all fields optional except id)
export type UserUpdate = Prisma.UserUpdateInput;

// Type for default user (with id and no relations)
export type UserGet = User;

// Type for fetched user with relations
export type UserRelations = Prisma.UserGetPayload<{
	include: {
		accounts: true;
		sessions: true;
		authenticator: true;
		role: true;
		status: true;
		posts: true;
		otps: true;
		otls: true;
		profile: true;
	};
}>;
