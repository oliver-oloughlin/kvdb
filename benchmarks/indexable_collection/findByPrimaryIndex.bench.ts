import { mockUser1 } from "../../tests/mocks.ts";
import { useDb } from "../../tests/utils.ts";

Deno.bench("indexable_collection - findByPrimaryIndex", async (b) => {
  await useDb(async (db) => {
    await db.i_users.add(mockUser1);

    b.start();
    await db.i_users.findByPrimaryIndex("username", mockUser1.username);
    b.end();
  });
});
