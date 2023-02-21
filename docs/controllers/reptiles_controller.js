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
exports.reptilesController = void 0;
const controller_1 = require("../lib/controller");
const createReptile = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.jwtBody) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { species, name, sex } = req.body;
    const reptile = yield client.reptile.create({
        data: {
            user: { connect: { id: userId } },
            species,
            name,
            sex,
        },
    });
    res.json({ reptile });
});
const deleteReptile = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userId = (_b = req.jwtBody) === null || _b === void 0 ? void 0 : _b.userId;
    const reptileId = (_c = req.jwtBody) === null || _c === void 0 ? void 0 : _c.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const reptile = yield client.reptile.delete({
        where: {
            id: reptileId
        },
    });
    res.json({ reptile });
});
const updateReptile = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const userId = (_d = req.jwtBody) === null || _d === void 0 ? void 0 : _d.userId;
    const reptileId = (_e = req.jwtBody) === null || _e === void 0 ? void 0 : _e.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { species, name, sex } = req.body;
    const reptile = yield client.reptile.update({
        where: {
            id: reptileId
        },
        data: {
            species,
            name,
            sex,
        }
    });
    res.json({ reptile });
});
const getAllReptiltes = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req.jwtBody) === null || _f === void 0 ? void 0 : _f.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const reptiles = yield client.user.findUnique({
        where: {
            id: userId
        },
        select: {
            reptiles: true
        }
    });
    res.json({ reptiles });
});
exports.reptilesController = (0, controller_1.controller)("reptiles", [
    { path: "/delete", method: "delete", endpointBuilder: deleteReptile, skipAuth: false },
    { path: "/all", method: "get", endpointBuilder: getAllReptiltes, skipAuth: false },
    { path: "/update", method: "put", endpointBuilder: updateReptile, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createReptile, skipAuth: false }
]);
