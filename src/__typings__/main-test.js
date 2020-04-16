// @flow

// Please remember to update also the TypeScript test files that can
// be found under `/typings/tests` please. Thanks! 🤗

import React from 'react';
import { Manager, Reference, Popper, usePopper } from '..';
import type { Modifier, StrictModifiers } from '@popperjs/core';

export const Test = () => (
  <Manager>
    {/* $FlowExpectError: empty children */}
    <Reference />
    <Reference>{({ ref }) => <div ref={ref} />}</Reference>
    <Popper
      // $FlowExpectError: should be one of allowed placements
      placement="custom"
      placement="top"
      // $FlowExpectError: should be absolute or fixed
      strategy="custom"
      strategy="fixed"
      // $FlowExpectError: enabled should be boolean, order number
      modifiers={[{ name: 'flip', enabled: 'bar', order: 'foo' }]}
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

export const HookTest = () => {
  const [referenceElement, setReferenceElement] = React.useState<?Element>(
    null
  );
  const [popperElement, setPopperElement] = React.useState<?HTMLElement>(null);
  const [arrowElement, setArrowElement] = React.useState<?HTMLElement>(null);
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: 'arrow',
          options: { element: arrowElement },
        },
      ],
    }
  );

  usePopper(referenceElement, popperElement, {
    modifiers: [
      // $FlowExpectError: offset tuple accepts only numbers
      {
        name: 'offset',
        options: { offset: [0, ''] },
      },
    ],
  });

  Number(2 + null);

  type CustomModifier = $Shape<Modifier<'custom', { foo: boolean }>>;
  usePopper<StrictModifiers | CustomModifier>(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'custom',
        options: { foo: true },
      },
    ],
  });

  usePopper<StrictModifiers | CustomModifier>(
    referenceElement,
    popperElement,
    // $FlowExpectError: foo should be boolean
    {
      modifiers: [
        {
          name: 'custom',
          options: { foo: 'str' },
        },
      ],
    }
  );

  return (
    <>
      <button
        type="button"
        ref={setReferenceElement}
        onClick={() => {
          update && update();
        }}
      >
        Reference element
      </button>

      <div {...attributes.popper} ref={setPopperElement} style={styles.popper}>
        Popper element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};
