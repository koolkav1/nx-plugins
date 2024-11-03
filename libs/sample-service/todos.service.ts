import { Injectable } from "@angular/core";
import {Observable, of} from "rxjs"
@Injectable()
export class TodosService {
    getTodos(filter?: string): Observable<any[]> {
        return of(['test1', 'test2', 'test3']);
    }
}