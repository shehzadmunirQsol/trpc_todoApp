import { createRouter } from './context'
import { z } from 'zod'




export const categoriesRouter = createRouter()
  .query("getCategories", {
    async resolve({ ctx }) {
      return await ctx.prisma.categories.findMany();
    }
  })
  .mutation("deleteCategories", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.categories.delete({
        where: {
          id: input.id,
        },
      }
    )
  }
  })
  .mutation("createCategory", {
    // validate input with Zod
    input: z.object({ 
      category_name: z.string(), 
      category_desc: z.string(), 
      status: z.number(), 
      createdBy: z.string(), 
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.categories.create({
        data: {
          category_name: input.category_name,
          category_desc: input.category_desc,
          status: input.status,
          createdBy: input.createdBy,
        },
      })    
    }
  })
  .mutation("updateCategory", {
    input: z.object({
      id: z.string(),
     category_name: z.string(), 
      category_desc: z.string(), 
      status: z.number(), 
      createdBy: z.string(), 
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const user = await ctx.prisma.categories.update({
        where: {
          id: input.id,
        },
        data: {
          category_name: input.category_name,
          category_desc: input.category_desc,
          status: input.status,
          createdBy: input.createdBy,
        },
      })
      return user
    }
  })
   .mutation("updateCategoryStatus", {
    input: z.object({
      id: z.string(),  
      status: z.number(),  
    }),
    async resolve({ ctx, input }) {
      // update a user in the database based on the id
      const user = await ctx.prisma.categories.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,

        },
      })
      return user
    }
  })

