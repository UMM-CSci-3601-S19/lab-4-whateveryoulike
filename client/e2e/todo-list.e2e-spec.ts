import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('should get and highlight Todos title attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('filters todos by Owner', () => {
    page.navigateTo();
    page.typeOwner('b');
    page.submit();
    expect(page.elementExistsWithId("58af3a600343927e48e87216")).toBeTruthy();
    expect(page.elementExistsWithId("58af3a600343927e48e8721c")).toBeTruthy();
    expect(page.elementExistsWithId("58af3a600343927e48e87217")).toBeFalsy();
  });
  it('filters todos by status, body and category', () => {
    page.navigateTo();
    page.typeCategory('software');
    expect(page.elementExistsWithId("58af3a600343927e48e87212")).toBe(true);
    expect(page.elementExistsWithId("58af3a600343927e48e87217")).toBe(false);

    page.typeBody('ini');
    expect(page.elementExistsWithId("58af3a600343927e48e87212")).toBe(false);
    expect(page.elementExistsWithId("58af3a600343927e48e87266")).toBe(true);

    page.typeStatus('complete');
    expect(page.elementExistsWithId("58af3a600343927e48e87225")).toBe(false);
    expect(page.elementExistsWithId("58af3a600343927e48e8722a")).toBe(true);
  });

  it('add new todos Button exists', () => {
    expect(page.elementExistsWithId("addNewTodo")).toBe(true);
  });
    /*
    console.log(nu/home/tenor031/Documents/Software D/lab-4-whateveryoulikemTodos);
    numTodos.then(a => {
      console.log(": " + a)
      }
    );

  });
  */
});

