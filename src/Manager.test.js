// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Manager, Popper, Reference } from '.';

import { InnerPopper } from './Popper';

// Private API
import { ManagerContext } from './Manager';

describe('Manager component', () => {
  it('renders the expected markup', () => {
    const wrapper = mount(
      <Manager>
        <div id="reference" />
        <div id="popper" />
      </Manager>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('provides the related context', () => {
    const Reference = () => null;
    const referenceNode = document.createElement('div');

    const wrapper = mount(
      <Manager>
        <ManagerContext.Consumer>
          {({ setReferenceNode, referenceNode }) => (
            <Reference
              setReferenceNode={setReferenceNode}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </Manager>
    );

    wrapper.find(Reference).prop('setReferenceNode')(referenceNode);
    wrapper.update();
    expect(wrapper.find(Reference).prop('referenceNode')).toBe(referenceNode);
  });
});

describe('Managed Reference', () => {
  it('If passed a referenceElement prop value, uses the referenceElement prop value', () => {
    const element = document.createElement('div');
    const wrapper = mount(
      <Manager>
        <Reference>{({ ref }) => <div ref={ref}>hello</div>}</Reference>
        <Popper referenceElement={element}>{() => null}</Popper>
      </Manager>
    );
    const PopperInstance = wrapper.find(InnerPopper);
    expect(PopperInstance.prop('referenceElement')).toBe(element);
  });
  it('If the referenceElement prop is undefined, use the referenceNode from context', () => {
    let referenceElement;
    let ReferenceComp = ({ innerRef }) => (
      <div
        ref={node => {
          // We just want to invoke this once so that we have access to the referenceElement in the upper scope.
          if (referenceElement) return;
          innerRef(node);
          referenceElement = node;
        }}
      >
        hello
      </div>
    );
    const wrapper = mount(
      <Manager>
        <Reference>{({ ref }) => <ReferenceComp innerRef={ref} />}</Reference>
        <Popper referenceElement={undefined}>{() => null}</Popper>
      </Manager>
    );
    const PopperInstance = wrapper.find(InnerPopper);
    expect(PopperInstance.prop('referenceElement')).toBe(referenceElement);
  });

  it('cleans up the referenceNode in context when unmounted', () => {
    let referenceElement;
    let ReferenceComp = ({ innerRef }) => (
      <div
        ref={node => {
          // We just want to invoke this once so that we have access to the referenceElement in the upper scope.
          if (referenceElement) return;
          innerRef(node);
          referenceElement = node;
        }}
      >
        hello
      </div>
    );
    const wrapper = mount(
      <Manager>
        <Reference>{({ ref }) => <ReferenceComp innerRef={ref} />}</Reference>
        <Popper referenceElement={undefined}>{() => null}</Popper>
      </Manager>
    );

    expect(wrapper.instance().contextObj.referenceNode).toBe(referenceElement);
    wrapper.instance().componentWillUnmount();
    expect(wrapper.instance().contextObj.referenceNode).toBeNull();
  });
});

describe('ReferenceNodeContext', () => {
  it('provides proper default values', () => {
    const Reference = () => null;
    const wrapper = mount(
      <div>
        <ManagerContext.Consumer>
          {({ setReferenceNode, referenceNode }) => (
            <Reference
              setReferenceNode={setReferenceNode}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </div>
    );

    expect(wrapper.find(Reference).prop('setReferenceNode')).toBeUndefined();
  });
});
