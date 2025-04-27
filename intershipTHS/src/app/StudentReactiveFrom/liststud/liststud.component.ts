import { Component, Inject, OnInit } from '@angular/core';
import { StudentService } from '../../Services/student.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Student } from '../../Classes/student';
import { Router } from '@angular/router';
import { Address } from '../../Classes/address';
import { AddressService } from '../../Services/address.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddstudComponent } from '../addstud/addstud.component';
import { UpdatestudComponent } from '../updatestud/updatestud.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-liststud',
  templateUrl: './liststud.component.html',
  styleUrl: './liststud.component.css'
})
export class ListstudComponent  implements OnInit{
  students: Student[] = [];
  addresses: Address[] = [];
  formsearch!: FormGroup;
  pagedStudents: Student[] = [];
  pageSize = 5;
  currentPage = 0;
  totalStudents = 0;
  constructor(private studentService: StudentService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
   

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
      // console.log('Student list:', response);
      this.students = response;
      this.totalStudents = this.students.length;
      this.updatePagedStudents();
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
  const dialogRef = this.dialog.open(UpdatestudComponent, {
    
    width:'50%',
    height: '90%',
    enterAnimationDuration: '500ms',
    exitAnimationDuration: '900ms',
    data: { id: id }, 
  });
  
}

 // Address List
 uniqueAreas: string[] = [];
 uniqueCities: string[] = [];
 getAddress() {
   this.addressService.getAddressList().subscribe((data) => {
    //  console.log("Address List :-", data);
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

// Dialog for Add Student
showPrompt(): void {
  const dialogRef = this.dialog.open(AddstudComponent, {
    width:'50%',
    height: '90%',
    enterAnimationDuration: '500ms', 
      exitAnimationDuration: '900ms',
  });

  
}

// Pagination
updatePagedStudents() {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  // this.students = this.students.slice(startIndex, endIndex);
  this.pagedStudents = this.students.slice(startIndex, endIndex);
}

onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex;
  this.updatePagedStudents();
}

// 
}
