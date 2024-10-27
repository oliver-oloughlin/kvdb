import type { UpdateStrategy } from "./types.ts";

// Key prefixes
export const KVDEX_KEY_PREFIX = "__kvdex__";

export const ID_KEY_PREFIX = "__id__";

export const PRIMARY_INDEX_KEY_PREFIX = "__index_primary__";

export const SECONDARY_INDEX_KEY_PREFIX = "__index_secondary__";

export const SEGMENT_KEY_PREFIX = "__segment__";

export const UNDELIVERED_KEY_PREFIX = "__undelivered__";

export const HISTORY_KEY_PREFIX = "__history__";

// Fixed limits
export const ATOMIC_OPERATION_MUTATION_LIMIT = 1_000;

export const ATOMIC_OPERATION_SIZE_LIMIT = 800;

export const ATOMIC_OPERATION_KEY_SIZE_LIMIT = 80;

export const ATOMIC_OPERTION_CHECK_LIMIT = 10;

export const GET_MANY_KEY_LIMIT = 10;

export const UINT8ARRAY_LENGTH_LIMIT = 65_536;

// Defaults
export const DEFAULT_INTERVAL_RETRY = 10;

export const DEFAULT_LOOP_RETRY = 10;

export const DEFAULT_UPDATE_STRATEGY: UpdateStrategy = "merge";

// Misc
export const COMPRESSION_QUALITY_LEVEL = 1;

export const MIN_INTERVAL_START_DELAY = 1_000;

export const MIN_LOOP_START_DELAY = 1_000;
