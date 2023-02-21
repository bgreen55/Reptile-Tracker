"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_controller_1 = require("./controllers/users_controller");
const reptiles_controller_1 = require("./controllers/reptiles_controller");
const feedings_controller_1 = require("./controllers/feedings_controller");
const husbandry_controller_1 = require("./controllers/husbandry_controller");
const schedules_controller_1 = require("./controllers/schedules_controller");
dotenv_1.default.config();
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, reptiles_controller_1.reptilesController)(app, client);
(0, users_controller_1.usersController)(app, client);
(0, feedings_controller_1.feedingsController)(app, client);
(0, husbandry_controller_1.husbandryController)(app, client);
(0, schedules_controller_1.schedulesController)(app, client);
//this is middleware for index page
app.get("/", (req, res) => {
    res.send(`<h1>Hello, world!</h1>`);
});
//middleware for users, returns all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client.user.findMany();
    res.json(users);
}));
//middleware for user to logout
app.delete("/sessions", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
app.listen(parseInt(process.env.PORT || "3000", 10), () => {
    console.log(`App running on port ${process.env.PORT}`);
});
exports.default = app;
