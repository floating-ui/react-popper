// @flow strict
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Global, css } from '@emotion/react';
import { Transition } from 'react-spring/renderprops';
import { Manager, Reference, Popper } from '../src';
import {
  Main,
  ReferenceBox,
  ClickableReferenceBox,
  PoppersContainer,
  TransitionedPopperBox,
  PopperBox,
  Arrow,
  PopperDot,
} from './styles';

const Null = () => null;

const placements = ['top', 'right', 'bottom', 'left'];

const modifiers = [
  {
    name: 'flip',
    enabled: false,
  },
  {
    name: 'hide',
    enabled: false,
  },
];

const popperModifiers = [
  ...modifiers,
  {
    name: 'arrow',
    options: {
      padding: 5,
    },
  },
  {
    name: 'offset',
    options: {
      offset: [0, 14],
    },
  },
];

const dotModifiers = [
  ...modifiers,
  {
    name: 'offset',
    options: {
      offset: [0, 56],
    },
  },
];

const mainModifiers = [
  ...popperModifiers,
  // We can't use adaptive styles with CSS transitions
  {
    name: 'computeStyles',
    options: {
      adaptive: false,
    },
  },
];

const animatedModifiers = [
  ...popperModifiers,
  // We disable the built-in gpuAcceleration so that
  // Popper.js will return us easy to interpolate values
  // (top, left instead of transform: translate3d)
  // We'll then use these values to generate the needed
  // css transform values blended with the react-spring values
  {
    name: 'computeStyles',
    options: {
      gpuAcceleration: false,
    },
  },
];

const Demo = () => {
  const [activePlacement, setActivePlacement] = useState(
    placements[Math.floor(Math.random() * placements.length)]
  );
  const [isPopper2Open, togglePopper2] = useState(false);

  return (
    <>
      <Global
        styles={css`
          *,
          *:before,
          *:after {
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
          }

          html,
          body {
            margin: 0;
            background-color: #171d23;
            font-family: Lato, sans-serif;
          }

          a {
            color: white;
          }
        `}
      />

      <Main gradient="purple">
        <Manager>
          <Reference>
            {({ ref }) => (
              <ReferenceBox ref={ref}>
                <a
                  href="https://github.com/FezVrasta/react-popper"
                  target="_blank"
                >
                  react-popper
                </a>
              </ReferenceBox>
            )}
          </Reference>
          <PoppersContainer>
            <Popper placement={activePlacement} modifiers={mainModifiers}>
              {({ ref, style, placement, arrowProps }) => (
                <TransitionedPopperBox ref={ref} style={style}>
                  {placement}
                  <Arrow
                    ref={arrowProps.ref}
                    data-placement={placement}
                    style={arrowProps.style}
                  />
                </TransitionedPopperBox>
              )}
            </Popper>
            {placements
              .filter((p) => p !== activePlacement)
              .map((p) => (
                <Popper placement={p} key={p} modifiers={dotModifiers}>
                  {({ ref, style }) => (
                    <PopperDot
                      ref={ref}
                      style={style}
                      onClick={() => setActivePlacement(p)}
                      title={p}
                    />
                  )}
                </Popper>
              ))}
          </PoppersContainer>
        </Manager>
      </Main>
      <Main gradient="orange">
        <Manager>
          <Reference>
            {({ ref }) => (
              <ClickableReferenceBox
                tabIndex={0}
                ref={ref}
                onClick={() => togglePopper2(!isPopper2Open)}
              >
                Click to toggle
              </ClickableReferenceBox>
            )}
          </Reference>
          <Transition
            items={isPopper2Open}
            from={{ opacity: 0, rotation: '180deg', scale: 0.5, top: -20 }}
            enter={{ opacity: 1, rotation: '0deg', scale: 1, top: 0 }}
            leave={{ opacity: 0, rotation: '180deg', scale: 0.5, top: -20 }}
          >
            {(show) =>
              show
                ? ({ rotation, scale, opacity, top: topOffset }) => (
                    <Popper placement="bottom" modifiers={animatedModifiers}>
                      {({
                        ref,
                        style: { top, left, position },
                        placement,
                        arrowProps,
                      }) => (
                        <PopperBox
                          innerRef={ref}
                          style={{
                            opacity,
                            top: 0,
                            left: 0,
                            position,
                            padding: '1em',
                            width: '10em',
                            transform: `translate3d(${left}, ${
                              parseInt(top) + topOffset
                            }px, 0) scale(${scale}) rotate(${rotation})`,
                            transformOrigin: 'top center',
                          }}
                        >
                          <a
                            href="https://github.com/drcmda/react-spring"
                            target="_blank"
                          >
                            react-spring
                          </a>
                          animated
                          <Arrow
                            innerRef={arrowProps.ref}
                            data-placement={placement}
                            style={arrowProps.style}
                          />
                        </PopperBox>
                      )}
                    </Popper>
                  )
                : Null
            }
          </Transition>
        </Manager>
      </Main>
    </>
  );
};

const rootNode = document.querySelector('#root');

rootNode && ReactDOM.render(<Demo />, rootNode);
