"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors_1 = __importDefault(require("cors"));
const app = express();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const user_1 = __importDefault(require("./routes/user"));
const account_1 = __importDefault(require("./routes/account"));
app.use((0, cors_1.default)());
app.use(express.json());
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/account', account_1.default);
app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
