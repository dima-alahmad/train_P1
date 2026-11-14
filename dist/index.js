"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libr_sys_1 = require("./libr_sys");
const libr_sys_2 = require("./libr_sys");
const libr_sys_3 = require("./libr_sys");
const libr_sys_4 = require("./libr_sys");
const libr_sys_5 = require("./libr_sys");
async function runLibraryDemo() {
    let book1 = new libr_sys_1.Book("from inner thoughts", 12, 312, "Ali Tantawi", 2011, 8);
    let book2 = new libr_sys_1.Book("book2", 12, 312, "author1", 1999, 4);
    let book3 = new libr_sys_1.Book("book2", 12, 312, "author2", 2002, 2);
    let dvd1 = new libr_sys_2.DVD("an dvd", 1, 102);
    console.log(dvd1.getStatus());
    let magazine1 = new libr_sys_3.Magazine("an magazine", 10, 12);
    let library = new libr_sys_4.LibraryService();
    library.addItem(book1);
    library.addItem(book2);
    library.addItem(book3);
    library.addItem(dvd1);
    library.addItem(magazine1);
    let user1 = new libr_sys_5.User("Ahmd", "ahmd@example.com");
    let user2 = new libr_sys_5.User("Amal", "amal@example.com");
    library.registerUser(user1);
    library.registerUser(user2);
    user1.update({ email: "ahmadnewemail@example.com" });
    let loan1 = await library.borrowAsync(user1.id, {
        title: "book2",
        author: "author1",
        release: 4,
    });
    console.log("Loan 1:", loan1);
    let loan2 = await library.borrowAsync(user1.id, "from inner thoughts");
    console.log("Loan 2:", loan2);
    let loan3 = await library.borrowAsync(user2.id, magazine1.id);
    console.log("Loan 3:", loan3);
}
runLibraryDemo();
// enum & never
var OP;
(function (OP) {
    OP["ADD"] = "+";
    OP["SUB"] = "-";
    OP["MUL"] = "*";
    OP["DIV"] = "/";
})(OP || (OP = {}));
function assertNever(value) {
    throw new Error(`Invalid operation: ${String(value)}`);
}
function operation(n1, n2, op) {
    switch (op) {
        case OP.ADD:
            return n1 + n2;
        case OP.SUB:
            return n1 - n2;
        case OP.MUL:
            return n1 * n2;
        case OP.DIV:
            if (n2 === 0) {
                throw new Error("division by zero is not allowed");
            }
            return n1 / n2;
        default:
            return assertNever(op);
    }
}
console.log(operation(10, 5, OP.ADD));
console.log(operation(15, 4, OP.SUB));
