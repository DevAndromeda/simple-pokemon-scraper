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
declare class Client {
    cache: boolean;
    url: string;
    collection: Map<string, PokemonData>;
    constructor(options?: ClientOptions);
    get(name: string): Promise<PokemonData>;
}
export default Client;
export { Client };
