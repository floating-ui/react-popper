// @flow
import React from 'react';
import warning from 'warning';
import { render } from '@testing-library/react';

// Public API
import { Reference } from '.';

// Private API
import { ManagerReferenceNodeSetterContext } from './Manager';

jest.mock('warning');

describe('Arrow component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the expected markup', () => {
    const setReferenceNode = jest.fn();

    const { asFragment } = render(
      <ManagerReferenceNodeSetterContext.Provider value={setReferenceNode}>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>
      </ManagerReferenceNodeSetterContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('consumes the ManagerReferenceNodeSetterContext from Manager', () => {
    const setReferenceNode = jest.fn();

    render(
      <ManagerReferenceNodeSetterContext.Provider value={setReferenceNode}>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>
      </ManagerReferenceNodeSetterContext.Provider>
    );
    expect(setReferenceNode).toHaveBeenCalled();
  });

  it('warns when setReferenceNode is present', () => {
    const setReferenceNode = jest.fn();

    render(
      <ManagerReferenceNodeSetterContext.Provider value={setReferenceNode}>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>
      </ManagerReferenceNodeSetterContext.Provider>
    );
    expect(warning).toHaveBeenCalledWith(
      true,
      '`Reference` should not be used outside of a `Manager` component.'
    );
  });

  it('does not warn when setReferenceNode is not present', () => {
    render(
      <ManagerReferenceNodeSetterContext.Provider value={undefined}>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>
      </ManagerReferenceNodeSetterContext.Provider>
    );
    expect(warning).toHaveBeenCalledWith(
      false,
      '`Reference` should not be used outside of a `Manager` component.'
    );
  });
});
