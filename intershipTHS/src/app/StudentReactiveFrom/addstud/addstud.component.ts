import { Component, OnInit } from '@angular/core';
import { Student } from '../../Classes/student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../Services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addstud',
  templateUrl: './addstud.component.html',
  styleUrl: './addstud.component.css'
})
  export class AddstudComponent  implements OnInit {
student: Student = new Student();
  // regForm!: any;
  regForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
  ) {}
ngOnInit() {
  this.regForm = this.fb.group({
    id: [this.student.id, Validators.required],
    name: [this.student.name, Validators.required],
    age: [this.student.age, Validators.required],
    });

  }


  register(formdata: FormGroup) {

    console.log( "form Data in register:-",formdata.value); 
    console.log(formdata.valid);

    this.saveStudent();
  }
 

  saveStudent() {
    this.student = { 
      ...this.regForm.value, 
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











}