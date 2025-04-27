import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../Classes/student';
import { Department } from '../../Classes/department';
import { DepartmentService } from '../../Services/department.service';
import { Teacher } from '../../Classes/teacher';
import { TeacherService } from '../../Services/teacher.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-updatestud',
  templateUrl: './updatestud.component.html',
  styleUrl: './updatestud.component.css'
})
export class UpdatestudComponent implements OnInit{
  id: number = 0;
  regForm!: FormGroup;
  student: Student = new Student();
  departments: Department[] = [];
  teachers:Teacher[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private teacherService:TeacherService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdatestudComponent>,   // ✅ Inject DialogRef
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) { }
  ngOnInit() {
    // this.id = this.route.snapshot.params['id'];
    this.id = this.data.id; 

    this.regForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      department: [this.student.department, Validators.required],
      mobileNumbers: this.fb.array([],Validators.required),
      // teachers: this.fb.array([], Validators.required),
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
      teachers: [[], Validators.required]
    });

    this.studentService.getStudentById(this.id).subscribe(data => {
      this.student = data;
      console.log("Student by Id", data);
      this.regForm.patchValue({
        id: this.student.id,
        name: this.student.name,
        age: this.student.age,
        department: this.student.department ? this.student.department.id : null,
        teachers: this.student.teachers?.map(t => t.id) || []
      });
      // Populate mobile numbers
      this.setMobileNumbers(this.student.mobileNumbers);

      this.setAddresses(this.student.addresses);

    });
    
    this.getDepartments();
    this.getTeachers();
  }

  reset() {
    this.regForm.reset({
      name: this.regForm.get('name')?.value,
      age: this.regForm.get('age')?.value,
    });
  }

  update(formdata: FormGroup) {
    if (formdata.valid) {
      console.log("Form Data:", formdata.value);
      // alert(JSON.stringify(this.student));
      const updatedStudent: Student = {
        ...formdata.value,
        department: this.regForm.value.department ? { id: this.regForm.value.department } : null,
        mobileNumbers: formdata.value.mobileNumbers.map((num: string, index: number) => ({
          id: this.student.mobileNumbers?.[index]?.id || null,
          mobileNumber: num
        })),
        teachers: this.regForm.value.teachers ?.map((id: number) => ({ id })) || [],
      };
      this.student = updatedStudent;
      this.studentService.updateStudent(this.id, this.student).subscribe(
        (data) => {
          this.goToStudent();
        },
        (error) => {
          console.error("Error updating student:", error);
        }
      );
    } else {
      console.warn("Form is invalid. Please check the fields.");
    }
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
    console.log(data);
    this.departments = data;

  });

}

//Mobile Number

 // Getter for mobileNumbers FormArray
 get mobileNumbers(): FormArray {
  return this.regForm.get('mobileNumbers') as FormArray;
}

 // Populate mobile numbers in FormArray
 setMobileNumbers(mobileNumbers: any[]) {
  this.mobileNumbers.clear();

  mobileNumbers.forEach(m => {
    this.mobileNumbers.push(new FormControl(m.mobileNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]));
  });

  if (mobileNumbers.length === 0) {
    this.mobileNumbers.push(new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]));
  }
}


addMobileNumber() {
  this.mobileNumbers.push(new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]));
}


removeMobileNumber(index: number) {
  if (this.mobileNumbers.length > 1) {
    this.mobileNumbers.removeAt(index);
    
  }
}


// Teacher

getTeachers() {

  this.teacherService.getTeacherList().subscribe(data => {
    console.log("Teacher List",data)
    this.teachers=data.data;
  })
}

// address
deleteAddress(val:any){
  if(this.addresses.length > 1) {
    this.addresses.removeAt(val);
 
}
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

get addresses (): FormArray {
  return this.regForm.get('addresses') as FormArray;
}

setAddresses(addresses: any[]) {
  this.addresses.clear();

  addresses.forEach(a => {
    this.addresses.push(this.fb.group({
      area: [a.area, Validators.required],
      city: [a.city, Validators.required],
      pincode: [a.pincode, [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]]
    }));
  });
  if (addresses.length === 0) {
    this.addresses.push(this.fb.group({
      area: ['', Validators.required],
      city: ['', Validators.required],
      pincode: [null, [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]]
    }));   
  }

}

}
