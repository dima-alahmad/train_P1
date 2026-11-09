"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libr_sys_1 = require("./libr_sys");
const libr_sys_2 = require("./libr_sys");
const libr_sys_3 = require("./libr_sys");
let book1 = new libr_sys_1.Book("From inner thoughts", 12, 312, "Ali Tantawi", 8, 2011);
console.log(book1.getAvailableCopies);
book1.borrow();
console.log(book1.getStatus());
book1.returnItem();
let dvd1 = new libr_sys_2.DVD("an dvd", 1, 102);
console.log(dvd1.getAvailableCopies);
dvd1.borrow();
console.log(dvd1.getStatus());
dvd1.setTotalCopies = 6;
dvd1.returnItem();
console.log(dvd1.getTotalCopies);
let magazine1 = new libr_sys_3.Magazine("an magazine", 10, 12);
magazine1.borrow();
console.log(magazine1.getAvailableCopies);
magazine1.returnItem();
// enum & GENERIC
function operation(n1, n2, op) {
    if (op != "+" && op != "-" && op != "*" && op != "/") {
        console.log("invalid operation");
        return 0;
    }
    let OP;
    (function (OP) {
        OP["ADD"] = "+";
        OP["SUB"] = "-";
        OP["MUL"] = "*";
        OP["DIV"] = "/";
    })(OP || (OP = {}));
    switch (op) {
        case OP.ADD: return n1 + n2;
        case OP.SUB: return n1 - n2;
        case OP.MUL: return n1 * n2;
        case OP.DIV: return n1 / n2;
    }
    return 0;
}
console.log(operation(1, 2, "+"));
console.log(operation(5, 1, "-"));
console.log(operation(3, 4, "*"));
console.log(operation(12, 3, "/"));
