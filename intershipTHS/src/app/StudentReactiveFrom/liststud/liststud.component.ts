import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../Services/student.service';
import { FormBuilder } from '@angular/forms';
import { Student } from '../../Classes/student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liststud',
  templateUrl: './liststud.component.html',
  styleUrl: './liststud.component.css'
})
export class ListstudComponent  implements OnInit{
  students: Student[] = [];
  constructor(private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router,
  ) { }
ngOnInit(): void {
    this.getStudentList();
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





}
