"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = exports.User = exports.Magazine = exports.Book = exports.DVD = void 0;
const defaultLoanDays = 14;
function logAction(method, context) {
    return function (...args) {
        console.log(`[library] ${String(context.name)}`);
        return method.apply(this, args);
    };
}
function errorMessage(error) {
    return error instanceof Error ? error.message : "Unknown library error";
}
function findOrThrow(map, id, entityName) {
    const item = map.get(id);
    if (!item) {
        throw new Error(`${entityName} with ID ${String(id)} was not found`);
    }
    return item;
}
class Borrowable {
    constructor(title, totalCopies) {
        if (totalCopies < 0)
            throw new Error("Total copies cannot be negative");
        this.id = Borrowable.nextId++;
        this.title = title;
        this.totalCopies = totalCopies;
        this.copiesNumber = totalCopies;
    }
    set setTotalCopies(newTotal) {
        if (newTotal < 0)
            throw new Error("Total copies cannot be negative");
        const borrowedCount = this.totalCopies - this.copiesNumber;
        if (newTotal < borrowedCount) {
            throw new Error(`Cannot reduce total copies below currently borrowed count (${borrowedCount})`);
        }
        this.copiesNumber = newTotal - borrowedCount;
        this.totalCopies = newTotal;
    }
    get getTotalCopies() {
        return this.totalCopies;
    }
    get getAvailableCopies() {
        return this.copiesNumber;
    }
    borrow() {
        if (this.copiesNumber === 0) {
            throw new Error(`${this.title} has no available copies`);
        }
        this.copiesNumber--;
        console.log(`${this.title} has been borrowed`);
    }
    returnItem() {
        if (this.copiesNumber >= this.totalCopies) {
            throw new Error(`All copies of ${this.title} are already in the library`);
        }
        this.copiesNumber++;
        console.log(`${this.title} has been returned`);
    }
    getStatus() {
        return this.copiesNumber > 0
            ? `${this.title} is available`
            : `${this.title} is borrowed`;
    }
}
Borrowable.nextId = 1;
class DVD extends Borrowable {
    constructor(title, totalCopies, minutes) {
        super(title, totalCopies);
        this.minutes = minutes;
    }
}
exports.DVD = DVD;
class Book extends Borrowable {
    constructor(title, totalCopies, pages, author, yearOfPublication, release) {
        super(title, totalCopies);
        this.pages = pages;
        this.author = author;
        this.yearOfPublication = yearOfPublication;
        this.release = release;
    }
}
exports.Book = Book;
class Magazine extends Borrowable {
    constructor(title, totalCopies, pages) {
        super(title, totalCopies);
        this.pages = pages;
    }
}
exports.Magazine = Magazine;
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.borrowed = new Set();
        this.id = User.nextId++;
    }
    update(changes) {
        if (changes.name !== undefined)
            this.name = changes.name;
        if (changes.email !== undefined)
            this.email = changes.email;
    }
    get contactEmail() { return this.email; }
    addLoan(id) { this.borrowed.add(id); }
    removeLoan(id) { this.borrowed.delete(id); }
    hasLoan(id) { return this.borrowed.has(id); }
}
exports.User = User;
User.nextId = 1;
let LibraryService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _borrowAsync_decorators;
    let _returnAsync_decorators;
    return _a = class LibraryService {
            constructor(loanDays = defaultLoanDays) {
                this.loanDays = (__runInitializers(this, _instanceExtraInitializers), loanDays);
                this.items = new Map();
                this.users = new Map();
                this.loans = [];
            }
            addItem(item) {
                this.items.set(item.id, item);
            }
            registerUser(user) {
                this.users.set(user.id, user);
            }
            resolveMedia(target) {
                if (typeof target === "number") {
                    return findOrThrow(this.items, target, "Item");
                }
                const criteria = typeof target === "string" ? { title: target } : target;
                const normalizedTitle = criteria.title.trim().toLowerCase();
                let matches = Array.from(this.items.values()).filter((item) => item.title.trim().toLowerCase() === normalizedTitle);
                if (criteria.author) {
                    const normalizedAuthor = criteria.author.trim().toLowerCase();
                    matches = matches.filter((item) => item instanceof Book && item.author.trim().toLowerCase() === normalizedAuthor);
                }
                if (criteria.release !== undefined) {
                    matches = matches.filter((item) => item instanceof Book && item.release === criteria.release);
                }
                if (matches.length === 0) {
                    throw new Error(`No matching item found for "${criteria.title}"`);
                }
                if (matches.length > 1) {
                    const options = matches
                        .map((item) => {
                        const availability = `(Available: ${item.getAvailableCopies}/${item.getTotalCopies})`;
                        if (item instanceof Book) {
                            const releaseInfo = item.release !== undefined ? ` (Release: ${item.release})` : "";
                            return `[ID: ${item.id}] "${item.title}" by ${item.author}${releaseInfo} ${availability}`;
                        }
                        return `[ID: ${item.id}] "${item.title}" ${availability}`;
                    })
                        .join(" | ");
                    throw new Error(`Multiple items found for "${criteria.title}". Specify author/release or use ID: ${options}`);
                }
                return matches[0];
            }
            async borrowAsync(userId, mediaOrQuery) {
                try {
                    const user = findOrThrow(this.users, userId, "User");
                    const item = this.resolveMedia(mediaOrQuery);
                    if (user.hasLoan(item.id)) {
                        throw new Error("User already borrowed a copy of this item");
                    }
                    item.borrow();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + this.loanDays);
                    const loan = [item.id, userId, dueDate];
                    user.addLoan(item.id);
                    this.loans.push(loan);
                    await Promise.resolve();
                    return loan;
                }
                catch (error) {
                    throw new Error(`Borrow failed: ${errorMessage(error)}`);
                }
            }
            async returnAsync(userId, mediaOrQuery) {
                try {
                    const user = findOrThrow(this.users, userId, "User");
                    const item = this.resolveMedia(mediaOrQuery);
                    if (!user.hasLoan(item.id)) {
                        throw new Error("This user does not have this item");
                    }
                    item.returnItem();
                    user.removeLoan(item.id);
                    const index = this.loans.findIndex(([loanMediaId, loanUserId]) => loanMediaId === item.id && loanUserId === userId);
                    if (index >= 0)
                        this.loans.splice(index, 1);
                    await Promise.resolve();
                }
                catch (error) {
                    throw new Error(`Return failed: ${errorMessage(error)}`);
                }
            }
            get activeLoans() {
                return this.loans;
            }
            getBookPreviews() {
                return Array.from(this.items.values())
                    .filter((item) => item instanceof Book);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _borrowAsync_decorators = [logAction];
            _returnAsync_decorators = [logAction];
            __esDecorate(_a, null, _borrowAsync_decorators, { kind: "method", name: "borrowAsync", static: false, private: false, access: { has: obj => "borrowAsync" in obj, get: obj => obj.borrowAsync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _returnAsync_decorators, { kind: "method", name: "returnAsync", static: false, private: false, access: { has: obj => "returnAsync" in obj, get: obj => obj.returnAsync }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LibraryService = LibraryService;
