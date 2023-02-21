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
exports.usersController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const controller_1 = require("../lib/controller");
const getMe = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.jwtBody) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const user = yield client.user.findFirst({
        where: {
            id: userId
        }
    });
    res.json({ user });
    // TODO get the user
});
const createUser = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const user = yield client.user.create({
        data: {
            firstName,
            lastName,
            email,
            passwordHash,
        },
    });
    const token = jsonwebtoken_1.default.sign({
        userId: user.id
    }, process.env.ENCRYPTION_KEY, {
        expiresIn: '1m'
    });
    res.json({ user, token });
});
exports.usersController = (0, controller_1.controller)("users", [
    { path: "/me", endpointBuilder: getMe, method: "get" },
    { path: "/", method: "post", endpointBuilder: createUser, skipAuth: true }
]);
