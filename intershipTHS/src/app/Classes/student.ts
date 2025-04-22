import { Department } from "./department";
import { MobileNumber } from "./mobile-number";
import { Teacher } from "./teacher";

export class Student {
    "id": number;
  "name": string;
  "age": number;
  "department": Department;
  "mobileNumbers":MobileNumber[];
  "teachers":Teacher[];
}
