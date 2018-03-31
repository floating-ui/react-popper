// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Target } from '.';

// Private API
import { TargetNodeContext } from './Manager';

describe('Arrow component', () => {
  it('renders the expected markup', () => {
    const wrapper = mount(
      <Target>{({ getTargetRef }) => <div ref={getTargetRef} />}</Target>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('consumes the ArrowNodeContext from Popper', () => {
    const setTargetNode = jest.fn();

    // HACK: wrapping DIV needed to make Enzyme happy for now
    const wrapper = mount(
      <div>
        <TargetNodeContext.Provider
          value={{
            setTargetNode,
            targetNode: null,
          }}
        >
          <Target>{({ getTargetRef }) => <div ref={getTargetRef} />}</Target>
        </TargetNodeContext.Provider>
      </div>
    );
    expect(setTargetNode).toHaveBeenCalled();
  });
});
