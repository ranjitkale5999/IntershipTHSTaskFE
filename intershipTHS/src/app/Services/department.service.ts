import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../Classes/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private httpClient:HttpClient) {}
  private baseUrl:string="http://localhost:8084/api/v2/department";
 
    getDepartmentList ():Observable<Department[]>{
     return this.httpClient.get<Department[]>(this.baseUrl)
    }
 
}
