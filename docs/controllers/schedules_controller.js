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
exports.schedulesController = void 0;
const controller_1 = require("../lib/controller");
const createSchedule = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.jwtBody) === null || _a === void 0 ? void 0 : _a.userId;
    const reptileId = (_b = req.jwtBody) === null || _b === void 0 ? void 0 : _b.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
    const schedule = yield client.schedule.create({
        data: {
            reptile: { connect: { id: reptileId } },
            user: { connect: { id: userId } },
            type,
            description,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        },
    });
    res.json({ schedule });
});
const getAllSchedulesFromUser = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.jwtBody) === null || _c === void 0 ? void 0 : _c.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const schedules = yield client.schedule.findMany({
        where: {
            userId
        }
    });
    res.json({ schedules });
});
const getAllSchedulesFromReptile = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const userId = (_d = req.jwtBody) === null || _d === void 0 ? void 0 : _d.userId;
    const reptileId = (_e = req.jwtBody) === null || _e === void 0 ? void 0 : _e.reptileId;
    if (!userId || !reptileId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const schedules = yield client.feeding.findMany({
        where: {
            reptileId
        }
    });
    res.json({ schedules });
});
exports.schedulesController = (0, controller_1.controller)("schedules", [
    { path: "/all/user", method: "get", endpointBuilder: getAllSchedulesFromUser, skipAuth: false },
    { path: "/all/reptile", method: "get", endpointBuilder: getAllSchedulesFromReptile, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createSchedule, skipAuth: false }
]);
