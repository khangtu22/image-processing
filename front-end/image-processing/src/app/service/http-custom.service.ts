import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class HttpCustomService{
    constructor(private http: HttpClient) {
    }
}
