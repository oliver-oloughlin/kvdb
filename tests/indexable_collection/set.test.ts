import { assert } from "@std/assert";
import { mockUser1, mockUser2, mockUserInvalid } from "../mocks.ts";
import { useDb } from "../utils.ts";

Deno.test("indexable_collection - set", async (t) => {
  await t.step("Should set new document entry in collection", async () => {
    await useDb(async (db) => {
      const cr = await db.i_users.set("id", mockUser1);
      assert(cr.ok);

      const doc = await db.i_users.find(cr.id);
      assert(doc !== null);
      assert(doc.value.username === mockUser1.username);
    });
  });

  await t.step(
    "Should not set new document entry in collection with colliding id",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id", mockUser1);
        assert(cr1.ok);

        const cr2 = await db.i_users.set("id", mockUser2);
        assert(!cr2.ok);

        const doc = await db.i_users.find("id");
        assert(doc !== null);
        assert(doc.value.username === mockUser1.username);
      });
    },
  );

  await t.step(
    "Should not set new document entry in collection with primary index",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id1", mockUser1);
        assert(cr1.ok);

        const cr2 = await db.i_users.set("id2", mockUser1);
        assert(!cr2.ok);

        const byPrimary = await db.i_users.findByPrimaryIndex(
          "username",
          mockUser1.username,
        );

        const bySecondary = await db.i_users.findBySecondaryIndex(
          "age",
          mockUser1.age,
        );

        assert(byPrimary?.id === cr1.id);
        assert(bySecondary.result.length === 1);
      });
    },
  );

  await t.step(
    "Should overwrite document in collection with colliding id",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id", mockUser1);
        assert(cr1.ok);

        const cr2 = await db.i_users.set("id", mockUser2, { overwrite: true });
        assert(cr2.ok);

        const doc = await db.i_users.find("id");
        assert(doc !== null);
        assert(doc.value.username === mockUser2.username);
      });
    },
  );

  await t.step(
    "Should not overwrite document in collection with colliding primary index",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id1", mockUser1);
        assert(cr1.ok);

        const cr2 = await db.i_users.set("id2", mockUser1, { overwrite: true });
        assert(!cr2.ok);

        const byPrimary = await db.i_users.findByPrimaryIndex(
          "username",
          mockUser1.username,
        );

        const bySecondary = await db.i_users.findBySecondaryIndex(
          "age",
          mockUser1.age,
        );

        assert(byPrimary?.id === cr1.id);
        assert(bySecondary.result.length === 1);
      });
    },
  );

  await t.step("Should successfully parse and set document", async () => {
    await useDb(async (db) => {
      let assertion = true;
      await db.zi_users.set("id", mockUser1).catch(() => assertion = false);
      assert(assertion);
    });
  });

  await t.step("Should fail to parse and set document", async () => {
    await useDb(async (db) => {
      let assertion = false;
      await db.zi_users.set("id", mockUserInvalid).catch(() =>
        assertion = true
      );
      assert(assertion);
    });
  });
});
