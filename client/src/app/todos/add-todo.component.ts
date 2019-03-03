import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html'
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {}

  add_todo_validation_messages = {
    'body': [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 140 characters long'},
      {type: 'pattern', message: 'Body must contain only numbers and letters'},
    ],

    'owner': [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 60 characters long'},
      {type: 'pattern', message: 'Owner must contain only letters'}

    ],
    'category': [
      {type: 'required', message: 'Category is required'},
      {type: 'minlength', message: 'Category must be at least 2 characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 60 characters long'},
      {type: 'pattern', message: 'Category must contain only letters and numbers'}

    ]
  };

  createForms() {

    // add user form validations
    this.addTodoForm = this.fb.group({
      body: new FormControl('body', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(140),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),
      //No validation needed
      status: new FormControl('status'),

      owner: new FormControl('owner', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern('[A-Za-z\\s]*')
      ])),
      category: new FormControl('category', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ]))
    })

  }

  ngOnInit() {
    this.createForms();
  }

}
