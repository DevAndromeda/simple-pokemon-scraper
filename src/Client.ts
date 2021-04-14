import Util, { Collection } from './Util';

export interface ClientOptions {
    cache?: boolean;
    url: string;
}

export interface PokemonData {
    name: string;
    category: string;
    id: string;
    images: {
        title: string;
        url: string;
    }[];
    types: string[];
    abilities: string[];
    catch_rate: string;
    breeding: {
        egg_groups: string;
        hatch_time: string;
    };
    height: string;
    weight: string;
    color: string;
    base_friendship: string;
}

class Client {
    cache: boolean;
    url: string;
    collection = new Collection<string, PokemonData>();

    constructor(options?: ClientOptions) {
        this.cache = Boolean(options?.cache);
        this.url = options?.url ? options.url : "https://bulbapedia.bulbagarden.net/wiki";
    }

    async get(name: string): Promise<PokemonData> {
        if (typeof name !== "string" || !name) throw new Error("missing pokemon name");

        if (this.cache && this.collection.has(name.toLowerCase())) return this.collection.get(name.toLowerCase());

        const html = await Util.html(`${this.url}/${encodeURIComponent(name.toLowerCase())}_(Pokémon)`);
        const document = Util.document(html);

        const holder = document.querySelector(".mw-content-ltr");
        if (!holder) throw new Error("Could not parse data");

        const dex = holder.children[1];
        if (!dex) throw new Error("Could not parse data");

        const obj = {
            name: dex.querySelector("big b").textContent,
            category: dex.querySelector("a span").textContent,
            id: dex.querySelector("big big a span").textContent,
            images: [...dex.querySelectorAll("img").values()].map(m => ({ title: m.alt, url: m.src.startsWith("//") ? `https:${m.src}` : m.src })),
            types: [...document.querySelector("a[title=\"Type\"]").parentElement.parentElement.querySelectorAll("table a span b").values()].map(m => m.textContent).filter(x => x !== "Unknown"),
            abilities: [...document.querySelector("a[title=\"Ability\"]").parentElement.parentElement.querySelector("table tr").querySelectorAll("a span").values()].map(m => m.textContent).filter(x => x !== "Unknown"),
            catch_rate: document.querySelector("a[title=\"Catch rate\"]").parentElement.parentElement.querySelector("table td").textContent?.trim(),
            breeding: {
                egg_groups: document.querySelector("a[title=\"Egg Group\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
                hatch_time: document.querySelector("a[title=\"Egg cycle\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
            },
            height: document.querySelector("a[title=\"List of Pokémon by height\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
            weight: document.querySelector("a[title=\"Weight\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),
            color: document.querySelector("a[title=\"List of Pokémon by color\"]").parentElement.parentElement.querySelector("table td").textContent.trim(),
            base_friendship: document.querySelector("a[title=\"List of Pokémon by base friendship\"]").parentElement.parentElement.querySelector("table tr").textContent.trim(),

        };

        if (this.cache) this.collection.set(obj.name.toLowerCase(), obj);

        return obj;
    }

}

export default Client;
export { Client }