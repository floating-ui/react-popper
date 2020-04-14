// @flow
import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import * as PopperJs from '@popperjs/core';

// Public API
import { Popper } from '.';

const renderPopper = async (props): any => {
  let result;
  await act(async () => {
    result = await render(
      <Popper {...props}>
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement}>
            <div {...arrowProps} />
          </div>
        )}
      </Popper>
    );
  });
  return result;
};

describe('Popper component', () => {
  it('renders the expected markup', async () => {
    const referenceElement = document.createElement('div');

    const { asFragment } = await renderPopper({ referenceElement });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('handles changing refs gracefully', async () => {
    const referenceElement = document.createElement('div');

    expect(() =>
      render(
        <Popper referenceElement={referenceElement}>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={(current) => ref(current)}
              style={style}
              data-placement={placement}
            >
              <div {...arrowProps} ref={(current) => arrowProps.ref(current)} />
            </div>
          )}
        </Popper>
      )
    ).not.toThrow();

    await waitFor(() => {});
  });

  it('accepts a ref function', async () => {
    const myRef = jest.fn();
    const referenceElement = document.createElement('div');

    render(
      <Popper referenceElement={referenceElement} innerRef={myRef}>
        {({ ref, style, placement }) => (
          <div ref={ref} style={style} data-placement={placement} />
        )}
      </Popper>
    );

    await waitFor(() => {
      expect(myRef).toBeCalled();
    });
  });

  it('accepts a ref object', async () => {
    const myRef = React.createRef();
    const referenceElement = document.createElement('div');

    render(
      <Popper referenceElement={referenceElement} innerRef={myRef}>
        {({ ref, style, placement }) => (
          <div ref={ref} style={style} data-placement={placement} />
        )}
      </Popper>
    );

    await waitFor(() => {
      expect(myRef.current).toBeDefined();
    });
  });

  it('accepts a `referenceElement` property', async () => {
    const spy = jest.spyOn(PopperJs, 'createPopper');
    const virtualReferenceElement = {
      getBoundingClientRect(): any {
        return {
          top: 10,
          left: 10,
          bottom: 20,
          right: 100,
          width: 90,
          height: 10,
        };
      },
    };
    await renderPopper({
      referenceElement: virtualReferenceElement,
    });
    await waitFor(() => {
      expect(spy.mock.calls[0][0]).toBe(virtualReferenceElement);
    });
  });

  it(`should update placement when property is changed`, async () => {
    const referenceElement = document.createElement('div');

    const Component = ({ placement }) => (
      <Popper placement={placement} referenceElement={referenceElement}>
        {({ ref, style, placement }) => (
          <div
            ref={ref}
            style={style}
            data-testid="placement"
            data-placement={placement}
          >
            {placement}
          </div>
        )}
      </Popper>
    );

    const { rerender, getByTestId } = render(<Component placement="top" />);

    expect(getByTestId('placement').textContent).toBe('top');

    await waitFor(() => rerender(<Component placement="bottom" />));

    expect(getByTestId('placement').textContent).toBe('bottom');
  });
});
