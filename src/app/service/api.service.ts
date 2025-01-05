import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../entity/user";

const API_URL = 'http://localhost:8080/api/';

const HTTP_OPTIONS = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  postCalculation = (data: User) => {
    return this.http.post(API_URL + 'payments/calculate', JSON.stringify(data), HTTP_OPTIONS);
  }

  saveData = (data: User) => {
    return this.http.post(API_URL + 'payments/save', JSON.stringify(data), HTTP_OPTIONS);
  }
}
