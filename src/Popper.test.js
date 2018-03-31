// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Popper } from '.';

// Private API
import { Popper as InnerPopper } from './Popper';

describe('Popper component', () => {
  it('renders the expected markup', () => {
    const wrapper = mount(
      <Popper>
        {({ getPopperRef, style, placement }) => (
          <div ref={getPopperRef} style={style} data-placement={placement} />
        )}
      </Popper>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('initializes the Popper.js instance on first update', () => {
    const targetNode = document.createElement('div');
    const wrapper = mount(
      <InnerPopper targetNode={targetNode}>
        {({ getPopperRef, style, placement }) => (
          <div ref={getPopperRef} style={style} data-placement={placement} />
        )}
      </InnerPopper>
    );
    expect(wrapper.state('popperInstance')).toBeDefined();
  });

  it("doesn't update Popper.js instance on props update if not needed by Popper.js", () => {
    const targetNode = document.createElement('div');
    const wrapper = mount(
      <InnerPopper targetNode={targetNode}>
        {({ getPopperRef, style, placement }) => (
          <div ref={getPopperRef} style={style} data-placement={placement} />
        )}
      </InnerPopper>
    );
    const instance = wrapper.state('popperInstance');

    wrapper.setProps({ foo: 'bar' });

    expect(wrapper.state('popperInstance')).toBe(instance);
  });
});
