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
Object.defineProperty(exports, "__esModule", { value: true });
exports.husbandryController = void 0;
const controller_1 = require("../lib/controller");
const createHusbandry = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { length, weight, temperature, humidity } = req.body;
    const userId = (_a = req.jwtBody) === null || _a === void 0 ? void 0 : _a.userId;
    const reptileId = (_b = req.jwtBody) === null || _b === void 0 ? void 0 : _b.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const husbandry = yield client.husbandryRecord.create({
        data: {
            reptile: { connect: { id: reptileId } },
            length,
            weight,
            temperature,
            humidity,
        },
    });
    res.json({ husbandry });
});
const getAllHusbandry = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = (_c = req.jwtBody) === null || _c === void 0 ? void 0 : _c.userId;
    const reptileId = (_d = req.jwtBody) === null || _d === void 0 ? void 0 : _d.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const husbandry = yield client.husbandryRecord.findMany({
        where: {
            reptileId
        }
    });
    res.json({ husbandry });
});
exports.husbandryController = (0, controller_1.controller)("husbandry", [
    { path: "/all", method: "get", endpointBuilder: getAllHusbandry, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createHusbandry, skipAuth: false }
]);
