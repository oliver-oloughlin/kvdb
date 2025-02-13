import { collection, kvdex, model } from "../../mod.ts";
import { useKv } from "../../tests/utils.ts";

Deno.bench("db - kvdex (10 collections)", async (b) => {
  await useKv((kv) => {
    b.start();

    kvdex({
      kv,
      schema: {
        1: collection(model<string>()),
        2: collection(model<string>()),
        3: collection(model<string>()),
        4: collection(model<string>()),
        5: collection(model<string>()),
        6: collection(model<string>()),
        7: collection(model<string>()),
        8: collection(model<string>()),
        9: collection(model<string>()),
        10: collection(model<string>()),
      },
    });

    b.end();
  });
});

Deno.bench("db - kvdex (100 collections)", async (b) => {
  await useKv((kv) => {
    b.start();

    kvdex({
      kv,
      schema: {
        1: collection(model<string>()),
        2: collection(model<string>()),
        3: collection(model<string>()),
        4: collection(model<string>()),
        5: collection(model<string>()),
        6: collection(model<string>()),
        7: collection(model<string>()),
        8: collection(model<string>()),
        9: collection(model<string>()),
        10: collection(model<string>()),
        11: collection(model<string>()),
        12: collection(model<string>()),
        13: collection(model<string>()),
        14: collection(model<string>()),
        15: collection(model<string>()),
        16: collection(model<string>()),
        17: collection(model<string>()),
        18: collection(model<string>()),
        19: collection(model<string>()),
        20: collection(model<string>()),
        21: collection(model<string>()),
        22: collection(model<string>()),
        23: collection(model<string>()),
        24: collection(model<string>()),
        25: collection(model<string>()),
        26: collection(model<string>()),
        27: collection(model<string>()),
        28: collection(model<string>()),
        29: collection(model<string>()),
        30: collection(model<string>()),
        31: collection(model<string>()),
        32: collection(model<string>()),
        33: collection(model<string>()),
        34: collection(model<string>()),
        35: collection(model<string>()),
        36: collection(model<string>()),
        37: collection(model<string>()),
        38: collection(model<string>()),
        39: collection(model<string>()),
        40: collection(model<string>()),
        41: collection(model<string>()),
        42: collection(model<string>()),
        43: collection(model<string>()),
        44: collection(model<string>()),
        45: collection(model<string>()),
        46: collection(model<string>()),
        47: collection(model<string>()),
        48: collection(model<string>()),
        49: collection(model<string>()),
        50: collection(model<string>()),
        51: collection(model<string>()),
        52: collection(model<string>()),
        53: collection(model<string>()),
        54: collection(model<string>()),
        55: collection(model<string>()),
        56: collection(model<string>()),
        57: collection(model<string>()),
        58: collection(model<string>()),
        59: collection(model<string>()),
        60: collection(model<string>()),
        61: collection(model<string>()),
        62: collection(model<string>()),
        63: collection(model<string>()),
        64: collection(model<string>()),
        65: collection(model<string>()),
        66: collection(model<string>()),
        67: collection(model<string>()),
        68: collection(model<string>()),
        69: collection(model<string>()),
        70: collection(model<string>()),
        71: collection(model<string>()),
        72: collection(model<string>()),
        73: collection(model<string>()),
        74: collection(model<string>()),
        75: collection(model<string>()),
        76: collection(model<string>()),
        77: collection(model<string>()),
        78: collection(model<string>()),
        79: collection(model<string>()),
        80: collection(model<string>()),
        81: collection(model<string>()),
        82: collection(model<string>()),
        83: collection(model<string>()),
        84: collection(model<string>()),
        85: collection(model<string>()),
        86: collection(model<string>()),
        87: collection(model<string>()),
        88: collection(model<string>()),
        89: collection(model<string>()),
        90: collection(model<string>()),
        91: collection(model<string>()),
        92: collection(model<string>()),
        93: collection(model<string>()),
        94: collection(model<string>()),
        95: collection(model<string>()),
        96: collection(model<string>()),
        97: collection(model<string>()),
        98: collection(model<string>()),
        99: collection(model<string>()),
        100: collection(model<string>()),
      },
    });

    b.end();
  });
});
