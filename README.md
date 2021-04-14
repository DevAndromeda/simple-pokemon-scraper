# Example

```js
const { Client } = require("simple-pokemon-scraper");
const client = new Client({ cache: true });

client.get("pikachu")
    .then(info => console.table(info));
```