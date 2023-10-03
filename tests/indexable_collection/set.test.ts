import { assert } from "../deps.ts"
import { mockUser1, mockUser2 } from "../mocks.ts"
import { useDb } from "../utils.ts"

Deno.test("indexable_collection - set", async (t) => {
  await t.step("Should set new document entry in collection", async () => {
    await useDb(async (db) => {
      const cr = await db.i_users.set("id", mockUser1)
      assert(cr.ok)

      const doc = await db.i_users.find(cr.id)
      assert(doc !== null)
      assert(doc.value.username === mockUser1.username)
    })
  })

  await t.step(
    "Should not set new document entry in collection with colliding id",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id", mockUser1)
        assert(cr1.ok)

        const cr2 = await db.i_users.set("id", mockUser2)
        assert(!cr2.ok)

        const doc = await db.i_users.find("id")
        assert(doc !== null)
        assert(doc.value.username === mockUser1.username)
      })
    },
  )

  await t.step(
    "Should not set new document entry in collection with primary index",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.set("id1", mockUser1)
        assert(cr1.ok)

        const cr2 = await db.i_users.set("id2", mockUser1)
        assert(!cr2.ok)

        const byPrimary = await db.i_users.findByPrimaryIndex(
          "username",
          mockUser1.username,
        )

        const bySecondary = await db.i_users.findBySecondaryIndex(
          "age",
          mockUser1.age,
        )

        assert(byPrimary?.id === cr1.id)
        assert(bySecondary.result.length === 1)
      })
    },
  )
})
