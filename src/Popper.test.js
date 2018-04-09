// @flow
import React from "react";
import { mount } from "enzyme";

// Private API
import { InnerPopper } from "./Popper";

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

describe("Popper component", () => {
  it("renders the expected markup", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement });
    expect(wrapper).toMatchSnapshot();
  });

  it("initializes the Popper.js instance on first update", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement });
    expect(wrapper.state("popperInstance")).toBeDefined();
  });

  it("doesn't update Popper.js instance on props update if not needed by Popper.js", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement, placement: "bottom" });
    const instance = wrapper.state("popperInstance");

    wrapper.setProps({ placement: "bottom" });

    expect(wrapper.state("popperInstance")).toBe(instance);
  });

  it("updates Popper.js on explicitly listed props change", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.state("popperInstance");
    wrapper.setProps({ placement: "top" });
    wrapper.update();
    expect(wrapper.state("popperInstance")).not.toBe(instance);
  });

  it("does not update Popper.js on generic props change", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.state("popperInstance");
    wrapper.setProps({ foo: "bar" });
    wrapper.update();
    expect(wrapper.state("popperInstance")).toBe(instance);
  });

  it("destroys Popper.js instance on unmount", () => {
    const referenceElement = document.createElement("div");
    const wrapper = mountPopper({ referenceElement });
    const instance = wrapper.state("popperInstance");
    wrapper.unmount();
    expect(instance.state.isDestroyed).toBe(true);
  });

  it("accepts a `referenceElement` property", () => {
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

    expect(wrapper.state("popperInstance").reference).toBe(
      virtualReferenceElement
    );
  });
});
