// @flow
import * as React from 'react';
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
  const [state, setState] = React.useState<State>({
    styles: {
      popper: { position: options.strategy, left: '0', top: '0' },
    },
    attributes: {},
  });

  const updateStateModifier = React.useMemo(
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

  const popperOptions = React.useMemo(() => {
    return {
      onFirstUpdate: options.onFirstUpdate,
      placement: options.placement || 'bottom',
      strategy: options.strategy || 'absolute',
      modifiers: [
        ...options.modifiers,
        updateStateModifier,
        { name: 'applyStyles', enabled: false },
      ],
    };
  }, [options, updateStateModifier]);

  const popperInstanceRef = React.useRef();
  const createPopper = React.useMemo(
    () => options.createPopper || defaultCreatePopper,
    [options.createPopper]
  );

  React.useLayoutEffect(() => {
    let popperInstance = null;
    if (referenceElement != null && popperElement != null) {
      popperInstance = createPopper(
        referenceElement,
        popperElement,
        popperOptions
      );

      popperInstanceRef.current = popperInstance;
    }

    return () => {
      popperInstance != null && popperInstance.destroy();
      popperInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceElement, popperElement, createPopper]);

  React.useLayoutEffect(() => {
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
