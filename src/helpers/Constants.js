function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("map_size", 5);
define("block_padding", 15);
define("block_round", 10);

//1-based (index 0 is dummy)
define("player_color", ["#eee6db", "#eee6db", "#ede1c8", "#eeb27d", "#f29767", "#f37c62", "#f26140", "#ebce74", "#edcb67", "#ebc85b", "#e7c359", "#e9be4f"]);
define("player_text_color", ["#796c65", "#796c65", "#796c65", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
define("ai_color", ["#D5D8DC", "#D5D8DC", "#ABB2B9", "#808B96", "#566573", "#2C3E50", "#273746", "#212F3D", "#1C2833", "#17202A", "#060E18"]);
define("ai_text_color", ["#796c65", "#796c65", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);