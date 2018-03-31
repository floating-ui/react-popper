// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Arrow } from '.';

// Private API
import { ArrowNodeContext } from './Popper';

describe('Arrow component', () => {
  it('renders the expected markup', () => {
    const wrapper = mount(
      <Arrow>
        {({ getArrowRef, style }) => <div ref={getArrowRef} style={style} />}
      </Arrow>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('consumes the ArrowNodeContext from Popper', () => {
    const setArrowNode = jest.fn();
    const arrowStyle = { top: 10 };

    // HACK: wrapping DIV needed to make Enzyme happy for now
    const wrapper = mount(
      <div>
        <ArrowNodeContext.Provider
          value={{
            setArrowNode,
            arrowNode: null,
            arrowStyle,
          }}
        >
          <Arrow>
            {({ getArrowRef, style }) => (
              <div ref={getArrowRef} style={style} />
            )}
          </Arrow>
        </ArrowNodeContext.Provider>
      </div>
    );
    expect(setArrowNode).toHaveBeenCalled();
    expect(wrapper.children()).toMatchSnapshot();
  });
});
