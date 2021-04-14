import fetch from "node-fetch";
import { JSDOM } from "jsdom";

class Util {

    static html(url: string) {
        return new Promise<string>(async (resolve) => {
            const response = await fetch(url).then(res => res.text()).catch(e => "");

            resolve(response);
        });
    }

    static document(html: string) {
        if (!html) return;
        const { window: { document } } = new JSDOM(html);

        return document;
    }
}

export const Collection = Map;

export default Util;
export { Util };