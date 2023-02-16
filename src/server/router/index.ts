// src/server/router/index.ts

// this is the root route
// here we also merge all the other routes

import { createRouter } from './context'
import superjson from 'superjson'
import { usersRouter } from './users'
import { tasksRouter } from './tasks'
import { categoriesRouter } from './categories'
import { productsRouter } from './product'


export const appRouter = createRouter() // centralized point for all of our resolvers
  .transformer(superjson)
  .merge("users.", usersRouter) // merge the user router into the app router
  .merge("tasks.", tasksRouter) // merge the task router into the app router
  .merge("categrories.", categoriesRouter) // merge the task router into the app router
  .merge("products.", productsRouter) // merge the task router into the app router
// export type definition of API
export type AppRouter = typeof appRouter
