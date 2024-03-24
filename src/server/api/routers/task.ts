import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), category: z.string(), description: z.string().nullable(), priority: z.ZodEnum.create(["low", "mid", "high"]) }))
    .mutation(async ({ ctx, input }) => {

      await ctx.db.$transaction(async (tx) => {
        const category = await tx.category.upsert({
          where: {
            userId_name: {
              name: input.category,
              userId: ctx.session.user.id
            }
          },
          create: {
            name: input.category,
            userId: ctx.session.user.id
          },
          update: {},
          select: {
            id: true
          }
        });

        await tx.task.create({
          data: {
            userId: ctx.session.user.id,
            name: input.name,
            categoryId: category.id,
            description: input.description,
            priority: input.priority
          }
        });
      });
    }),

  getTasks: protectedProcedure
    .input(z.object({ category: z.string().optional(), completed: z.boolean().optional(), search: z.string().optional() }).optional())
    .query(({ ctx }) => {
      return ctx.db.task.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: {
          priority: "asc"
        },
        select: {
          id: true,
          name: true,
          completed: true,
          createdAt: true,
          description: true,
          priority: true,
          category: {
            select: {
              name: true
            }
          }
        },
      });
    }),

  updateCompletionState: protectedProcedure
    .input(z.object({ id: z.number(), completion: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        },
        data: { completed: input.completion }
      })
    }),


  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.task.delete({
        where: {
          id: input,
          userId: ctx.session.user.id
        }
      })
    }),



});
