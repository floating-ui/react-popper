// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Manager } from '.';

// Private API
import { TargetNodeContext, noop } from './Manager';

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
    const targetNode = document.createElement('div');

    const wrapper = mount(
      <Manager>
        <TargetNodeContext.Consumer>
          {({ setTargetNode, targetNode }) => (
            <Target setTargetNode={setTargetNode} targetNode={targetNode} />
          )}
        </TargetNodeContext.Consumer>
      </Manager>
    );

    wrapper.find(Target).prop('setTargetNode')(targetNode);
    wrapper.update();
    expect(wrapper.find(Target).prop('targetNode')).toBe(targetNode);
  });
});

describe('TargetNodeContext', () => {
  it('provides proper default values', () => {
    const Target = () => null;
    const wrapper = mount(
      <div>
        <TargetNodeContext.Consumer>
          {({ setTargetNode, targetNode }) => (
            <Target setTargetNode={setTargetNode} targetNode={targetNode} />
          )}
        </TargetNodeContext.Consumer>
      </div>
    );

    expect(wrapper.find(Target).prop('setTargetNode')).toBe(noop);
    expect(wrapper.find(Target).prop('setTargetNode')()).toBeUndefined();
  });
});
