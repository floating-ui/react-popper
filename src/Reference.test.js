// @flow
import React from 'react';
import warning from 'warning';
import { mount } from 'enzyme';

// Public API
import { Reference } from '.';

// Private API
import { ManagerContext } from './Manager';

jest.mock('warning');

describe('Arrow component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the expected markup', () => {
    const setReferenceNode = jest.fn();

    // HACK: wrapping DIV needed to make Enzyme happy for now
    const wrapper = mount(
      <div>
        <ManagerContext.Provider
          value={{
            setReferenceNode,
            referenceNode: undefined,
          }}
        >
          <Reference>{({ ref }) => <div ref={ref} />}</Reference>
        </ManagerContext.Provider>
      </div>
    );
    expect(wrapper.children()).toMatchSnapshot();
  });

  it('consumes the ManagerContext from Manager', () => {
    const setReferenceNode = jest.fn();

    // HACK: wrapping DIV needed to make Enzyme happy for now
    mount(
      <div>
        <ManagerContext.Provider
          value={{
            setReferenceNode,
            referenceNode: undefined,
          }}
        >
          <Reference>{({ ref }) => <div ref={ref} />}</Reference>
        </ManagerContext.Provider>
      </div>
    );
    expect(setReferenceNode).toHaveBeenCalled();
  });

  it('warns when setReferenceNode is present', () => {
    const setReferenceNode = jest.fn();

    // HACK: wrapping DIV needed to make Enzyme happy for now
    mount(
      <div>
        <ManagerContext.Provider
          value={{
            setReferenceNode,
            referenceNode: undefined,
          }}
        >
          <Reference>{({ ref }) => <div ref={ref} />}</Reference>
        </ManagerContext.Provider>
      </div>
    );
    expect(warning).toHaveBeenCalledWith(
      true,
      '`Reference` should not be used outside of a `Manager` component.'
    );
  });

  it('does not warn when setReferenceNode is not present', () => {
    // HACK: wrapping DIV needed to make Enzyme happy for now
    mount(
      <div>
        <ManagerContext.Provider
          value={{
            referenceNode: undefined,
          }}
        >
          <Reference>{({ ref }) => <div ref={ref} />}</Reference>
        </ManagerContext.Provider>
      </div>
    );
    expect(warning).toHaveBeenCalledWith(
      false,
      '`Reference` should not be used outside of a `Manager` component.'
    );
  });
});
