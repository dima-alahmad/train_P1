"use strict";
//namespace Library {
//interface Borrowable{
// readonly id: number;
//   isBorrowed: boolean;
//   borrow(): void;
//   returnItem(): void;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magazine = exports.Book = exports.DVD = void 0;
//}
class Borrowable {
    constructor(title, totalCopies) {
        this.id = Borrowable.nextid++;
        this.totalCopies = totalCopies;
        this.copiesNumber = totalCopies;
        this.title = title;
    }
    set setTotalCopies(totalcopies) {
        this.copiesNumber += totalcopies - this.totalCopies;
        this.totalCopies = totalcopies;
    }
    get getTotalCopies() {
        return this.totalCopies;
    }
    get getAvailableCopies() {
        return this.copiesNumber;
    }
    borrow() {
        if (this.copiesNumber == 0) {
            console.log(`${this.title} is already borrowed`);
            return;
        }
        this.copiesNumber--;
        console.log(`${this.title} has been borrowed`);
    }
    returnItem() {
        this.copiesNumber++;
        console.log(`${this.title} has been returned`);
    }
    getStatus() {
        if (this.copiesNumber > 0)
            return `${this.title} is available`;
        else
            return `${this.title} is borrowed`;
    }
}
Borrowable.nextid = 1;
class DVD extends Borrowable {
    constructor(title, totalCopies, minutes) {
        super(title, totalCopies);
        this.minutes = minutes;
    }
    borrow() { super.borrow(); }
    returnItem() { super.returnItem(); }
    getStatus() { return super.getStatus(); }
}
exports.DVD = DVD;
class Book extends Borrowable {
    constructor(title, totalCopies, pages, author, yearOfPublication, realease) {
        super(title, totalCopies);
        this.pages = pages;
        this.author = author;
        this.yearOfPublication = yearOfPublication;
        this.realease = realease;
    }
    borrow() { super.borrow(); }
    returnItem() { super.returnItem(); }
    getStatus() { return super.getStatus(); }
}
exports.Book = Book;
class Magazine extends Borrowable {
    constructor(title, totalCopies, pages) {
        super(title, totalCopies);
        this.pages = pages;
    }
    borrow() { super.borrow(); }
    returnItem() { super.returnItem(); }
    getStatus() { return super.getStatus(); }
}
exports.Magazine = Magazine;
//}
