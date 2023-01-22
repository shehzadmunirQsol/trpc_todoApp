import { createRouter } from './context'
import { z } from 'zod'




export const tasksRouter = createRouter()
  .query("getTasks", {
    input: z.object({
      
      assignedToId: z.string(),
      status: z.string(),
      user_auth: z.string(),

    }),
    async resolve({ ctx,input }) {
      if(input.user_auth =='admin'){
        return await ctx.prisma.task_vw.findMany({where: {
          status:input.status
        },});

      }else{
        return await ctx.prisma.task_vw.findMany({where: {
          assignedToId: input.assignedToId,
          status:input.status
        },});

      }
    }
  })
  .query("getTaskById", {
    input: z.object({
      
      id: z.string().optional(),
     

    }),
    async resolve({ ctx,input }) {
        return await ctx.prisma.task_vw.findUnique({where: {
          id:input.id
        },});

    }
  })

  .mutation("createTask", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      priority: z.number(),
      assignedToId: z.string(),
      status: z.string(),
      createdBy: z.string()

    }),
    async resolve({ ctx, input }) {
      console.log(input)
      await ctx.prisma.task.create({
        data: {
          name: input.name,
          description: input.description,
          priority: input.priority,
          assignedToId: input.assignedToId,
          status: input.status,
          createdBy: input.createdBy
        },
      })
    }
  })
  .mutation("updateTask", {
    // validate input with Zod
    input: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      priority: z.number(),
      assignedToId: z.string(),
      status: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          priority: input.priority,
          assignedToId: input.assignedToId,
          status: 'Completed',
        },
      })
    }
  })

  .mutation("deleteTask", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      }
      )
    }
  })


