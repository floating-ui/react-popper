import { renderHook, act } from '@testing-library/react-hooks';
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

    const { waitFor, rerender } = renderHook(
      ({ referenceElement, popperElement }) =>
        usePopper(referenceElement, popperElement),
      { initialProps: { referenceElement, popperElement } }
    );

    await act(async () => {
      rerender({ referenceElement, popperElement });
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('updates Popper on explicitly listed props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { waitFor, rerender } = renderHook(
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

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('does not update Popper on generic props change', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');

    const { waitFor, rerender } = renderHook(
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

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalledTimes(2);
    });
  });

  it('destroys Popper on instance on unmount', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');
    
    const { waitFor, unmount } = renderHook(() =>
      usePopper(referenceElement, popperElement)
    );

    const popperInstance = spy.mock.results[0].value;
    const destroy = jest.spyOn(popperInstance, 'destroy');

    await unmount();

    await waitFor(() => {
      expect(destroy).toHaveBeenCalled();
    });
  });

  it('Initializes the arrow positioning', async () => {
    const arrowElement = document.createElement('div');
    const popperElementWithArrow = document.createElement('div');
    popperElementWithArrow.appendChild(arrowElement);

    const { result, waitFor } = renderHook(() =>
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
