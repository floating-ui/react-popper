// @flow
import React from 'react';
import { mount } from 'enzyme';

// Public API
import { Manager, Popper, Reference } from '.';

import { InnerPopper } from './Popper';

// Private API
import { ManagerReferenceNodeContext, ManagerReferenceNodeSetterContext } from './Manager';

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
        <ManagerReferenceNodeSetterContext.Consumer>
          {(setReferenceNode) => (
            <ManagerReferenceNodeContext.Consumer>
              {(referenceNode) => (
                <Reference
                  setReferenceNode={setReferenceNode}
                  referenceNode={referenceNode}
                />
              )}
            </ManagerReferenceNodeContext.Consumer>
          )}
        </ManagerReferenceNodeSetterContext.Consumer>
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

  it('updates the referenceNode if setReferenceNode is called with a new value', () => {
    let referenceElement;
    let ReferenceComp = ({ innerRef }) => (
      <div
        ref={node => {
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

    expect(wrapper.instance().referenceNode).toBe(referenceElement);
    wrapper.instance().componentWillUnmount()
    expect(wrapper.instance().referenceNode).toBeNull();
  });
});

describe('ReferenceNodeContext', () => {
  it('provides proper default values', () => {
    const Reference = () => null;
    const wrapper = mount(
      <div>
        <ManagerReferenceNodeSetterContext.Consumer>
          {(setReferenceNode) => (
            <ManagerReferenceNodeContext.Consumer>
              {(referenceNode) => (
                <Reference
                  setReferenceNode={setReferenceNode}
                  referenceNode={referenceNode}
                />
              )}
            </ManagerReferenceNodeContext.Consumer>
          )}
        </ManagerReferenceNodeSetterContext.Consumer>
      </div>
    );

    expect(wrapper.find(Reference).prop('setReferenceNode')).toBeUndefined();
  });
});
