String.prototype.rem = function (n) {
    return this.slice(0, n) + this.slice(n + 1);
}
String.prototype.copy = function() {
    return (' ' + this).slice(1);
}
