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
//this is middleware for index page, shows 
// I should see the name of your application
// I should see a description of what the app does.
// I should be able to navigate to the Login page
// I should be able to navigate to the Signup page
app.get("/", (req, res) => {
    res.send(`
    <h1>Reptile Manager</h1>
    <p>Reptile Manager is a web application that allows users to track their reptiles and their care.</p>
    <a href="/login">Login</a>
    <a href="/signup">Signup</a>
  `);
});
//login page
// I should be able to sign into a user account
// I should be able to navigate to the signup page
// Upon signing in, I should be redirected to the dashboard page
//login is a get request, headers are content type json, body is email and password
//on button click run the pullData function
app.get("/login", (req, res) => {
    res.send(`
  <script>
  async function pullData() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
      "email": email,
      "password": password,
    };
    //console.log(data);
    
    //parse data into json
    var json = JSON.stringify(data);
    console.log(json);

    //send data to server
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
    const result = await response.json();
    console.log(result);



  }
  </script>
    <h1>Login</h1>
      <input type="text" id="email" name="email" placeholder="Email" />
      <input type="password" id="password" name="password" placeholder="Password" />
      <button onclick="pullData()">Login</button>
    
    <a href="/signup">Signup</a>
    <a href="/">Home</a>
  `);
});
//signup page  
// I should be able to create a user account
// I should be able to navigate to the Login page
// Upon creating an account I should be redirected to the dashboard page
app.get("/signup", (req, res) => {
    res.send(`
    <h1>Signup</h1>
    <form action="/users/create" method="POST">
      <input type="text" name="firstName" placeholder="First Name" />
      <input type="text" name="lastName" placeholder="Last Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
    <a href="/login">Login</a>
    <a href="/">Home</a>
  `);
});
//Dashboard Page
// I should see all of the schedules for my user for the day of the week it is (for example, if it is Monday then I should only see the schedules that have me doing something on Monday.)
// I should see a list of all my reptiles
// When selecting a reptile the app should navigate to the Reptile page
// I should be able to create a new reptile (you can do this on this page via something like a pop up, or you can create a new page for this)
// I should be able to delete a reptile.
// I should be able to log out of my account
app.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    const body = jsonwebtoken_1.default.verify(token, process.env.ENCRYPTION_KEY);
    const user = yield client.user.findUnique({
        where: {
            id: body.userId,
        },
    });
    if (!user) {
        res.redirect("/login");
        return;
    }
    res.send(`
    <h1>Dashboard</h1>
    <p>Welcome ${user.firstName} ${user.lastName}</p>
    <a href="/logout">Logout</a>
    <a href="/">Home</a>
  `);
}));
//Reptile Page
// I should see a list of all of the feedings for this reptile
// I should see a list of all of the husbandry records for this reptile
// I should see a list of all of the schedules for this reptile.
// I should be able to update this reptile
// I should be able to create a feeding for this reptile
// I should be able to create a husbandry record for this reptile
// I should be able to create a schedule for this reptile
app.get("/reptile/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reptile = yield client.reptile.findUnique({
        where: {
            id: Number(req.params.id),
        },
    });
    if (!reptile) {
        res.status(404).send("Reptile not found");
        return;
    }
    res.send(`
    <h1>${reptile.name}</h1>
    <p>Species: ${reptile.species}</p>
    <p>Sex: ${reptile.sex}</p>

    <a href="/logout">Logout</a>
    <a href="/">Home</a>
  `);
}));
//logout page
// I should be able to log out of my account
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});
//middleware for users, returns all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client.user.findMany();
    res.json(users);
}));
//middleware for user to login
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield client.user.findFirst({
        where: {
            email,
        },
    });
    if (!user) {
        res.status(404).json({ message: "Invalid email or password, user doesnt exist" });
        return;
    }
    const isValid = yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        res.status(404).json({ message: "Invalid email or password, password is wrong" });
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
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    //const passwordHash = await password;
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
