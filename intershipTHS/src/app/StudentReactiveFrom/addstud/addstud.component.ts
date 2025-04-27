import { Component, Inject, OnInit } from '@angular/core';
import { Student } from '../../Classes/student';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { Router } from '@angular/router';
import { DepartmentService } from '../../Services/department.service';
import { Department } from '../../Classes/department';
import { TeacherService } from '../../Services/teacher.service';
import { Teacher } from '../../Classes/teacher';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addstud',
  templateUrl: './addstud.component.html',
  styleUrl: './addstud.component.css'
})
  export class AddstudComponent  implements OnInit {
student: Student = new Student();
departments: Department[] = [];
teachers:Teacher[]=[];

  regForm!: any;
  // regForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private teacherService:TeacherService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data: { message: string },
    public dialogRef: MatDialogRef<AddstudComponent>
  ) {}
ngOnInit() {
  this.regForm = this.fb.group({
    id: [this.student.id,],
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
    addresses: this.fb.array([
      this.fb.group({
        area: ['', Validators.required],
        city: ['', Validators.required],
        pincode: [null, [  
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]]
      })
    ]),
    
    teachers: [[], Validators.required],
    });



    this.getDepartments();
    this.getTeachers();
  }


  register(formdata: FormGroup) {

    // console.log( "form Data in register:-",formdata.value); 
    // console.log(formdata.valid);

    if (formdata.valid) {
      this.saveStudent();
      // this.dialogRef.close('success');  
    } else {
      console.log("Form is invalid!");
    }
  }
 

  saveStudent() {
    
    this.student = { 
      ...this.regForm.value, 
      department: this.regForm.value.department ? { id: this.regForm.value.department } : null,
    
      mobileNumbers: this.regForm.value.mobileNumbers.map((num: string) => ({ mobileNumber: num })),
      teachers: this.regForm.value.teachers ?.map((id: number) => ({ id })) || []
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
    this.dialogRef.close();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
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


// teacher

getTeachers() {

  this.teacherService.getTeacherList().subscribe(data => {
    // console.log("Teacher List",data)
    this.teachers=data.data;
  })
}

// address
deleteAddress(val:any){
  this.regForm.get('addresses').removeAt(val);
}

addAddress() {
  const addressForm = this.fb.group({
    area: ['', Validators.required],
    city: ['', Validators.required],
    pincode: [null, [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]]
  });
  (this.regForm.get('addresses') as FormArray).push(addressForm);
}



// 
}