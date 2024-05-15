"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
/*
npm install --save-dev @types/node
npm install --save-dev @types/express

we will find many @types packages because they do
translations from JavaScript to TypeScript, so TypeScript can understand them.
*/
app.listen({ port: 3000 });
