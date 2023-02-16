import { createRouter } from './context'
import { z } from 'zod'




export const productsRouter = createRouter()
  .query("getProducts", {
    async resolve({ ctx }) {
      return await ctx.prisma.category_vw.findMany();
    }
  })
  .mutation("deleteProduct", {
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
  .mutation("createProduct", {
    // validate input with Zod
    input: z.object({ 
      product_name: z.string(), 
      product_des: z.string(), 
      product_img: z.string(), 
      status: z.number(),
      amount: z.number(),
      qty: z.number(),
      category_id: z.string(),
      createdBy: z.string(),

    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.products.create({
        data: {
              product_name: input.product_name, 
      product_des: input.product_des, 
      product_img: input.product_img, 
      amount: input.amount,
      qty: input.qty,
      category_id: input.category_id,
          status: input.status,
          createdBy: input.createdBy,
        },
      })    
    }
  })
  .mutation("updateProduct", {
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
   .mutation("updateProductStatus", {
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

