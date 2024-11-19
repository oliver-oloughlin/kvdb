import { assert } from "@std/assert";
import { sleep, useDb } from "../utils.ts";
import { mockUser1, mockUser2 } from "../mocks.ts";

Deno.test("indexable_collection - getOneBySecondaryIndex", async (t) => {
  await t.step(
    "Should get only one document by a secondary index",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.add(mockUser1);
        await sleep(10);
        const cr2 = await db.i_users.add(mockUser2);

        assert(cr1.ok);
        assert(cr2.ok);

        const doc = await db.i_users.getOneBySecondaryIndex(
          "age",
          mockUser2.age,
        );
        assert(doc !== null);
        assert(doc.value.username === mockUser1.username);
      });
    },
  );
});
