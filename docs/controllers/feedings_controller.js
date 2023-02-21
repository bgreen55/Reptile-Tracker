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
exports.feedingsController = void 0;
const controller_1 = require("../lib/controller");
const createFeeding = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { foodItem } = req.body;
    const userId = (_a = req.jwtBody) === null || _a === void 0 ? void 0 : _a.userId;
    const reptileId = (_b = req.jwtBody) === null || _b === void 0 ? void 0 : _b.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const feeding = yield client.feeding.create({
        data: {
            reptile: { connect: { id: reptileId } },
            foodItem,
        },
    });
    res.json({ feeding });
});
const getAllFeedings = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = (_c = req.jwtBody) === null || _c === void 0 ? void 0 : _c.userId;
    const reptileId = (_d = req.jwtBody) === null || _d === void 0 ? void 0 : _d.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const feedings = yield client.feeding.findMany({
        where: {
            reptileId
        }
    });
    res.json({ feedings });
});
exports.feedingsController = (0, controller_1.controller)("feedings", [
    { path: "/all", method: "get", endpointBuilder: getAllFeedings, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createFeeding, skipAuth: false }
]);
