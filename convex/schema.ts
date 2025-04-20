import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
export default defineSchema({
    users: defineTable({
        name:v.string(),
        email:v.string(),
        image:v.optional(v.string()),
        clerkId:v.string(),
    }).index("by_clerkId", ["clerkId"]),

    plans:defineTable({
        userId:v.id("users"),
        name:v.string(),
        workoutPlan:v.object({
            schedule:v.array(v.string()),
            exercises:v.array(v.object({
                day:v.string(),
                routines:v.array(v.object({
                    name:v.optional(v.string()),
                    sets:v.optional(v.string()),
                    reps:v.optional(v.string()),
                    duration:v.optional(v.string()),
                    description:v.optional(v.string()),
                    exercises:v.optional(v.array(v.string())),
                }))
            }))
        }),
        dietPlan:v.object({
            dailyCalories: v.number(),
            meals: v.array(v.object({
                name:v.string(),
                foods:v.string(),
            }))
        }),
        isActive:v.boolean(),
    }).index("by_userId", ["userId"]).index("by_active", ["isActive"]),
})