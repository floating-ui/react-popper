// @flow
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as Popperjs from '@popperjs/core';

// Public API
import { Manager, Reference, Popper } from '.';

describe('Manager component', () => {
  it('renders the expected markup', () => {
    const { asFragment } = render(
      <Manager>
        <div id="reference" />
        <div id="popper" />
      </Manager>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('connects Popper and Reference', async () => {
    const spy = jest.spyOn(Popperjs, 'createPopper');

    render(
      <Manager>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>
        <Popper>{({ ref }) => <div ref={ref} />}</Popper>
      </Manager>
    );

    await waitFor(() => {
      expect(spy.mock.calls[0].slice(0, 2)).toMatchInlineSnapshot(`
      Array [
        <div />,
        <div />,
      ]
    `);
    });
  });
});
