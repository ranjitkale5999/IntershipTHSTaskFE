import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../Classes/address';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  

  constructor(private httpClient:HttpClient) { }
  private baseUrl:string="http://localhost:8084/api/v4/address";

  getAddressList ():Observable<Address[]>{
    return this.httpClient.get<Address[]>(this.baseUrl);
  }
}
