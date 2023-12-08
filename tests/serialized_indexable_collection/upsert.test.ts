import { assert } from "../deps.ts"
import { mockUser1, mockUser2, mockUser3 } from "../mocks.ts"
import { useDb } from "../utils.ts"

Deno.test("serialized_indexable_collection - upsert", async (t) => {
  await t.step("Should set new doucment entry by id", async () => {
    await useDb(async (db) => {
      const id = "id"

      const cr = await db.is_users.upsert({
        id: id,
        set: mockUser2,
        update: mockUser3,
      })

      assert(cr.ok)

      const doc = await db.is_users.find(id)
      assert(doc !== null)
      assert(doc.value.username === mockUser2.username)
    })
  })

  await t.step("Should set new doucment entry by index", async () => {
    await useDb(async (db) => {
      const cr = await db.is_users.upsert({
        index: ["username", mockUser1.username],
        set: mockUser2,
        update: mockUser3,
      })

      assert(cr.ok)

      const doc = await db.is_users.find(cr.id)
      assert(doc !== null)
      assert(doc.value.username === mockUser2.username)
    })
  })

  await t.step("Should update existing document entry by id", async () => {
    await useDb(async (db) => {
      const id = "id"

      const cr1 = await db.is_users.set(id, mockUser1)
      assert(cr1.ok)

      const cr2 = await db.is_users.upsert({
        id: id,
        set: mockUser2,
        update: mockUser3,
      })

      assert(cr2.ok)

      const doc = await db.is_users.find(id)
      assert(doc !== null)
      assert(doc.value.username === mockUser3.username)
    })
  })

  await t.step("Should update existing document entry by index", async () => {
    await useDb(async (db) => {
      const id = "id"

      const cr1 = await db.is_users.set(id, mockUser1)
      assert(cr1.ok)

      const cr2 = await db.is_users.upsert({
        index: ["username", mockUser1.username],
        set: mockUser2,
        update: mockUser3,
      })

      assert(cr2.ok)

      const doc = await db.is_users.find(id)
      assert(doc !== null)
      assert(doc.value.username === mockUser3.username)
    })
  })
})
