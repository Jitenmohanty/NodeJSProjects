import client from "./client.js";

async function init() {
    //  await client.set("name","Pilu")
    await client.expire("name",10)
    // const result = await client.get("name")

    console.log(result)
}

init();