import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../Services/student.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Student } from '../../Classes/student';
import { Router } from '@angular/router';
import { Address } from '../../Classes/address';
import { AddressService } from '../../Services/address.service';

@Component({
  selector: 'app-liststud',
  templateUrl: './liststud.component.html',
  styleUrl: './liststud.component.css'
})
export class ListstudComponent  implements OnInit{
  students: Student[] = [];
  addresses: Address[] = [];
  formsearch!: FormGroup;
  constructor(private studentService: StudentService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private router: Router,
  ) { }
ngOnInit(): void {
  this.formsearch = this.fb.group({
    area: [''],
    city: ['']
  }, { validators: this.onlyOneFieldValidator() });

    this.getStudentList();
    this.getAddress();
}

getStudentList() {
  this.studentService.getStudentList().subscribe(
    (response) => {
      console.log('Student list:', response);
      this.students = response;
    },
    (error) => {
      console.error('Error fetching student list:', error);
    }
  );
}

delete(id: number) {
  this.studentService.deleteStudent(id).subscribe((data) => {
    //  console.log(data);
    this.getStudentList();
  });
}

update(id: number) {
  this.router.navigate(['studUpdate', id]);
}

 // Address List
 uniqueAreas: string[] = [];
 uniqueCities: string[] = [];
 getAddress() {
   this.addressService.getAddressList().subscribe((data) => {
     console.log("Address List :-", data);
     this.addresses = data;
     this.uniqueAreas = [...new Set(data.map(a => a.area))];
     this.uniqueCities = [...new Set(data.map(a => a.city))];
   });
 }
// Search 
searchCA(formsearch: FormGroup) {
  console.log("Invalid",formsearch.invalid)
  const { area, city } = this.formsearch.value;
  console.log("data:- ",  formsearch.value);
  this.studentService.getStudentsByCriteria(area, city).subscribe(
    (response) => {
    console.log("Search API Response (criteria):", response);
    this.students = response.data;
  },
    (error) => {
      // console.error("Error during search:", error);
      if (error.status === 404) {
        alert(error.error.message || "No data found .");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }

    }
  );
}

resetSearch() {
  this.formsearch.reset();
  this.getStudentList();
}

onlyOneFieldValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const area = group.get('area')?.value;
    const city = group.get('city')?.value;
    return area || city ? null : { atLeastOne: true };
  };


}


}
