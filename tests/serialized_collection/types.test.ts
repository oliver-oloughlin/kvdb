import { collection, kvdex, model } from "../../mod.ts";
import { jsonEncoder } from "../../src/ext/encoding/mod.ts";
import { assert, assertEquals } from "@std/assert";
import { useKv } from "../utils.ts";
import { VALUES } from "../values.ts";

Deno.test("serialized_collection - types", async (t) => {
  await t.step(
    "Should allow and properly store/retrieve all KvValue types",
    async () => {
      await useKv(async (kv) => {
        const schema = Object.fromEntries(
          VALUES.map((
            val,
            i,
          ) => [
            i,
            collection(model<typeof val>(), { encoder: jsonEncoder() }),
          ]),
        );

        const db = kvdex({ kv, schema });

        const crs = await Promise.all(VALUES.map((val, i) => db[i].add(val)));
        assert(crs.every((cr) => cr.ok));

        await Promise.all(
          VALUES.map((_, i) =>
            db[i].forEach((doc) => assertEquals(doc.value, VALUES[i]))
          ),
        );
      });
    },
  );
});
