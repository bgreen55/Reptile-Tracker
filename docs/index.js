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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_controller_1 = require("./controllers/users_controller");
const reptiles_controller_1 = require("./controllers/reptiles_controller");
const feedings_controller_1 = require("./controllers/feedings_controller");
const husbandry_controller_1 = require("./controllers/husbandry_controller");
const schedules_controller_1 = require("./controllers/schedules_controller");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
//this is middleware for index page, shows login fields and register button
app.get("/", (req, res) => {
    res.send(`
    <h1>Reptile Manager</h1>
    <form method="POST" action="/sessions">
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <form method="POST" action="/users/create">
      <input type="text" name="firstName" placeholder="First Name" />
      <input type="text" name="lastName" placeholder="Last Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  `);
});
//middleware for users, returns all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client.user.findMany();
    res.json(users);
}));
//middleware for user to login
app.post("/sessions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield client.user.findFirst({
        where: {
            email,
        },
    });
    if (!user) {
        res.status(404).json({ message: "Invalid email or password" });
        return;
    }
    const isValid = yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        res.status(404).json({ message: "Invalid email or password" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
    }, process.env.ENCRYPTION_KEY, {
        expiresIn: "1000m",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    res.json({
        user,
        token,
    });
}));
//middleware for user to register
app.post("/users/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    //const passwordHash = await bcrypt.hash(password, 10);
    const passwordHash = yield password;
    const user = yield client.user.create({
        data: {
            firstName,
            lastName,
            email,
            passwordHash,
        },
    });
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
    }, process.env.ENCRYPTION_KEY, {
        expiresIn: "1000m",
    });
    res.json({ user, token });
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
