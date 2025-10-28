import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      return null;
    }

    const avatarUrl = profile.avatarId ? await ctx.storage.getUrl(profile.avatarId) : null;
    return { ...profile, avatarUrl };
  },
});

export const update = mutation({
  args: {
    name: v.string(),
    avatarId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        ...(args.avatarId ? { avatarId: args.avatarId } : {}),
      });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        name: args.name,
        ...(args.avatarId ? { avatarId: args.avatarId } : {}),
      });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});
