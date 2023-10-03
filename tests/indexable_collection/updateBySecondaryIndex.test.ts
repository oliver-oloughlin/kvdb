import { assert } from "../deps.ts"
import { mockUser1, mockUser2 } from "../mocks.ts"
import { useDb } from "../utils.ts"

Deno.test("indexable_collection - updateBySecondaryIndex", async (t) => {
  await t.step(
    "Should partially update 1000 documents by secondary index, using shallow merge",
    async () => {
      await useDb(async (db) => {
        const cr1 = await db.i_users.add(mockUser1)
        const cr2 = await db.i_users.add(mockUser2)
        assert(cr1.ok && cr2.ok)

        const ids = [cr1.id, cr2.id]
        const versionstamps = [cr1.versionstamp, cr2.versionstamp]

        const updateData = {
          address: {
            country: "Ireland",
            city: "Dublin",
            houseNr: null,
          },
        }

        const { result } = await db.i_users.updateBySecondaryIndex(
          "age",
          mockUser1.age,
          updateData,
        )

        assert(
          result.every((cr) =>
            cr.ok && ids.includes(cr.id) &&
            !versionstamps.includes(cr.versionstamp)
          ),
        )

        await db.i_users.forEach((doc) => {
          assert(doc.value.address.country === updateData.address.country)
          assert(doc.value.address.city === updateData.address.city)
          assert(doc.value.address.houseNr === updateData.address.houseNr)
          assert(typeof doc.value.address.street === "undefined")
        })
      })
    },
  )
})
