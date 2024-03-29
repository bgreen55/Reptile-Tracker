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
exports.authenticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticationMiddleware = (req, res, next, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    verify: try {
        // Throws error if invalid
        const jwtBody = jsonwebtoken_1.default.verify(token || '', process.env.ENCRYPTION_KEY);
        req.jwtBody = jwtBody;
        const reptileId = req.body.reptileId;
        const userId = req.jwtBody.userId;
        const userReptiles = yield client.user.findMany({
            where: {
                id: userId,
                reptiles: { some: { id: reptileId } }
            }
        });
        // Only adds reptileId to jwtBody if related to user
        if (Object.keys(userReptiles).length == 0) {
            break verify;
        }
        req.jwtBody = {
            userId,
            reptileId
        };
    }
    catch (error) {
        console.log("token failed validation");
    }
    finally {
        next();
    }
});
exports.authenticationMiddleware = authenticationMiddleware;
