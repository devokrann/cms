import { Tag, Prisma } from "@prisma/client";

// Type for creating a tag (without id and relations)
export type TagCreate = Prisma.TagCreateInput;

// Type for updating a tag (all fields optional except id)
export type TagUpdate = Prisma.TagUpdateInput;

// Type for default tag (with id and no relations)
export type TagGet = Tag;

// Type for fetched tag with relations
export type TagRelations = Prisma.TagGetPayload<{ include: { posts: true } }>;
