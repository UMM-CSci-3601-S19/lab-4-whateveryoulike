import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/todos');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  submit() {
    this.click('submit');
  }
  getTodoTitle() {
    const title = element(by.id('todo-list-title')).getText();
    this.highlightElement(by.id('todo-list-title'));

    return title;
  }

  typeOwner(owner: string) {
    const input = element(by.id('todoOwner'));
    input.click();
    input.sendKeys(owner);
  }

  typeStatus(status: string) {
    const input = element(by.id('todoStatus'));
    input.click();
    input.sendKeys(status);
  }

  typeCategory(category: string) {
    const input = element(by.id('todoCategory'));
    input.click();
    input.sendKeys(category);
  }

  typeBody(body: string) {
    const input = element(by.id('todoBody'));
    input.click();
    input.sendKeys(body);
  }

  selectUpKey() {
    browser.actions().sendKeys(Key.ARROW_UP).perform();
  }

  backspace() {
    browser.actions().sendKeys(Key.BACK_SPACE).perform();
  }

  getStatus(status: string) {
    const input = element(by.id('todoStatus'));
    input.click();
    input.sendKeys(status);
    this.click('submit');
  }


  getTodos() {
    return element.all(by.className('todos'));
  }


  /*
    Intellij has determined
    this space forbidden

    any attempts to code
    in the forbidden space
    will result in compile errors




  (and death)
  */
  getUniqueTodo(id: string) {
    const todo = element(by.id(id)).getText();
    this.highlightElement(by.id(id));

    return todo;
  }
  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  // This is a custom method written to check for certain element classes present
  elementExistsWithClass(classOfElement: string): promise.Promise<boolean> {
    if (element(by.className(classOfElement)).isPresent()) {
      this.highlightElement(by.className(classOfElement));
    }
    return element(by.className(classOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

}
