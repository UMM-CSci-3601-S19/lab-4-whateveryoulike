import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list', () => {
  const testTodos: Todo[] = [
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
  ];
  const kurtTodos: Todo[] = testTodos.filter( todo =>
    todo.owner.toLowerCase().indexOf("kurt") !== -1
  );
  let todoListService: TodoListService;
  let currentlyImpossibleToGenerateSearchTodoUrl: string;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );
    const req = httpTestingController.expectOne(todoListService.baseUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testTodos);
  });

  it('getTodos(owner) adds appropriate param string', () => {
    todoListService.getTodos("kurt").subscribe(todos => {
        expect(todos).toEqual(kurtTodos)
      }
    );

    const req = httpTestingController.expectOne(todoListService.baseUrl + '?owner=kurt&');
    expect(req.request.method).toEqual('GET');
    req.flush(kurtTodos);
  });

  it('filterByOwner(owner) deals appropriately with a URL that already had a owner', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?owner=f&something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByOwner('fry');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&owner=fry&');
  });

  it('filterByOwner(owner) deals appropriately with a URL that already had some filtering, but no owner', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByOwner('fry');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&owner=fry&');
  });

  it('filterByOwner(owner) deals appropriately with a URL has the keyword owner, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?owner=&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByOwner('fry');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?owner=fry&');
  });
  it('adding a todo calls api/todos/new', () => {
    const jesse_id = 'jesse_id';
    const newTodo: Todo = {
      _id: jesse_id,
      owner: 'Jesse',
      status: true,
      body: 'Do a sick skateboarding trick',
      category: 'cool stuff'
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });

});
