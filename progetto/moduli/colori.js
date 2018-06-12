Black = "\x1b[30m"; Red = "\x1b[31m"; Green = "\x1b[32m"; Yellow = "\x1b[33m"; Blue = "\x1b[34m"; Magenta = "\x1b[35m"; Cyan = "\x1b[36m"; White = "\x1b[37m";

/* Funzioni per il log colorato */
exports.green = function green(str) {
    console.log(Green + str + Red);
}
exports.red = function red(str) {
    console.log(Red + str);
}
exports.white = function white(str) {
    console.log(White + str + Red);
}
