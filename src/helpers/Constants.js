function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("map_size", 5);
define("block_padding", 15);
define("block_round", 10);

