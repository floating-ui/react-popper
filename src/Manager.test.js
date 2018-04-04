// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Manager } from '.';

// Private API
import { ManagerContext } from './Manager';

describe('Manager component', () => {
  it('renders the expected markup', () => {
    const wrapper = mount(
      <Manager>
        <div id="target" />
        <div id="popper" />
      </Manager>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('provides the related context', () => {
    const Target = () => null;
    const referenceNode = document.createElement('div');

    const wrapper = mount(
      <Manager>
        <ManagerContext.Consumer>
          {({ getReferenceRef, referenceNode }) => (
            <Target
              getReferenceRef={getReferenceRef}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </Manager>
    );

    wrapper.find(Target).prop('getReferenceRef')(referenceNode);
    wrapper.update();
    expect(wrapper.find(Target).prop('referenceNode')).toBe(referenceNode);
  });
});

describe('TargetNodeContext', () => {
  it('provides proper default values', () => {
    const Target = () => null;
    const wrapper = mount(
      <div>
        <ManagerContext.Consumer>
          {({ getReferenceRef, referenceNode }) => (
            <Target
              getReferenceRef={getReferenceRef}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </div>
    );

    expect(wrapper.find(Target).prop('getReferenceRef')).toBeUndefined();
  });
});
