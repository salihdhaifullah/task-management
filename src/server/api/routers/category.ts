import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({ 
    getCategories: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => { 
        return ctx.db.category.findMany({
            take: 5,
            where: { 
                userId: ctx.session.user.id,
                name: {
                    contains: input
                }
            },
            select: { name: true }
          });
    })
})