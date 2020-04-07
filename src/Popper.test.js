// @flow
import React from 'react';
import { mount } from 'enzyme';

// Private API
import Popper from './Popper';

const mountPopper = (props) =>
  new Promise((resolve) => {
    const wrapper = mount(
      <Popper onFirstUpdate={() => resolve(wrapper.update())} {...props}>
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement}>
            <div {...arrowProps} />
          </div>
        )}
      </Popper>
    );
  });

describe('Popper component', () => {
  it('renders the expected markup', async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({ referenceElement });
    expect(wrapper).toMatchSnapshot();
  });

  it.skip('initializes the Popper.js instance on first update', async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({ referenceElement });
    expect(wrapper.instance().popperInstance).toBeDefined();
  });

  it("doesn't update Popper.js instance on props update if not needed by Popper.js", async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({
      referenceElement,
      placement: 'bottom',
    });
    const instance = wrapper.instance().popperInstance;

    expect(instance).toBeDefined();

    wrapper.setProps({ placement: 'bottom' });

    expect(wrapper.instance().popperInstance).toBe(instance);
  });

  it.skip('updates Popper.js on explicitly listed props change', async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({ referenceElement });
    const instance = wrapper.instance().popperInstance;
    wrapper.setProps({ placement: 'top' });
    wrapper.update();
    expect(wrapper.instance().popperInstance).toBe(instance);

    await wrapper.instance().popperInstance.update();
    expect(wrapper.instance().popperInstance.state.placement).toBe('top');
  });

  it.skip('does not update Popper.js on generic props change', async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({ referenceElement });
    const instance = wrapper.instance().popperInstance;
    wrapper.setProps({ foo: 'bar' });
    wrapper.update();
    expect(wrapper.instance().popperInstance).toBe(instance);
  });

  it.skip('destroys Popper.js instance on unmount', async () => {
    const referenceElement = document.createElement('div');
    const wrapper = await mountPopper({ referenceElement });
    const component = wrapper.instance();
    wrapper.unmount();
    expect(component.popperInstance).toBeNull();
  });

  it('handles changing refs gracefully', () => {
    const referenceElement = document.createElement('div');
    expect(() =>
      mount(
        <Popper referenceElement={referenceElement}>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={(current) => ref(current)}
              style={style}
              data-placement={placement}
            >
              <div {...arrowProps} ref={(current) => arrowProps.ref(current)} />
            </div>
          )}
        </Popper>
      )
    ).not.toThrow();
  });

  it('accepts a ref function', () => {
    const myRef = jest.fn();
    const referenceElement = document.createElement('div');
    mount(
      <Popper referenceElement={referenceElement} innerRef={myRef}>
        {({ ref, style, placement }) => (
          <div ref={ref} style={style} data-placement={placement} />
        )}
      </Popper>
    );
    expect(myRef).toBeCalled();
  });

  it('accepts a ref object', () => {
    const myRef = React.createRef();
    const referenceElement = document.createElement('div');
    mount(
      <Popper referenceElement={referenceElement} innerRef={myRef}>
        {({ ref, style, placement }) => (
          <div ref={ref} style={style} data-placement={placement} />
        )}
      </Popper>
    );
    expect(myRef.current).toBeDefined();
  });

  it('accepts a `referenceElement` property', async () => {
    const virtualReferenceElement = {
      getBoundingClientRect(): any {
        return {
          top: 10,
          left: 10,
          bottom: 20,
          right: 100,
          width: 90,
          height: 10,
        };
      },
    };
    const wrapper = await mountPopper({
      referenceElement: virtualReferenceElement,
    });

    expect(wrapper.instance().popperInstance.state.elements.reference).toBe(
      virtualReferenceElement
    );
  });

  it(`should render 3 times when placement is changed`, async () => {
    const referenceElement = document.createElement('div');
    let renderCounter = 0;
    const wrapper = await new Promise((resolve) => {
      const wrapper = mount(
        <Popper
          placement="top"
          referenceElement={referenceElement}
          onFirstUpdate={() => resolve(wrapper.update())}
        >
          {({ ref, style, placement }) => {
            renderCounter++;
            return <div ref={ref} style={style} data-placement={placement} />;
          }}
        </Popper>
      );
    });
    expect(renderCounter).toBe(3);

    renderCounter = 0;
    wrapper.setProps({ placement: 'bottom' });
    await wrapper.instance().popperInstance.update();
    expect(renderCounter).toBe(3);
  });
});
