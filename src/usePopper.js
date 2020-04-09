// @flow
import * as React from 'react';
import {
  createPopper as defaultCreatePopper,
  type Options as PopperOptions,
  type VirtualElement,
} from '@popperjs/core';
import isEqual from 'react-fast-compare';
import { fromEntries, useIsomorphicLayoutEffect } from './utils';

type Options = $Shape<{
  ...PopperOptions,
  createPopper: typeof defaultCreatePopper,
}>;

type State = {
  styles: {
    [key: string]: $Shape<CSSStyleDeclaration>,
  },
  attributes: {
    [key: string]: { [key: string]: string },
  },
};

const EMPTY_MODIFIERS = [];

export const usePopper = (
  referenceElement: ?(Element | VirtualElement),
  popperElement: ?HTMLElement,
  options: Options = {}
) => {
  const prevOptions = React.useRef<?PopperOptions>(null);

  const optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS,
  };

  const [state, setState] = React.useState<State>({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy || 'absolute',
        left: '0',
        top: '0',
      },
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
          styles: fromEntries(
            elements.map((element) => [element, state.styles[element] || {}])
          ),
          attributes: fromEntries(
            elements.map((element) => [element, state.attributes[element]])
          ),
        });
      },
      requires: ['computeStyles'],
    }),
    [setState]
  );

  const popperOptions = React.useMemo(() => {
    const newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement || 'bottom',
      strategy: optionsWithDefaults.strategy || 'absolute',
      modifiers: [
        ...optionsWithDefaults.modifiers,
        updateStateModifier,
        { name: 'applyStyles', enabled: false },
      ],
    };

    if (isEqual(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    } else {
      prevOptions.current = newOptions;
      return newOptions;
    }
  }, [
    optionsWithDefaults.onFirstUpdate,
    optionsWithDefaults.placement,
    optionsWithDefaults.strategy,
    optionsWithDefaults.modifiers,
    updateStateModifier,
  ]);

  const popperInstanceRef = React.useRef();
  const createPopper = React.useMemo(
    () => options.createPopper || defaultCreatePopper,
    [options.createPopper]
  );

  useIsomorphicLayoutEffect(() => {
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

  useIsomorphicLayoutEffect(() => {
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
