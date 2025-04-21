import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../Classes/student';
import { Department } from '../../Classes/department';
import { DepartmentService } from '../../Services/department.service';

@Component({
  selector: 'app-updatestud',
  templateUrl: './updatestud.component.html',
  styleUrl: './updatestud.component.css'
})
export class UpdatestudComponent {
  id: number = 0;
  regForm!: FormGroup;
  student: Student = new Student();
  departments: Department[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.regForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      department: [this.student.department, Validators.required],
      mobileNumbers: this.fb.array([],Validators.required),
    });

    this.studentService.getStudentById(this.id).subscribe(data => {
      this.student = data;
      console.log("Student by Id", data);
      this.regForm.patchValue({
        id: this.student.id,
        name: this.student.name,
        age: this.student.age,
        // department: this.student.department.id,
        department: this.student.department ? this.student.department.id : null
        
      });
      // Populate mobile numbers
      this.setMobileNumbers(this.student.mobileNumbers);
    });
    
    this.getDepartments();
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
    this.router.navigate(['/home']);
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
}


