import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export default class TestUtils {
  /**
   * Spec utils for working with the DOM
   */

  /**
   * Returns a selector for the `data-testid` attribute with the given attribute value.
   *
   * @param testId Test id set by `data-testid`
   *
   */
  static testIdSelector(testId: string): string {
    return `[data-testid="${testId}"]`;
  }

  /**
   * Finds a single element inside the Component by the given CSS selector.
   * Throws an error if no element was found.
   *
   * @param fixture Component fixture
   * @param selector CSS selector
   *
   */
  static queryByCss<T>(
    fixture: ComponentFixture<T>,
    selector: string
  ): DebugElement {
    // The return type of DebugElement#query() is declared as DebugElement,
    // but the actual return type is DebugElement | null.
    // See https://github.com/angular/angular/issues/22449.
    const debugElement = fixture.debugElement.query(By.css(selector));
    // Fail on null so the return type is always DebugElement.
    if (!debugElement) {
      throw new Error(`queryByCss: Element with ${selector} not found`);
    }
    return debugElement;
  }

  /**
   * Finds all the elements within the component per the given CSS selector.
   * Throws an error if no element was found.
   *
   * @param fixture Component fixture
   * @param selector CSS selector
   *
   */
  static queryAllByCss<T>(
    fixture: ComponentFixture<T>,
    selector: string
  ): DebugElement[] {
    // The return type of DebugElement#query() is declared as DebugElement,
    // but the actual return type is DebugElement | null.
    // See https://github.com/angular/angular/issues/22449.
    const debugElement = fixture.debugElement.queryAll(By.css(selector));
    return debugElement;
  }

  /**
   * Finds an element inside the Component by the given `data-testid` attribute.
   * Throws an error if no element was found.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   *
   */
  static findEl<T>(fixture: ComponentFixture<T>, testId: string): DebugElement {
    return TestUtils.queryByCss<T>(fixture, TestUtils.testIdSelector(testId));
  }

  /**
   * Finds all elements with the given `data-testid` attribute.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   */
  static findEls<T>(
    fixture: ComponentFixture<T>,
    testId: string
  ): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css(TestUtils.testIdSelector(testId))
    );
  }

  /**
   * Gets the text content of an element with the given `data-testid` attribute.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   */
  static getText<T>(fixture: ComponentFixture<T>, testId: string): string {
    return TestUtils.findEl(fixture, testId).nativeElement.textContent;
  }

  /**
   * Expects that the element with the given `data-testid` attribute
   * has the given text content.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   * @param text Expected text
   */
  static expectText<T>(
    fixture: ComponentFixture<T>,
    testId: string,
    text: string
  ): void {
    expect(TestUtils.getText(fixture, testId)).toBe(text);
  }

  /**
   * Expects that the element with the given `data-testid` attribute
   * has the given text content.
   *
   * @param fixture Component fixture
   * @param text Expected text
   */
  static expectContainedText<T>(
    fixture: ComponentFixture<T>,
    text: string
  ): void {
    expect(fixture.nativeElement.textContent).toContain(text);
  }

  /**
   * Expects that a component has the given text content.
   * Both the component text content and the expected text are trimmed for reliability.
   *
   * @param fixture Component fixture
   * @param text Expected text
   */
  static expectContent<T>(fixture: ComponentFixture<T>, text: string): void {
    expect(fixture.nativeElement.textContent).toBe(text);
  }

  /**
   * Dispatches a fake event (synthetic event) at the given element.
   *
   * @param element Element that is the target of the event
   * @param type Event name, e.g. `input`
   * @param bubbles Whether the event bubbles up in the DOM tree
   */
  static dispatchFakeEvent(
    element: EventTarget,
    type: string,
    bubbles: boolean = false
  ): void {
    const event = new Event(type, { bubbles, cancelable: false });
    element.dispatchEvent(event);
  }

  /**
   * Enters text into a form field (`input`, `textarea` or `select` element).
   * Triggers appropriate events so Angular takes notice of the change.
   * If you listen for the `change` event on `input` or `textarea`,
   * you need to trigger it separately.
   *
   * @param element Form field
   * @param value Form field value
   */
  static setFieldElementValue(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    value: string
  ): void {
    element.value = value;
    // Dispatch an `input` or `change` fake event
    // so Angular form bindings take notice of the change.
    const isSelect = element instanceof HTMLSelectElement;
    TestUtils.dispatchFakeEvent(
      element,
      isSelect ? 'change' : 'input',
      isSelect ? false : true
    );
  }

  /**
   * Sets the value of a form field with the given `data-testid` attribute.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   * @param value Form field value
   */
  static setFieldValue<T>(
    fixture: ComponentFixture<T>,
    testId: string,
    value: string
  ): void {
    TestUtils.setFieldElementValue(
      TestUtils.findEl(fixture, testId).nativeElement,
      value
    );
  }

  /**
   * Checks or unchecks a checkbox or radio button.
   * Triggers appropriate events so Angular takes notice of the change.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   * @param checked Whether the checkbox or radio should be checked
   */
  static checkField<T>(
    fixture: ComponentFixture<T>,
    testId: string,
    checked: boolean
  ): void {
    const { nativeElement } = TestUtils.findEl(fixture, testId);
    nativeElement.checked = checked;
    // Dispatch a `change` fake event so Angular form bindings take notice of the change.
    TestUtils.dispatchFakeEvent(nativeElement, 'change');
  }

  /**
   * Makes a fake click event that provides the most important properties.
   * Sets the button to left.
   * The event can be passed to DebugElement#triggerEventHandler.
   *
   * @param target Element that is the target of the click event
   */
  static makeEvent(type: string, target: EventTarget): Partial<MouseEvent> {
    return {
      preventDefault(): void {},
      stopPropagation(): void {},
      stopImmediatePropagation(): void {},
      type,
      target,
      currentTarget: target,
      bubbles: true,
      cancelable: true,
      button: 0,
    };
  }

  /**
   * Emulates a left click on the element with the given `data-testid` attribute.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   */
  static click<T>(fixture: ComponentFixture<T>, testId: string): void {
    const element = TestUtils.findEl(fixture, testId);
    const event = TestUtils.makeEvent('click', element.nativeElement);
    element.triggerEventHandler('click', event);
  }

  /**
   * Emulates a loss of focus on the element with the `date-testid` attribute.
   *
   * @param fixture Component fixture
   * @param testId Test id set by `data-testid`
   */
  static blur<T>(fixture: ComponentFixture<T>, testId: string): void {
    const element = TestUtils.findEl(fixture, testId);
    const event = TestUtils.makeEvent('blur', element.nativeElement);
    element.triggerEventHandler('blur', event);
  }

  /**
   * Finds a nested Component by its selector, e.g. `app-example`.
   * Throws an error if no element was found.
   * Use this only for shallow component testing.
   * When finding other elements, use `findEl` / `findEls` and `data-testid` attributes.
   *
   * @param fixture Fixture of the parent Component
   * @param selector Element selector, e.g. `app-example`
   */
  static findComponent<T>(
    fixture: ComponentFixture<T>,
    selector: string
  ): DebugElement {
    return TestUtils.queryByCss(fixture, selector);
  }

  /**
   * Finds all nested Components by its selector, e.g. `app-example`.
   */
  static findComponents<T>(
    fixture: ComponentFixture<T>,
    selector: string
  ): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }
}
