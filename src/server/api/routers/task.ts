import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const categoryFilter = (category?: string) => {
  if (category === undefined || category ===  "--all--") return undefined;
  return {
    name: category
  }
}

const completedFilter = (completed?: string) => {
  if (completed === undefined || completed ===  "--all--") return undefined;
  return completed === "completed"
}

const priorityFilter = (priority?: string) => {
  if (priority === undefined || priority ===  "--all--") return undefined;
  switch (priority) {
    case 'low':
      return 1;
    case 'mid':
      return 2;
    case 'high':
      return 3;
    default:
      return undefined;
  }
}


export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), category: z.string(), description: z.string().nullable(), priority: z.number().min(1).max(3) }))
    .mutation(async ({ ctx, input }) => {

      await ctx.db.$transaction(async (tx) => {
        let category = await tx.category.findUnique({
          where: {
            userId_name: {
              name: input.category,
              userId: ctx.session.user.id
            }
          },
          select: {
            id: true
          }
        })
        
        if (category === null) {
          category = await tx.category.create({
            data: {
              name: input.category,
              userId: ctx.session.user.id
            },
            select: {
              id: true
            }
          })
        }

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
    .input(z.object({ category: z.string().optional(), completed: z.string().optional(), priority: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: { 
          userId: ctx.session.user.id,
          category: categoryFilter(input?.category),
          priority: priorityFilter(input?.priority),
          completed: completedFilter(input?.completed)
        },
        orderBy: { priority: "desc" },
        select: {
          id: true,
          name: true,
          completed: true,
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

    getTask: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: {
          id: input,
          userId: ctx.session.user.id
        },
        select: {
          id: true,
          name: true,
          priority: true,
          createdAt: true,
          description: true,
          category: {
            select: {
              name: true
            }
          }
        },
      })
    }),



    updateTask: protectedProcedure
    .input(z.object({ name: z.string(), category: z.string(), description: z.string().nullable(), priority: z.number().min(1).max(3), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        let category = await tx.category.findUnique({
          where: {
            userId_name: {
              name: input.category,
              userId: ctx.session.user.id
            }
          },
          select: {
            id: true
          }
        })
        
        if (category === null) {
          category = await tx.category.create({
            data: {
              name: input.category,
              userId: ctx.session.user.id
            },
            select: {
              id: true
            }
          })
        }

        await tx.task.update({
          where: {
            id: input.id,
            userId: ctx.session.user.id
          },
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
});
