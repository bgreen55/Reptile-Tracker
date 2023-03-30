import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWTBody, RequestWithJWTBody } from "./dto/jwt";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";
import { feedingsController } from "./controllers/feedings_controller";
import { husbandryController } from "./controllers/husbandry_controller";
import { schedulesController } from "./controllers/schedules_controller";
import bcrypt from "bcrypt";

dotenv.config();
const client = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

reptilesController(app, client);
usersController(app, client);
feedingsController(app, client);
husbandryController(app, client);
schedulesController(app, client);



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

//signup page  
    // I should be able to create a user account
    // I should be able to navigate to the Login page
    // Upon creating an account I should be redirected to the dashboard page

app.get("/signup", (req, res) => {
  res.send(`
  <script>
  async function pullData() {
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
      "firstName": fname,
      "lastName": lname,
      "email": email,
      "password": password,
    };
    console.log(data);
    
    //parse data into json
    var json = JSON.stringify(data);
    //console.log(json);

    //send data to server
    const response = await fetch("/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
    const result = await response.json();
    console.log(result);

    alert("Account created successfully, please login using those same credentials");


  }
  </script>
    <h1>Signup</h1>
      <input type="text" id="fname" name="fname" placeholder="First Name" />
      <input type="text" id="lname" name="lname" placeholder="Last Name" />
      <input type="text" id="email" name="email" placeholder="Email" />
      <input type="password" id="password" name="password" placeholder="Password" />
      <button onclick="pullData()">Signup</button>
    
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

app.get("/dashboard", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }

  const body = jwt.verify(token, process.env.ENCRYPTION_KEY!!) as JWTBody;
  const user = await client.user.findUnique({
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
});

//Reptile Page
    // I should see a list of all of the feedings for this reptile
    // I should see a list of all of the husbandry records for this reptile
    // I should see a list of all of the schedules for this reptile.
    // I should be able to update this reptile
    // I should be able to create a feeding for this reptile
    // I should be able to create a husbandry record for this reptile
    // I should be able to create a schedule for this reptile

app.get("/reptile/:id", async (req, res) => {
  const reptile = await client.reptile.findUnique({
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
});



//logout page
    // I should be able to log out of my account

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});





//middleware for users, returns all users
app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json(users);
});

//middleware for user to login
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await client.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password, user doesnt exist" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password, password is wrong" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ENCRYPTION_KEY!!,
    {
      expiresIn: "1000m",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({
    user,
    token,
  });

  


});

//middleware for dashboard
  // Dashboard Page
    // I should see all of the schedules for my user for the day of the week it is (for example, if it is Monday then I should only see the schedules that have me doing something on Monday.)
    // I should see a list of all my reptiles
    // When selecting a reptile the app should navigate to the Reptile page
    // I should be able to create a new reptile (you can do this on this page via something like a pop up, or you can create a new page for this)
    // I should be able to delete a reptile.
    // I should be able to log out of my account
app.get("/dashboard", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }

  const body = jwt.verify(token, process.env.ENCRYPTION_KEY!!) as JWTBody;
  const user = await client.user.findUnique({
    where: {
      id: body.userId,
    },
  });

  if (!user) { 
    res.redirect("/login");
    return;
  }
  const reptiles = await client.reptile.findMany({
    where: {
      userId: user.id,
    },
  });
  //list all the reptiles in the output
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard</title>
    
  </head>
  <body>
    <h1>Dashboard</h1>
    <p>Welcome ${user.firstName} ${user.lastName}</p>
    <a href="/logout">Logout</a>
    <a href="/">Home</a>
    <h2>Reptiles</h2>
    <ul>
      ${reptiles
        .map(
          (reptile) => `
        <li>
          <a href="/reptile/${reptile.id}">${reptile.name}</a>
        </li>
      `
        )
        .join("")}
    </ul>

    <h2>Create Reptile</h2>
    <form method="POST" action="/reptile/create">
      <input name="name" placeholder="Name" />
      <input name="species" placeholder="Species" />

      <button>Create Reptile</button>
    </form>

  </body>
  </html>



    
  `);
});



//middleware for user to register
app.post("/users/create", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  //const passwordHash = await password;
  const user = await client.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ENCRYPTION_KEY!!,
    {
      expiresIn: "1000m",
    }
  );

  res.json({ user, token });
});



//middleware for user to logout
app.delete("/sessions", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});






export default app;