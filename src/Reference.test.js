// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Reference } from '.';

// Private API
import { ManagerContext } from './Manager';

describe('Arrow component', () => {
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
});
