import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
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
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ TodoListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.todos.length).toBe(3);
  });

  it('contains a todo owned by \'Chris\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('doesn\'t contain a todo owned by \'Scott\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Scott')).toBe(false);
  });

  it('has two todo in the stuff category', () => {
    expect(todoList.todos.filter((todo: Todo) => todo.category === "stuff").length).toBe(2);
  });

  it('todo list filters by owner', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoOwner = 'r';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
    todoList.todoOwner = 'i';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
    todoList.todoOwner = 'z';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(0);
    });
    todoList.todoOwner = '';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoStatus = "incomplete";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
    todoList.todoStatus = "complete";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
    todoList.todoStatus = "false, but not really";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
    todoList.todoStatus = "";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });

  });

  it('todo list filters by category', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = 'stuff';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
    todoList.todoCategory = 'things';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
    todoList.todoCategory = 'foobar';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(0);
    });
    todoList.todoCategory = '';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by body', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoBody = 'the';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
    todoList.todoBody = 'rooster';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
    todoList.todoBody = 'foobar';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(0);
    });
    todoList.todoBody = '';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by body, category, owner, and status', () => {
    expect(todoList.filteredTodos.length).toBe(3);

    // Should give us Kurt, Layne, and Chris
    todoList.todoBody = 'r';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });

    // Should give us Kurt and Layne, who's statuses equal false.
    todoList.todoStatus = "incomplete";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });

    // Should narrow it down to Kurt
    todoList.todoOwner = 'r';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });

    // Should still be just Kurt
    todoList.todoCategory = 'stuff';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });

    // This should make the list empty
    todoList.todoStatus = 'complete';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(0);
    });

    // This should give us Scott
    todoList.todoOwner = '';
    todoList.todoCategory = 'things';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });

    // Still, we have only Scott, but could have Layne if we change some parameters
    todoList.todoBody = 'the';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });

    // Now, we will have Layne and Scott
    todoList.todoCategory = '';
    todoList.todoStatus = null;
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });

  });

});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.todos).toBeUndefined();
  });
});


describe('Adding a todo', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  const newTodo: Todo = {
    _id: '',
    owner: 'Johnny',
    status: true,
    body: 'Hello. I\'m Johnny cash',
    category: 'things'
  };
  const newId = 'johnny_id';

  let calledTodo: Todo;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>,
    addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddTodoComponent, any) => {
      afterClosed: () => Observable<Todo>
    };
  };

  beforeEach(() => {
    calledTodo = null;
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([]),
      addNewTodo: (newTodo: Todo) => {
        calledTodo = newTodo;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newTodo);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [
        {provide: TodoListService, useValue: todoListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls TodoListService.addTodo', () => {
    expect(calledTodo).toBeNull();
    todoList.openDialog();
    expect(calledTodo).toEqual(newTodo);
  });
});
