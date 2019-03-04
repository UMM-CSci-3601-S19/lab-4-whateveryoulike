import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
        {
          _id: 'kurt_id',
          owner: 'Kurt',
          status: false,
          body: 'All in all is all we are',
          category: 'stuff',
        },
        {
          _id: 'layne_id',
          owner: 'Layne',
          status: false,
          body: 'Here they come to snuff the rooster',
          category: 'stuff'
        },
        {
          _id: 'chris_id',
          owner: 'Chris',
          status: true,
          body: 'Follow me into the desert',
          category: 'things',
        }
      ].find(todo => todo._id === todoId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve Layne by ID', () => {
    todoComponent.setId('layne_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.owner).toBe('Laayne');
    expect(todoComponent.todo.body).toBe('Here they come to snuff the rooster');
  });

  it('returns undefined for Scott', () => {
    todoComponent.setId('Scott');
    expect(todoComponent.todo.owner).not.toBeDefined();
  });

});
