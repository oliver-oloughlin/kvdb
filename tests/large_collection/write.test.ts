import { assert } from "../deps.ts"
import { mockUser1, mockUser2 } from "../mocks.ts"
import { useDb } from "../utils.ts"

Deno.test("large_collection - write", async (t) => {
  await t.step("Should write new document entry to collection", async () => {
    await useDb(async (db) => {
      const cr = await db.l_users.write("id", mockUser1)
      assert(cr.ok)

      const doc = await db.l_users.find(cr.id)
      assert(doc !== null)
      assert(doc.value.username === mockUser1.username)
    })
  })

  await t.step(
    "Should overwrite document entry in collection with colliding id",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.l_users.write("id", mockUser1)
        assert(cr1.ok)

        const cr2 = await db.l_users.write("id", mockUser2)
        assert(cr2.ok)

        const doc = await db.l_users.find("id")
        assert(doc !== null)
        assert(doc.value.username === mockUser2.username)
      })
    },
  )
})
