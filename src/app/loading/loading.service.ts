import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  constructor() {
    console.info("LoadingService created");
  }
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        finalize(() => this.loadingOff())
      )
  }
  private loadingOn() {
    this.loadingSubject.next(true);
  }
  private loadingOff() {
    this.loadingSubject.next(false);
  }
}
