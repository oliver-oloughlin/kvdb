import type { Collection } from "./collection.ts"
import type { AtomicBuilder } from "./atomic_builder.ts"
import type { LargeCollection } from "./large_collection.ts"
import type { Document } from "./Document.ts"

// Atomic Builder Types
export type CollectionSelector<
  T1 extends Schema<SchemaDefinition>,
  T2 extends KvValue,
> = (schema: AtomicSchema<T1>) => Collection<T2, CollectionOptions<T2>>

export type AtomicSchema<T extends Schema<SchemaDefinition>> = {
  [
    K in KeysOfThatDontExtend<
      T,
      LargeCollection<LargeKvValue, LargeCollectionOptions<LargeKvValue>>
    >
  ]: T[K] extends Schema<SchemaDefinition> ? AtomicSchema<T[K]> : T[K]
}

export type PrepareDeleteFn = (kv: Deno.Kv) => Promise<PreparedIndexDelete>

export type PreparedIndexDelete = {
  id: KvId
  data: Model
}

export type Operations = {
  atomic: Deno.AtomicOperation
  prepareDeleteFns: PrepareDeleteFn[]
  indexDeleteCollectionKeys: KvKey[]
  indexAddCollectionKeys: KvKey[]
}

export type AtomicCheck<T extends KvValue> = {
  id: Document<T>["id"]
  versionstamp: Document<T>["versionstamp"]
}

export type AtomicMutation<T extends KvValue> =
  & {
    id: KvId
  }
  & (
    | {
      type: "set"
      value: T
      expireIn?: number
    }
    | {
      type: "sum"
      value: T extends Deno.KvU64 ? T : never
    }
    | {
      type: "min"
      value: T extends Deno.KvU64 ? T : never
    }
    | {
      type: "max"
      value: T extends Deno.KvU64 ? T : never
    }
    | {
      type: "delete"
    }
  )

export type AtomicSetOptions = NonNullable<
  Parameters<ReturnType<Deno.Kv["atomic"]>["set"]>["2"]
>

// Collection Types
export type IdGenerator<T extends KvValue> = (data: T) => KvId

export type CollectionOptions<T extends KvValue> = {
  /**
   * Set a custom function for automatic id generation.
   */
  idGenerator?: IdGenerator<T>
}

export type CollectionKeys = {
  baseKey: KvKey
  idKey: KvKey
}

export type SetOptions = NonNullable<Parameters<Deno.Kv["set"]>["2"]> & {
  retry?: number
}

export type ListOptions<T extends KvValue> = Deno.KvListOptions & {
  /**
   * Filter documents based on predicate.
   *
   * @param doc - Document
   * @returns true or false
   */
  filter?: (doc: Document<T>) => boolean

  startId?: KvId

  endId?: KvId
}

export type CountOptions<T extends KvValue> =
  & CountAllOptions
  & Pick<ListOptions<T>, "filter">

export type FindOptions = NonNullable<Parameters<Deno.Kv["get"]>[1]>

export type FindManyOptions = NonNullable<Parameters<Deno.Kv["getMany"]>[1]>

export type UpdateManyOptions<T extends KvValue> = ListOptions<T> & SetOptions

export type CommitResult<T1 extends KvValue> = {
  ok: true
  versionstamp: Document<T1>["versionstamp"]
  id: KvId
}

// Indexable Collection Types
export type IndexableCollectionOptions<T extends Model> =
  & CollectionOptions<T>
  & {
    indices: IndexRecord<T>
  }

export type IndexableCollectionKeys = CollectionKeys & {
  primaryIndexKey: KvKey
  secondaryIndexKey: KvKey
}

export type CheckKeyOf<K, T> = K extends keyof T ? T[K] : never

export type IndexType = "primary" | "secondary"

export type KeysOfThatExtend<T1, T2> = keyof {
  [K in keyof T1 as T1[K] extends T2 ? K : never]: unknown
}

export type KeysOfThatDontExtend<T1, T2> = keyof {
  [K in keyof T1 as T1[K] extends T2 ? never : K]: unknown
}

export type IndexRecord<T extends Model> = {
  [key in KeysOfThatExtend<T, KvId>]?: IndexType
}

export type PrimaryIndexKeys<T1 extends Model, T2 extends IndexRecord<T1>> =
  KeysOfThatExtend<T2, "primary">

export type SecondaryIndexKeys<T1 extends Model, T2 extends IndexRecord<T1>> =
  KeysOfThatExtend<T2, "secondary">

export type IndexDataEntry<T extends Model> = Omit<T, "__id__"> & {
  __id__: KvId
}

// Large Collection Types
export type LargeCollectionOptions<T extends LargeKvValue> = CollectionOptions<
  T
>

export type LargeCollectionKeys = CollectionKeys & {
  segmentKey: KvKey
}

export type LargeDocumentEntry = {
  ids: KvId[]
}

// DB Types
export type CollectionBuilderFn = (
  kv: Deno.Kv,
  key: KvKey,
) => Collection<KvValue, CollectionOptions<KvValue>>

export type SchemaDefinition = {
  [key: string]: SchemaDefinition | CollectionBuilderFn
}

export type Schema<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends SchemaDefinition ? Schema<T[K]>
    : T[K] extends CollectionBuilderFn ? ReturnType<T[K]>
    : never
}

export type DB<T extends SchemaDefinition> = Schema<T> & {
  /**
   * Initiates an atomic operation.
   * Takes a selector function as argument which is used to select an initial collection.
   *
   * @example
   * ```ts
   * db.atomic(schema => schema.users)
   * ```
   *
   * @param selector - Collection selector function.
   * @returns A new AtomicBuilder instance.
   */
  atomic<
    const TValue extends KvValue,
  >(
    selector: CollectionSelector<Schema<T>, TValue>,
  ): AtomicBuilder<Schema<T>, TValue>

  /**
   * Count all document entries in the KV store.
   *
   * @example
   * ```ts
   * // Returns the total number of documents in the KV store across all collections
   * const count = await db.countAll()
   * ```
   *
   * @param options - Count all options, optional.
   * @returns Promise resolving to a number representing the total count of documents in the KV store.
   */
  countAll(options?: CountAllOptions): Promise<number>

  /**
   * Delete all document entries in the KV store.
   *
   * @example
   * ```ts
   * // Deletes all documents across all collections
   * await db.deleteAll()
   * ```
   * @param options - Delete all options, optional.
   * @returns Promise resolving to void.
   */
  deleteAll(options?: DeleteAllOptions): Promise<void>

  /**
   * Add data to the database queue to be delivered to the queue listener
   * via ``db.listenQueue()``. The data will only be received by queue
   * listeners on the database queue. The method takes an optional options
   * argument that can be used to set a delivery delay.
   *
   * @example
   * ```ts
   * // Immediate delivery
   * await db.enqueue("some data")
   *
   * // Delay of 2 seconds before delivery
   * await db.enqueue("some data", {
   *   delay: 2_000
   * })
   * ```
   *
   * @param data - Data to be added to the database queue.
   * @param options - Enqueue options, optional.
   */
  enqueue(data: KvValue, options?: EnqueueOptions): Promise<EnqueueResult>

  /**
   * Listen for data from the database queue that was enqueued with ``db.enqueue()``. Will only receive data that was enqueued to the database queue. Takes a handler function as argument.
   *
   * @example
   * ```ts
   * // Prints the data to console when recevied
   * db.listenQueue((data) => console.log(data))
   *
   * // Sends post request when data is received
   * db.listenQueue(async (data) => {
   *   const dataBody = JSON.stringify(data)
   *
   *   const res = await fetch("...", {
   *     method: "POST",
   *     body: dataBody
   *   })
   *
   *   console.log("POSTED:", dataBody, res.ok)
   * })
   * ```
   *
   * @param handler - Message handler function.
   */
  listenQueue<T extends KvValue = KvValue>(
    handler: QueueMessageHandler<T>,
  ): ListenQueueResult

  /**
   * Find an undelivered document entry by id from the database queue.
   *
   * @example
   * ```ts
   * const doc1 = await db.findUndelivered("undelivered_id")
   *
   * const doc2 = await db.findUndelivered("undelivered_id", {
   *   consistency: "eventual", // "strong" by default
   * })
   * ```
   *
   * @param id - Document id.
   * @param options - Find options, optional.
   * @returns Document if found, null if not.
   */
  findUndelivered<T extends KvValue = KvValue>(
    id: KvId,
    options?: FindOptions,
  ): Promise<Document<T> | null>
}

export type CountAllOptions = Pick<Deno.KvListOptions, "consistency">

export type DeleteAllOptions = Pick<Deno.KvListOptions, "consistency">

// Queue Types
export type QueueMessage<T extends KvValue> = {
  collectionKey: KvKey | null
  data: T
}

export type ParsedQueueMessage<T extends KvValue> = {
  ok: true
  msg: QueueMessage<T>
} | {
  ok: false
}

export type DenoKvEnqueueOptions = NonNullable<
  Parameters<Deno.Kv["enqueue"]>[1]
>

export type EnqueueOptions =
  & Omit<
    DenoKvEnqueueOptions,
    "keysIfUndelivered"
  >
  & {
    idsIfUndelivered?: KvId[]
  }

export type EnqueueResult = Awaited<ReturnType<Deno.Kv["enqueue"]>>

export type ListenQueueResult = ReturnType<Deno.Kv["listenQueue"]>

export type QueueMessageHandler<T extends KvValue> = (
  data: T,
) => unknown | Promise<unknown>

export type PreparedEnqueue<T extends KvValue> = {
  msg: QueueMessage<T>
  options: DenoKvEnqueueOptions
}

// KV Types
export type UpdateData<T extends KvValue> = T extends KvObject ? Partial<T> : T

export type FlatDocumentData<T extends KvValue> =
  & Omit<DocumentData<T>, "value">
  & (
    T extends Model ? T : {
      readonly value: T
    }
  )

export type DocumentData<T extends KvValue> = {
  readonly id: KvId
  readonly versionstamp: KvVersionstamp<T>
  readonly value: T
}

export type KvVersionstamp<T extends KvValue> = Deno.KvEntry<T>["versionstamp"]

export type KvKey = [Deno.KvKeyPart, ...Deno.KvKey]

export type KvId = Deno.KvKeyPart

export type Model = KvObject

export type KvObject = {
  [K: string | number]: KvValue
}

export type KvArray = KvValue[]

export type KvValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | bigint
  | Deno.KvU64
  | KvObject
  | KvArray
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigUint64Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array
  | ArrayBuffer
  | Date
  | Set<KvValue>
  | Map<KvValue, KvValue>
  | RegExp
  | DataView
  | Error

export type LargeKvObject = {
  [K: string | number]: LargeKvValue | number | boolean | undefined | null
}

export type LargeKvArray =
  (LargeKvValue | number | boolean | undefined | null)[]

export type LargeKvValue =
  | string
  | LargeKvObject
  | LargeKvArray
