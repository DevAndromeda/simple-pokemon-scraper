"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Client = void 0;
const Util_1 = __importStar(require("./Util"));
class Client {
    constructor(options) {
        this.collection = new Util_1.Collection();
        this.cache = Boolean(options === null || options === void 0 ? void 0 : options.cache);
        this.url = (options === null || options === void 0 ? void 0 : options.url) ? options.url : "https://bulbapedia.bulbagarden.net/wiki";
    }
    get(name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof name !== "string" || !name)
                throw new Error("missing pokemon name");
            if (this.cache && this.collection.has(name.toLowerCase()))
                return this.collection.get(name.toLowerCase());
            const html = yield Util_1.default.html(`${this.url}/${encodeURIComponent(name.toLowerCase())}_(Pokémon)`);
            const document = Util_1.default.document(html);
            const holder = document.querySelector(".mw-content-ltr");
            if (!holder)
                throw new Error("Could not parse data");
            const dex = holder.children[1];
            if (!dex)
                throw new Error("Could not parse data");
            const obj = {
                name: dex.querySelector("big b").textContent,
                category: dex.querySelector("a span").textContent,
                id: dex.querySelector("big big a span").textContent,
                images: [...dex.querySelectorAll("img").values()].map(m => ({ title: m.alt, url: m.src.startsWith("//") ? `https:${m.src}` : m.src })),
                types: [...document.querySelector("a[title=\"Type\"]").parentElement.parentElement.querySelectorAll("table a span b").values()].map(m => m.textContent).filter(x => x !== "Unknown"),
                abilities: [...document.querySelector("a[title=\"Ability\"]").parentElement.parentElement.querySelector("table tr").querySelectorAll("a span").values()].map(m => m.textContent).filter(x => x !== "Unknown"),
                catch_rate: (_a = document.querySelector("a[title=\"Catch rate\"]").parentElement.parentElement.querySelector("table td").textContent) === null || _a === void 0 ? void 0 : _a.trim(),
                breeding: {
                    egg_groups: document.querySelector("a[title=\"Egg Group\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
                    hatch_time: document.querySelector("a[title=\"Egg cycle\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
                },
                height: document.querySelector("a[title=\"List of Pokémon by height\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
                weight: document.querySelector("a[title=\"Weight\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
                color: document.querySelector("a[title=\"List of Pokémon by color\"]").parentElement.parentElement.querySelector("table td").textContent.trim(),
                base_friendship: document.querySelector("a[title=\"List of Pokémon by base friendship\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
            };
            if (this.cache)
                this.collection.set(obj.name.toLowerCase(), obj);
            return obj;
        });
    }
}
exports.Client = Client;
exports.default = Client;
