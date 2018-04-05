// @flow
import React from "react";
import { mount } from "enzyme";

// Public API
import { Manager } from ".";

// Private API
import { ManagerContext } from "./Manager";

describe("Manager component", () => {
  it("renders the expected markup", () => {
    const wrapper = mount(
      <Manager>
        <div id="reference" />
        <div id="popper" />
      </Manager>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("provides the related context", () => {
    const Reference = () => null;
    const referenceNode = document.createElement("div");

    const wrapper = mount(
      <Manager>
        <ManagerContext.Consumer>
          {({ getReferenceRef, referenceNode }) => (
            <Reference
              getReferenceRef={getReferenceRef}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </Manager>
    );

    wrapper.find(Reference).prop("getReferenceRef")(referenceNode);
    wrapper.update();
    expect(wrapper.find(Reference).prop("referenceNode")).toBe(referenceNode);
  });
});

describe("ReferenceNodeContext", () => {
  it("provides proper default values", () => {
    const Reference = () => null;
    const wrapper = mount(
      <div>
        <ManagerContext.Consumer>
          {({ getReferenceRef, referenceNode }) => (
            <Reference
              getReferenceRef={getReferenceRef}
              referenceNode={referenceNode}
            />
          )}
        </ManagerContext.Consumer>
      </div>
    );

    expect(wrapper.find(Reference).prop("getReferenceRef")).toBeUndefined();
  });
});
