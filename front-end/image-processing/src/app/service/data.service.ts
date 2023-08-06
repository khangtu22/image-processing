import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private sharedDataSubject = new BehaviorSubject<any>(null);

    getSharedData() {
        return this.sharedDataSubject.asObservable();
    }

    updateSharedData(data: any) {
        this.sharedDataSubject.next(data);
    }
}
