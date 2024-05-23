import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

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

// app.use(async (ctx, next) => {
//   ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // set the access control allow origin header
//   ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // set the access control allow methods header
//   ctx.response.headers.set("Access-Contol-Allow-Headers", "Content-Type"); // set the access control allow headers header
//   await next(); // call the next middleware
// })

app.use(
  oakCors({
    origin: "http://localhost:3000",
  })
);

app.use(todosRoutes.routes()); // use the todosRoutes
app.use(todosRoutes.allowedMethods()); // use the allowedMethods

// listen to port 8000
await app.listen({ port: 8000 });
