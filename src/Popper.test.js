// @flow
import React from 'react';
import { mount } from 'enzyme';

// Private API
import { InnerPopper } from './Popper';

const mountPopper = props =>
  mount(
    <InnerPopper {...props}>
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <div {...arrowProps} />
        </div>
      )}
    </InnerPopper>
  );

describe('Popper component', () => {
  it('renders the expected markup', () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('initializes the Popper.js instance on first update', () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement });
    expect(wrapper.instance().popperInstance).toBeDefined();
  });

  it("doesn't update Popper.js instance on props update if not needed by Popper.js", () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement, placement: 'bottom' });
    const instance = wrapper.instance().popperInstance;

    expect(instance).toBeDefined();

    wrapper.setProps({ placement: 'bottom' });

    expect(wrapper.instance().popperInstance).toBe(instance);
  });

  it('updates Popper.js on explicitly listed props change', () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.instance().popperInstance;
    wrapper.setProps({ placement: 'top' });
    wrapper.update();
    expect(wrapper.instance().popperInstance).not.toBe(instance);
  });

  it('does not update Popper.js on generic props change', () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.instance().popperInstance;
    wrapper.setProps({ foo: 'bar' });
    wrapper.update();
    expect(wrapper.instance().popperInstance).toBe(instance);
  });

  it('destroys Popper.js instance on unmount', () => {
    const referenceElement = document.createElement('div');
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.instance().popperInstance;
    wrapper.unmount();
    expect(instance.state.isDestroyed).toBe(true);
  });

  it('handles changing refs gracefully', () => {
    const referenceElement = document.createElement('div');
    expect(() =>
      mount(
        <InnerPopper referenceElement={referenceElement}>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={current => ref(current)}
              style={style}
              data-placement={placement}
            >
              <div {...arrowProps} ref={current => arrowProps.ref(current)} />
            </div>
          )}
        </InnerPopper>
      )
    ).not.toThrow();
  });

  it('accepts a `referenceElement` property', () => {
    class VirtualReference {
      getBoundingClientRect() {
        return {
          top: 10,
          left: 10,
          bottom: 20,
          right: 100,
          width: 90,
          height: 10,
        };
      }

      get clientWidth() {
        return this.getBoundingClientRect().width;
      }

      get clientHeight() {
        return this.getBoundingClientRect().height;
      }
    }

    const virtualReferenceElement = new VirtualReference();
    const wrapper = mountPopper({ referenceElement: virtualReferenceElement });

    expect(wrapper.instance().popperInstance.reference).toBe(
      virtualReferenceElement
    );
  });

  it(`should render twice when placement is changed`, () => {
    const referenceElement = document.createElement('div');
    let renderCounter = 0;
    const wrapper = mount(
      <InnerPopper placement="top" referenceElement={referenceElement}>
        {({ ref, style, placement }) => {
          renderCounter++;
          return <div ref={ref} style={style} data-placement={placement} />;
        }}
      </InnerPopper>
    );
    expect(renderCounter).toBe(2);
    renderCounter = 0;

    wrapper.setProps({ placement: 'bottom' });
    expect(renderCounter).toBe(2);
  });
});
