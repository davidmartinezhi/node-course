const express = require("express");

const router = express.Router();

let todos = [];

router.get("/todos", (req, res) => {
  res.json({ todos: todos });
});

router.post("/todos", (req, res) => {
  const newTodo = { id: new Date().toISOString(), text: req.body.text };
  todos.push(newTodo);
  res.status(201).json({ message: "Todo created!" });
});

router.put("/todos/:id", (req, res) => {
  const tid = req.params.id;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
    return res.status(200).json({ message: "Todo updated!" });
  } else {
    return res.status(404).json({ message: "Todo not found!" });
  }
});

router.delete("/todos/:id", (req, res) => {
  const tid = req.params.id;
  todos = todos.filter((todoItem) => todoItem.id !== tid);
  res.status(200).json({ message: "Todo deleted!" });
});

module.exports = router;
