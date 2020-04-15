// @flow
import * as React from 'react';
import {
  createPopper as defaultCreatePopper,
  type VirtualElement,
  type Modifier,
  type OptionsGeneric,
  type StrictModifiers,
} from '@popperjs/core';
import isEqual from 'react-fast-compare';
import { fromEntries, useIsomorphicLayoutEffect } from './utils';

type Options<TModifiers> = $Shape<{
  ...OptionsGeneric<TModifiers>,
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

type UpdateStateModifier = Modifier<'updateState', {||}>;

const EMPTY_MODIFIERS = [];

export const usePopper = <
  TModifiers: StrictModifiers | $Shape<Modifier<string, {}>>
>(
  referenceElement: ?(Element | VirtualElement),
  popperElement: ?HTMLElement,
  options: Options<TModifiers> = {}
) => {
  type TExtendedModifier = TModifiers | $Shape<UpdateStateModifier>;

  const prevOptions = React.useRef<?OptionsGeneric<TExtendedModifier>>(null);

  const optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS,
  };

  const [state, setState] = React.useState<State>({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: '0',
        top: '0',
      },
    },
    attributes: {},
  });

  const updateStateModifier = React.useMemo<UpdateStateModifier>(
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
    []
  );

  const popperOptions = React.useMemo<OptionsGeneric<TExtendedModifier>>(() => {
    const newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [
        ...optionsWithDefaults.modifiers,
        updateStateModifier,
        { name: 'applyStyles', enabled: false },
      ],
    };

    if (
      prevOptions.current != null &&
      isEqual(prevOptions.current, newOptions)
    ) {
      return prevOptions.current;
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

  useIsomorphicLayoutEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);

  useIsomorphicLayoutEffect(() => {
    if (referenceElement == null || popperElement == null) {
      return;
    }

    const createPopper = options.createPopper || defaultCreatePopper;
    const popperInstance = createPopper(
      referenceElement,
      popperElement,
      popperOptions
    );

    popperInstanceRef.current = popperInstance;

    return () => {
      popperInstance.destroy();
      popperInstanceRef.current = null;
    };
  }, [referenceElement, popperElement, options.createPopper]);

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
