import { v } from "convex/values";
import { mutation } from "./_generated/server";



export const syncUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),  
        image:v.optional(v.string()),
        clerkId:v.string(),
    },
    handler:async (ctx, args) => {
        console.log("CLERK ID :: ", args.clerkId);
        const existingUser = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), args.clerkId)).first();
        console.log("EXISTING USER :: ", existingUser);
        if(existingUser){
            return;
        }
        return await ctx.db.insert("users", args);
    }
})  

export const updateUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),  
        image:v.optional(v.string()),
        clerkId:v.string(),
    },
    handler:async (ctx, args) => {
        console.log("CLERK ID :: ", args.clerkId);
        const existingUser = await ctx.db.query("users").withIndex("by_clerkId",q=> q.eq("clerkId",args.clerkId)).first();
        console.log("EXISTING USER :: ", existingUser);
        if(!existingUser){
            return;
        }
        const result =  await ctx.db.patch(existingUser._id, args);
        console.log(result);
        return result;
    }
})