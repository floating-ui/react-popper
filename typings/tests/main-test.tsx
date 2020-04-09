// Please remember to update also the Flow test files that can
// be found under `/src/__typings__` please. Thanks! 🤗

import * as React from 'react';
import { Manager, Reference, Popper, usePopper } from '../..';

export const Test = () => (
  <Manager>
    <Reference>{({ ref }) => <div ref={ref} />}</Reference>
    <Popper
      placement="top"
      strategy="fixed"
      modifiers={[{ name: 'flip', enabled: false }]}
    >
      {({
        ref,
        style,
        placement,
        isReferenceHidden,
        hasPopperEscaped,
        update,
        arrowProps,
      }) => (
        <div
          ref={ref}
          style={{
            ...style,
            opacity: isReferenceHidden || hasPopperEscaped ? 0 : 1,
          }}
          data-placement={placement}
          onClick={() => update()}
        >
          Popper
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
    <Popper>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper
        </div>
      )}
    </Popper>
  </Manager>
);

const HookTest = () => {
  const [
    referenceElement,
    setReferenceElement,
  ] = React.useState<Element | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <>
      <button type="button" ref={setReferenceElement}>
        Reference element
      </button>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};
