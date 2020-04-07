// @flow
import { useLayoutEffect, useRef, useState, useMemo } from 'react';
import {
  createPopper as defaultCreatePopper,
  type Options as PopperOptions,
  type VirtualElement,
} from '@popperjs/core';

type Options = $Shape<{
  ...PopperOptions,
  createPopper: typeof defaultCreatePopper,
}>;

type State = {
  styles: {
    [key: string]: $Shape<CSSStyleDeclaration>,
  },
  attributes: {
    [key: string]: { [key: string]: string | boolean },
  },
};

export const usePopper = (
  referenceElement: ?(Element | VirtualElement),
  popperElement: ?HTMLElement,
  options: Options = {}
) => {
  const popperOptions = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const { createPopper, ...popperOptions } = options;
    return {
      ...popperOptions,
      placement: popperOptions.placement || 'bottom',
      strategy: popperOptions.strategy || 'absolute',
    };
  }, [options]);

  const popperInstanceRef = useRef();
  const [state, setState] = useState<State>({
    styles: {
      popper: { position: popperOptions.strategy, left: '0', top: '0' },
    },
    attributes: {},
  });
  const createPopper = useMemo(
    () => options.createPopper || defaultCreatePopper,
    [options.createPopper]
  );

  const updateStateModifier = useMemo(
    () => ({
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: ({ state }) => {
        const elements = Object.keys(state.elements);

        setState({
          styles: Object.fromEntries(
            elements.map((element) => [element, state.styles[element] || {}])
          ),
          attributes: Object.fromEntries(
            elements.map((element) => [element, state.attributes[element]])
          ),
        });
      },
      requires: ['computeStyles'],
    }),
    [setState]
  );

  useLayoutEffect(() => {
    let popperInstance = null;
    if (referenceElement != null && popperElement != null) {
      popperInstance = createPopper(referenceElement, popperElement, {
        ...popperOptions,
        modifiers: [
          ...popperOptions.modifiers,
          updateStateModifier,
          { name: 'applyStyles', enabled: false },
        ],
      });

      popperInstanceRef.current = popperInstance;
    }

    return () => {
      popperInstance != null && popperInstance.destroy();
    };
  }, [referenceElement, popperElement]);

  useLayoutEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);

  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current
      ? popperInstanceRef.current.forceUpdate
      : null,
  };
};

export default usePopper;
