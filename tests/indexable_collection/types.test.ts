import { collection, kvdex, model } from "../../mod.ts";
import { assert, assertEquals } from "@std/assert";
import { useKv } from "../utils.ts";
import { TObject } from "../values.ts";

Deno.test("indexable_collection - types", async (t) => {
  await t.step(
    "Should allow and properly store/retrieve all KvValue types",
    async () => {
      await useKv(async (kv) => {
        const db = kvdex({
          kv,
          schema: {
            objects: collection(model<typeof TObject>(), {
              indices: {
                TString: "primary",
                TNumber: "secondary",
              },
            }),
          },
        });

        const cr = await db.objects.add(TObject);
        assert(cr.ok);

        const doc = await db.objects.find(cr.id);
        assertEquals(doc?.value, TObject);
      });
    },
  );
});
