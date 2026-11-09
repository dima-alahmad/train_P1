import { Book } from "./libr_sys";
import { DVD } from "./libr_sys";
import { Magazine } from "./libr_sys";   

let book1: Book = new Book("From inner thoughts", 12, 312, "Ali Tantawi", 8, 2011);
console.log(book1.getAvailableCopies);
book1.borrow();
console.log(book1.getStatus());
book1.returnItem();

let dvd1: DVD = new DVD("an dvd", 1, 102);
console.log(dvd1.getAvailableCopies);
dvd1.borrow();
console.log(dvd1.getStatus());
dvd1.setTotalCopies=6;
dvd1.returnItem();
console.log(dvd1.getTotalCopies);

let magazine1: Magazine = new Magazine("an magazine", 10, 12);
magazine1.borrow();
console.log(magazine1.getAvailableCopies);
magazine1.returnItem();
// enum & GENERIC






function operation<R>(n1: number, n2: number, op:R): number {
    if(op!= "+" && op!="-" && op!="*" && op!="/"){
        console.log("invalid operation");
        return 0;
    }
    enum OP{
    ADD = "+",
    SUB = "-",
    MUL = "*",
    DIV = "/"
}
    switch(op){
        case OP.ADD : return n1+n2;
        case OP.SUB: return n1-n2;
        case OP.MUL: return n1*n2;
        case OP.DIV: return n1/n2;
    }
    return -1;
}
console.log(operation(1, 2 ,"+"));
console.log(operation(5, 1 ,"-"));
console.log(operation(3,4,"*"));
console.log(operation(12, 3,"/"));