declare class Observable<D> {
    private observers;
    constructor();
    subscribe(handler: (data: D) => void): void;
    unsubscribe(handler: (data: D) => void): void;
    notify(data: D): void;
    clear(): void;
}
export default Observable;
