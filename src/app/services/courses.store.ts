import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
  ){
    this.loadAllCourses();
  }

  filterByCategory (category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category == category)
      .sort(sortCoursesBySeqNo))
    );
  }
  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses")
      .pipe(
        map(response => response["payload"]),
        catchError(err => {
          const message = "Could not load courses";
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(courses => this.coursesSubject.next(courses)),
      );

    this.loadingService.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }
}
