import { Profile, Prisma } from "@prisma/client";

// Type for creating a profile (without id and relations)
export type ProfileCreate = Prisma.ProfileCreateInput;

// Type for updating a profile (all fields optional except id)
export type ProfileUpdate = Prisma.ProfileUpdateInput;

// Type for default profile (with id and no relations)
export type ProfileGet = Profile;

// Type for fetched profile with relations
export type ProfileRelations = Prisma.ProfileGetPayload<{ include: { user: true } }>;
