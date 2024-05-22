import { Router } from "https://deno.land/x/oak/mod.ts";
import { cloneState } from "https://deno.land/x/oak@v16.0.0/utils/clone_state.ts";

const router = new Router();

interface Todo {
    id: string;
    text: string;
}

let todos: Todo[]  = [];

router.get("/todos", (ctx) => {

    // with oak we just set the response body. if set to an object oak will assume it should be added as json and will be parsed as json
    // oak will always sent back a response. so we need to set the response body
    ctx.response.body = { todos: todos }; // return the todos
});

router.post("/todos", async (ctx) => {

    /* 
    on oak it automatically looks at request body and header
    if it signals the req carries json data then oak will automatically parse that body and gives us access to the parsed body
    on the context request body property
    */
    const dataText = await ctx.request.body.json(); // get the body text

    const newTodo: Todo = {
        id: new Date().toISOString(), 
        text: dataText
    };

    todos.push(newTodo); // add the new todo to the todos array
    ctx.response.body = { message: "Created todo!", todo: newTodo }; // return the new todo
});

router.put("/todos/:todoId", async (ctx) => {
    const tid = ctx.params.todoId; // get the todo id
    const todoIndex = todos.findIndex((todo) => todo.id === tid); // find the index of the todo

    if (todoIndex < 0) {
        ctx.response.body = { message: "Could not find todo!" }; // return message if todo not found
        return;
    }

    const dataText = await ctx.request.body.json(); // get the body text

    todos[todoIndex] = { id: todos[todoIndex].id, text: dataText }; // update the todo
    ctx.response.body = { message: "Updated todo!" }; // return message
});

router.delete("/todos/:todoId", (ctx) => {
    const tid = ctx.params.todoId; // get the todo id
    todos = todos.filter(todo => todo.id !== tid); // remove the todo
    ctx.response.body = { message: "Deleted todo!" }; // return message
});

export default router;
