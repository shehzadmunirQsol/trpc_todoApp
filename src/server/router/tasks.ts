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
  .mutation("createSubTask", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      priority: z.number(),
      assignedToId: z.string(),
      status: z.string(),
      task_id: z.string(),
      createdBy: z.string()

    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.subTask.create({
        data: {
          name: input.name,
          description: input.description,
          priority: input.priority,
          assignedToId: input.assignedToId,
          status: input.status,
          task_id: input.task_id,
          createdBy: input.createdBy
        },
      })
    }
  })
  .query("getSubTasksById", {
    input: z.object({
      
      task_id: z.string().optional(),
     

    }),
    async resolve({ ctx,input }) {
        return await ctx.prisma.subTask.findMany({where: {
          task_id:input.task_id
        },});

    }
    
  })
  .mutation("updateSubTask", {
    // validate input with Zod
    input: z.object({
      id: z.string(),
      name: z.string(),
      task_id: z.string(),
      description: z.string(),
      priority: z.number(),
      assignedToId: z.string(),
      status: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.subTask.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          priority: input.priority,
          task_id: input.task_id,
          assignedToId: input.assignedToId,
          status: 'Completed',
        },
      })
    }
  })
  .mutation("deleteSubTask", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.subTask.delete({
        where: {
          id: input.id,
        },
      }
      )
    }
  })