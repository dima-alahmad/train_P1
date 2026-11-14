export type MediaId = number;
export type UserId = number;
export type LoanRecord = [MediaId, UserId, Date];
export type UserChanges = {[K in "name" | "email"]?: string;};
export type BookPreview = Omit<Book, "borrow" | "returnItem">;

export interface SearchCriteria {
    title: string;
    author?: string;
    release?: number;
}

const defaultLoanDays = 14;
type LoanPolicy = typeof defaultLoanDays;

function logAction<This, Args extends unknown[], Result>(
    method: (this: This, ...args: Args) => Result,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Result>,
): (this: This, ...args: Args) => Result {
    return function (this: This, ...args: Args): Result {
        console.log(`[library] ${String(context.name)}`);
        return method.apply(this, args);
    };
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown library error";
}

function findOrThrow<K, V>(map: Map<K, V>, id: K, entityName: string): V {
    const item = map.get(id);
    if (!item) {
        throw new Error(`${entityName} with ID ${String(id)} was not found`);
    }
    return item;
}

abstract class Borrowable {
    private static nextId = 1;
    readonly id: number;
    readonly title: string;
    private totalCopies: number;
    private copiesNumber: number;

    constructor(title: string, totalCopies: number) {
        if (totalCopies < 0) throw new Error("Total copies cannot be negative");
        this.id = Borrowable.nextId++;
        this.title = title;
        this.totalCopies = totalCopies;
        this.copiesNumber = totalCopies;
    }

  set setTotalCopies(newTotal: number) {
        if (newTotal < 0) throw new Error("Total copies cannot be negative");
        const borrowedCount = this.totalCopies - this.copiesNumber;
        if (newTotal < borrowedCount) {
            throw new Error(`Cannot reduce total copies below currently borrowed count (${borrowedCount})`);
        }
        this.copiesNumber = newTotal - borrowedCount;
        this.totalCopies = newTotal;
    }

    get getTotalCopies(): number {
        return this.totalCopies;
    }

    get getAvailableCopies(): number {
        return this.copiesNumber;
    }

    borrow(): void {
        if (this.copiesNumber === 0) {
            throw new Error(`${this.title} has no available copies`);
        }
        this.copiesNumber--;
        console.log(`${this.title} has been borrowed`);
    }

    returnItem(): void {
        if (this.copiesNumber >= this.totalCopies) {
            throw new Error(`All copies of ${this.title} are already in the library`);
        }
        this.copiesNumber++;
        console.log(`${this.title} has been returned`);
    }

    getStatus(): string {
        return this.copiesNumber > 0
            ? `${this.title} is available`
            : `${this.title} is borrowed`;
    }
}

export class DVD extends Borrowable {
    constructor(title: string, totalCopies: number, public minutes: number) {
        super(title, totalCopies);
    }
}

export class Book extends Borrowable implements SearchCriteria  {
    constructor(
        title: string,
        totalCopies: number,
        public pages: number,
        public author: string,
        public yearOfPublication: number | string,
        public release?: number,
    ) {
        super(title, totalCopies);
    }
}

export class Magazine extends Borrowable {
    constructor(title: string, totalCopies: number, public pages: number) {
        super(title, totalCopies);
    }
}

export class User {
    private static nextId = 1;
    public readonly id: UserId;
    private readonly borrowed = new Set<MediaId>();

   constructor(
    public name: string,
    private email: string,
){
    this.id = User.nextId++;
}
   

    update(changes: UserChanges): void {
        if (changes.name !== undefined) this.name = changes.name;
        if (changes.email !== undefined) this.email = changes.email;
    }

    get contactEmail(): string { return this.email; }
    addLoan(id: MediaId): void { this.borrowed.add(id); }
    removeLoan(id: MediaId): void { this.borrowed.delete(id); }
    hasLoan(id: MediaId): boolean { return this.borrowed.has(id); }
}

export class LibraryService {
    private readonly items = new Map<MediaId, Borrowable>();
    private readonly users = new Map<UserId, User>();
    private readonly loans: LoanRecord[] = [];

    constructor(private readonly loanDays: LoanPolicy = defaultLoanDays) {}

    addItem(item: Borrowable): void {
        this.items.set(item.id, item);
    }

    registerUser(user: User): void {
        this.users.set(user.id, user);
    }

    private resolveMedia(target: MediaId | string | SearchCriteria): Borrowable {
        if (typeof target === "number") {
            return findOrThrow(this.items, target, "Item");
        }

        const criteria: SearchCriteria = typeof target === "string" ? { title: target } : target;
        const normalizedTitle = criteria.title.trim().toLowerCase();

        let matches = Array.from(this.items.values()).filter(
            (item) => item.title.trim().toLowerCase() === normalizedTitle,
        );

        if (criteria.author) {
            const normalizedAuthor = criteria.author.trim().toLowerCase();
            matches = matches.filter(
                (item) => item instanceof Book && item.author.trim().toLowerCase() === normalizedAuthor,
            );
            
        }

        if (criteria.release !== undefined) {
            matches = matches.filter(
                (item) => item instanceof Book && item.release === criteria.release,
            );
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

            throw new Error(
                `Multiple items found for "${criteria.title}". Specify author/release or use ID: ${options}`,
            );
        }

        return matches[0];
    }

    @logAction
    async borrowAsync(
        userId: UserId,
        mediaOrQuery: MediaId | string | SearchCriteria,
    ): Promise<LoanRecord> {
        try {
            const user = findOrThrow(this.users, userId, "User");
            const item = this.resolveMedia(mediaOrQuery);

            if (user.hasLoan(item.id)) {
                throw new Error("User already borrowed a copy of this item");
            }

            item.borrow();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + this.loanDays);
            const loan: LoanRecord = [item.id, userId, dueDate];
            user.addLoan(item.id);
            this.loans.push(loan);
            await Promise.resolve();
            return loan;
        } catch (error: unknown) {
            throw new Error(`Borrow failed: ${errorMessage(error)}`);
        }
    }

    @logAction
    async returnAsync(
        userId: UserId,
        mediaOrQuery: MediaId | string | SearchCriteria,
    ): Promise<void> {
        try {
            const user = findOrThrow(this.users, userId, "User");
            const item = this.resolveMedia(mediaOrQuery);

            if (!user.hasLoan(item.id)) {
                throw new Error("This user does not have this item");
            }

            item.returnItem();
            user.removeLoan(item.id);
            const index = this.loans.findIndex(
                ([loanMediaId, loanUserId]) =>
                    loanMediaId === item.id && loanUserId === userId,
            );
            if (index >= 0) this.loans.splice(index, 1);
            await Promise.resolve();
        } catch (error: unknown) {
            throw new Error(`Return failed: ${errorMessage(error)}`);
        }
    }

    get activeLoans(): readonly LoanRecord[] {
        return this.loans;
    }
    getBookPreviews(): BookPreview[] {
    return Array.from(this.items.values())
        .filter((item): item is Book => item instanceof Book);
}
}