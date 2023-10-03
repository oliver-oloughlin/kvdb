import { CommitResult } from "../../mod.ts"
import { assert } from "../deps.ts"
import { User } from "../models.ts"
import { generateUsers, useDb } from "../utils.ts"

Deno.test("indexable_collection - updateMany", async (t) => {
  await t.step(
    "Should partially update 1000 documents using shallow merge",
    async () => {
      await useDb(async (db) => {
        const users = generateUsers(1_000)
        const crs = await db.i_users.addMany(users)
        assert(crs.every((cr) => cr.ok))

        const okCrs = crs.filter((cr) => cr.ok) as CommitResult<User>[]
        const ids = okCrs.map((cr) => cr.id)
        const versionstamps = okCrs.map((cr) => cr.versionstamp)

        const updateData = {
          address: {
            country: "Ireland",
            city: "Dublin",
            houseNr: null,
          },
        }

        const { result } = await db.i_users.updateMany(updateData)
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
