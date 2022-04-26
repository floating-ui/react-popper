// @flow strict
import { renderHook, act, waitFor } from '@testing-library/react';
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
    const { result } = renderHook(() =>
      usePopper(referenceElement, popperElement)
    );

    await waitFor(() => {
      expect(result.current.state).not.toBe(null);
    });
  });

  it("doesn't update Popper instance on props update if not needed by Popper", async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');
    const { rerender } = renderHook(
      ({ referenceElement, popperElement }) =>
        usePopper(referenceElement, popperElement),
      { initialProps: { referenceElement, popperElement } }
    );

    await act(async () => {
      rerender({ referenceElement, popperElement });
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('updates Popper on explicitly listed props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { rerender } = renderHook(
      ({ referenceElement, popperElement }) =>
        usePopper(referenceElement, popperElement),
      { initialProps: { referenceElement, popperElement } }
    );

    await act(async () => {
      rerender({
        referenceElement,
        popperElement: document.createElement('div'),
      });
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not update Popper on generic props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');
    const { rerender } = renderHook(
      ({ referenceElement, popperElement, options }) =>
        usePopper(referenceElement, popperElement, options),
      { initialProps: { referenceElement, popperElement } }
    );

    await act(async () => {
      rerender({
        referenceElement,
        popperElement,
        options: { foo: 'bar' },
      });
    });

    expect(spy).toHaveBeenCalledTimes(1);
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

    const { result } = renderHook(() =>
      usePopper(referenceElement, popperElementWithArrow, {
        placement: 'bottom',
        modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
      })
    );

    expect(result.current.styles.arrow.position).toBe('absolute');
    expect(result.current.styles.arrow.transform).toBeUndefined();

    await waitFor(() => {
      expect(result.current.styles.arrow.transform).toBeDefined();
    });
  });
});
