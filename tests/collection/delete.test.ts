import { assert } from "@std/assert";
import { mockUser1 } from "../mocks.ts";
import { generateUsers, useDb } from "../utils.ts";

Deno.test("collection - delete", async (t) => {
  await t.step(
    "Should successfully delete a document from the collection",
    async () => {
      await useDb(async (db) => {
        const cr = await db.users.add(mockUser1);
        const count1 = await db.users.count();

        assert(cr.ok);
        assert(count1 === 1);

        await db.users.delete(cr.id);

        const count2 = await db.users.count();
        const doc = await db.users.find(cr.id);

        assert(count2 === 0);
        assert(doc === null);
      });
    },
  );

  await t.step(
    "Should successfully delete 1000 documents from the collection",
    async () => {
      await useDb(async (db) => {
        const users = generateUsers(1_000);
        const crs = await db.users.addMany(users);
        const count1 = await db.users.count();
        const { result: ids } = await db.users.map((doc) => doc.id);

        assert(crs.ok);
        assert(count1 === users.length);
        assert(ids.length === users.length);

        await db.users.delete(...ids);

        const count2 = await db.users.count();
        assert(count2 === 0);
      });
    },
  );
});
