//namespace Library {
//interface Borrowable{
   // readonly id: number;
 //   isBorrowed: boolean;
 //   borrow(): void;
 //   returnItem(): void;

//}

abstract class Borrowable {
    private static nextid=1;
    readonly id: number;
    private totalCopies: number;
    private copiesNumber:number;
   
    protected title: string;
    constructor(title: string,totalCopies: number) {
        this.id = Borrowable.nextid++;
        this.totalCopies = totalCopies;
        this.copiesNumber = totalCopies;
        this.title = title;
       
    }
    set setTotalCopies(totalcopies: number) {
        this.copiesNumber += totalcopies - this.totalCopies;
        if(this.copiesNumber < 0) {
        this.copiesNumber=0;
        }
        this.totalCopies= totalcopies;

    }
    get getTotalCopies(): number {
        return this.totalCopies;
    }
    get getAvailableCopies(): number {
        return this.copiesNumber;
    }
    borrow(): void {
        if(this.copiesNumber == 0){
            console.log(`${this.title} is already borrowed`);
            return;
        }
        this.copiesNumber--;

        console.log(`${this.title} has been borrowed`);    

        
    }
    returnItem(): void {
       
        this.copiesNumber++;
       
        console.log(`${this.title} has been returned`);

    }
    getStatus(): string {
        if(this.copiesNumber>0)
        return `${this.title} is available`;
        else  return `${this.title} is borrowed`;
    }

}
export class DVD extends Borrowable{
   minutes: number;
    constructor(title: string,totalCopies:number, minutes: number) {
        super(title,totalCopies);
        this.minutes = minutes;
}
override borrow(): void {super.borrow();}
override returnItem(): void {super.returnItem();}
override getStatus(): string {return super.getStatus();    }
}

export class Book extends Borrowable{
   pages: number;
   author: string;
   yearOfPublication: number|string;
   realease:number;
    constructor(title: string,totalCopies:number, pages: number,author: string, yearOfPublication: number|string, realease: number) {
        super(title, totalCopies);
        this.pages = pages;
        this.author = author;
        this.yearOfPublication = yearOfPublication;
        this.realease = realease;
}
override borrow(): void {super.borrow();}
override returnItem(): void {super.returnItem();}
override getStatus(): string {return super.getStatus();    }
}

export class Magazine extends Borrowable{
   pages: number;
   
    constructor(title: string, totalCopies:number, pages: number) {
        super(title, totalCopies);
        this.pages = pages;
}
override borrow(): void {super.borrow();}
override returnItem(): void {super.returnItem();}
override getStatus(): string {return super.getStatus();    }
}

//}