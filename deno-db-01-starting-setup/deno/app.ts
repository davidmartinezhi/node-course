import { Application } from "https://deno.land/x/oak/mod.ts";

import todosRoutes from "./routes/todos.ts";

const app = new Application(); // create a new application

/*
Whenever we have middleware that do async operations we need to make
all the middleware async. This is because oak will wait for the middleware to finish
*/
app.use(async (ctx, next) => { // next is a function that will be called by oak when the middleware is done
  console.log("Middleware!");
  await next(); // call the next middleware. 

  /*
  this tells oak that we just dont want to start the next middleware in line but also want to wait for 
  them to finish before we send back the response
  */
});

app.use(todosRoutes.routes()); // use the todosRoutes
app.use(todosRoutes.allowedMethods()); // use the allowedMethods

// listen to port 8000
await app.listen({ port: 8000 });
