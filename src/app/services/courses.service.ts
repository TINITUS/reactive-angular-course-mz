import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadCourseById(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay()
      );
  }

  loadAllCourses(): Observable<Course> {
    //Call http and return an observable matching the Course[] type
    return this.http
      .get<Course>("/api/courses")
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay()
    );
  }
  searchLessons(search: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>("/api/lessons", {
      params: {
        filter: search,
        pagesize: "100"
      }
    })
    .pipe(
      map(res => res["payload"]),
      shareReplay(),
    );
  }
}
