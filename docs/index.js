"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const users_controller_1 = require("./controllers/users_controller");
const reptiles_controller_1 = require("./controllers/reptiles_controller");
const feedings_controller_1 = require("./controllers/feedings_controller");
const husbandry_controller_1 = require("./controllers/husbandry_controller");
const schedules_controller_1 = require("./controllers/schedules_controller");
const express_handlebars_1 = require("express-handlebars");
dotenv_1.default.config();
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.engine("hbs", (0, express_handlebars_1.engine)({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, "/views"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, reptiles_controller_1.reptilesController)(app, client);
(0, users_controller_1.usersController)(app, client);
(0, feedings_controller_1.feedingsController)(app, client);
(0, husbandry_controller_1.husbandryController)(app, client);
(0, schedules_controller_1.schedulesController)(app, client);
// Redirects asset requests to client server
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        if (req.path.match(/\.\w+$/)) {
            fetch(`${process.env.ASSET_URL}/${req.path}`).then((response) => {
                if (response.ok) {
                    res.redirect(response.url);
                }
                else {
                    // handle dev problems here
                }
            });
        }
        else {
            next();
        }
    });
}
else {
    app.use("/static", express_1.default.static(path_1.default.join(__dirname, "static")));
}
// Returns client page from server
app.get("*", (req, res) => {
    if (process.env.NODE_ENV === "production") {
        const manifest = require("./static/manifest.json");
        res.render("app", {
            development: false,
            jsUrl: manifest["src/main.tsx"].file,
            cssUrl: manifest["src/main.css"].file
        });
    }
    else {
        res.render("app", {
            development: true,
            assetUrl: process.env.ASSET_URL,
        });
    }
});
app.listen(parseInt(process.env.PORT || "3000", 10), () => {
    console.log(`App running on port ${process.env.PORT}`);
});
exports.default = app;
