// How many expired identities one statement deletes. Small enough that a batch is quick, large
// enough that a day's arrivals take few rounds.
export const PURGE_BATCH_SIZE = 500;
