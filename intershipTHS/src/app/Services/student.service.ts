import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../Classes/student';
import { ApiResponse } from '../Interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient:HttpClient) {}
  
   private baseUrl:string="http://localhost:8084/api/v1/student";

   getStudentList ():Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.baseUrl)
   }

   createStudent(student:Student):Observable<Student>{
    return this.httpClient.post<Student>(`${this.baseUrl}`,student)
   }

   deleteStudent(id:number):Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/${id}`)
   }
   getStudentById(id:number):Observable<Student>{
    return this.httpClient.get<Student>(`${this.baseUrl}/${id}`)
   }

   updateStudent(id:number,student:Student):Observable<Object>{
    return this.httpClient.put<Student>(`${this.baseUrl}/${id}`,student)
   }

   getStudentsByCriteria(area?: string, city?: string): Observable<ApiResponse<Student[]>> {
    let params = new HttpParams();
  
    if (area) params = params.set('area', area);
    if (city) params = params.set('city', city);
  
    return this.httpClient.get<ApiResponse<Student[]>>(`${this.baseUrl}/criteria`, { params });
  }
  }


