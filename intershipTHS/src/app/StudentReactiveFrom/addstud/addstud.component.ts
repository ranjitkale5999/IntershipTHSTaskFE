import { Component, OnInit } from '@angular/core';
import { Student } from '../../Classes/student';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { Router } from '@angular/router';
import { DepartmentService } from '../../Services/department.service';
import { Department } from '../../Classes/department';

@Component({
  selector: 'app-addstud',
  templateUrl: './addstud.component.html',
  styleUrl: './addstud.component.css'
})
  export class AddstudComponent  implements OnInit {
student: Student = new Student();
departments: Department[] = [];
  regForm!: any;
  // regForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private router: Router,
  ) {}
ngOnInit() {
  this.regForm = this.fb.group({
    id: [this.student.id, Validators.required],
    name: [this.student.name, Validators.required],
    age: [this.student.age, Validators.required],
    department: [this.student.department, Validators.required],


    mobileNumbers: this.fb.array(
      this.student.mobileNumbers  // this.student.mobileNumbers && this.student.mobileNumbers.length > 0
        ? 
        this.student.mobileNumbers.map(m => new FormControl(m.mobileNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]))
        :
         [new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)])]
    ),
    });



    this.getDepartments();
  }


  register(formdata: FormGroup) {

    console.log( "form Data in register:-",formdata.value); 
    console.log(formdata.valid);

    this.saveStudent();
  }
 

  saveStudent() {
    
    this.student = { 
      ...this.regForm.value, 
      department: this.regForm.value.department ? { id: this.regForm.value.department } : null,
    
      mobileNumbers: this.regForm.value.mobileNumbers.map((num: string) => ({ mobileNumber: num })),

    };
  
    console.log('Payload:', this.student);
    // alert(JSON.stringify(this.student));
    this.studentService.createStudent(this.student).subscribe(data => {
      console.log('Student saved successfully:', data);
      this.goToStudent();
    }, error => {
      console.error('Error saving student:', error);
    });
  }


  goToStudent() {
    this.router.navigate(['/home']);
  }


// Depatment

getDepartments() {
  this.departmentService.getDepartmentList().subscribe(data => {
    // console.log(data);
    this.departments = data;

  });
}



// Mobile Number
addmore(){
  this.regForm.get('mobileNumbers').push(
    // new FormControl()
    new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)])
   );
}

deleterow(val:any){
  if (this.regForm.get('mobileNumbers').length > 1) {
    this.regForm.get('mobileNumbers').removeAt(val);
        
      }
  
}

// removeMobileNumber(index: number) {
//   if (this.mobileNumbers.length > 1) {
//     this.mobileNumbers.removeAt(index);
    
//   }
// }

// get mobileNumbers(): FormArray {
//   return this.regForm.get('mobileNumbers') as FormArray;
// }

}