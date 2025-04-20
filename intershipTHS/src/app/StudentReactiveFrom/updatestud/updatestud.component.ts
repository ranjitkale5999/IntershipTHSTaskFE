import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../Classes/student';

@Component({
  selector: 'app-updatestud',
  templateUrl: './updatestud.component.html',
  styleUrl: './updatestud.component.css'
})
export class UpdatestudComponent {
  id: number = 0;
  regForm!: FormGroup;
  student: Student = new Student();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.regForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
    });

    this.studentService.getStudentById(this.id).subscribe(data => {
      this.student = data;
      console.log("Student by Id", data);
      this.regForm.patchValue({
        id: this.student.id,
        name: this.student.name,
        age: this.student.age,
      });
    });

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

}


