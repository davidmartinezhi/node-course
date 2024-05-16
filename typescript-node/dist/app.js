"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const todos_1 = __importDefault(require("./routes/todos"));
/*
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/body-parser

we will find many @types packages because they do
translations from JavaScript to TypeScript, so TypeScript can understand them.
*/
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(todos_1.default);
app.listen(3000);
