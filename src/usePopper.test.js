import { renderHook } from '@testing-library/react-hooks';
import * as PopperJs from '@popperjs/core';

// Public API
import { usePopper } from '.';

const referenceElement = document.createElement('div');
const popperElement = document.createElement('div');

describe('userPopper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes the Popper instance', async () => {
    const { result, waitFor } = renderHook(() =>
      usePopper(referenceElement, popperElement)
    );

    await waitFor(() => {
      expect(result.current.state).not.toBe(null);
    });
  });

  it("doesn't update Popper instance on props update if not needed by Popper", async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { waitForNextUpdate, rerender } = renderHook(
      ({ referenceElement, popperElement }) =>
        usePopper(referenceElement, popperElement),
      { initialProps: { referenceElement, popperElement } }
    );

    rerender({ referenceElement, popperElement });

    await waitForNextUpdate();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('updates Popper on explicitly listed props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { waitForNextUpdate, rerender } = renderHook(
      ({ referenceElement, popperElement }) =>
        usePopper(referenceElement, popperElement),
      { initialProps: { referenceElement, popperElement } }
    );

    rerender({
      referenceElement,
      popperElement: document.createElement('div'),
    });

    await waitForNextUpdate();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not update Popper on generic props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { waitForNextUpdate, rerender } = renderHook(
      ({ referenceElement, popperElement, options }) =>
        usePopper(referenceElement, popperElement, options),
      { initialProps: { referenceElement, popperElement } }
    );

    rerender({
      referenceElement,
      popperElement,
      options: { foo: 'bar' },
    });

    await waitForNextUpdate();

    expect(spy).not.toHaveBeenCalledTimes(2);
  });

  it('destroys Popper on instance on unmount', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { unmount } = renderHook(() =>
      usePopper(referenceElement, popperElement)
    );

    const popperInstance = spy.mock.results[0].value;
    const destroy = jest.spyOn(popperInstance, 'destroy');

    unmount();

    expect(destroy).toHaveBeenCalled();
  });

  it('Initializes the arrow positioning', async () => {
    const arrowElement = document.createElement('div');
    const popperElementWithArrow = document.createElement('div');
    popperElementWithArrow.appendChild(arrowElement);

    const { result, waitForNextUpdate } = renderHook(() =>
      usePopper(referenceElement, popperElementWithArrow, {
        placement: 'bottom',
        modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
      })
    );

    expect(result.current.styles.arrow.position).toBe('absolute');
    expect(result.current.styles.arrow.transform).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.styles.arrow.transform).toBeDefined();
  });
});
