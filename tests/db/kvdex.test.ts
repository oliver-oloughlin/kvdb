import { collection, kvdex, model } from "../../mod.ts";
import { KVDEX_KEY_PREFIX } from "../../src/constants.ts";
import { assert } from "@std/assert";
import { useKv } from "../utils.ts";

Deno.test("db - kvdex", async (t) => {
  await t.step(
    "Should create unique keys for collections with equal name in different nestings",
    async () => {
      await useKv((kv) => {
        const db = kvdex({
          kv,
          schema: {
            numbers: collection(model<number>()),
            nested: {
              numbers: collection(model<number>()),
            },
          },
        });

        const key1 = JSON.stringify(db.numbers._keys.base);
        const key2 = JSON.stringify(db.nested.numbers._keys.base);

        assert(key1 !== key2);
        assert(key1 === `["${KVDEX_KEY_PREFIX}","numbers"]`);
        assert(key2 === `["${KVDEX_KEY_PREFIX}","nested","numbers"]`);
      });
    },
  );
});
