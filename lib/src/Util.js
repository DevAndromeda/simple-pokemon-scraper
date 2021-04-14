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
exports.Util = exports.Collection = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const jsdom_1 = require("jsdom");
class Util {
    static html(url) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(url).then(res => res.text()).catch(e => "");
            resolve(response);
        }));
    }
    static document(html) {
        if (!html)
            return;
        const { window: { document } } = new jsdom_1.JSDOM(html);
        return document;
    }
}
exports.Util = Util;
exports.Collection = Map;
exports.default = Util;
