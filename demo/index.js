// @flow
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'react-emotion';
import { compose, withState } from 'recompose';
import { Transition } from 'react-spring';
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

injectGlobal`
  *, *:before, *:after {
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
  }

  html, body {
    margin: 0;
    background-color: #171d23;
    font-family: Lato, sans-serif;
  }

  a {
    color: white;
  }
`;

const Null = () => null;

const placements = ['top', 'right', 'bottom', 'left'];

const enhance = compose(
  withState(
    'activePlacement',
    'setActivePlacement',
    placements[Math.floor(Math.random() * placements.length)]
  ),
  withState('isPopper2Open', 'togglePopper2', false)
);

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
};

const Demo = enhance(
  ({ activePlacement, setActivePlacement, isPopper2Open, togglePopper2 }) => (
    <Fragment>
      <Main gradient="purple">
        <Manager>
          <Reference>
            {({ ref }) => (
              <ReferenceBox innerRef={ref}>
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
            <Popper placement={activePlacement} modifiers={modifiers}>
              {({ ref, style, placement, arrowProps }) => (
                <TransitionedPopperBox innerRef={ref} style={style}>
                  {placement}
                  <Arrow
                    innerRef={arrowProps.ref}
                    data-placement={placement}
                    style={arrowProps.style}
                  />
                </TransitionedPopperBox>
              )}
            </Popper>
            {placements.filter(p => p !== activePlacement).map(p => (
              <Popper placement={p} key={p} modifiers={modifiers}>
                {({ ref, style }) => (
                  <PopperDot
                    innerRef={ref}
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
                innerRef={ref}
                onClick={() => togglePopper2(!isPopper2Open)}
              >
                Click to toggle
              </ClickableReferenceBox>
            )}
          </Reference>
          <Transition
            from={{ opacity: 0, rotation: '180deg', scale: 0.5, top: -20 }}
            enter={{ opacity: 1, rotation: '0deg', scale: 1, top: 0 }}
            leave={{ opacity: 0, rotation: '180deg', scale: 0.5, top: -20 }}
          >
            {isPopper2Open
              ? ({ rotation, scale, opacity, top: topOffset }) => (
                  <Popper
                    placement="bottom"
                    modifiers={{
                      ...modifiers,
                      // We disable the built-in gpuAcceleration so that
                      // Popper.js will return us easy to interpolate values
                      // (top, left instead of transform: translate3d)
                      // We'll then use these values to generate the needed
                      // css tranform values blended with the react-spring values
                      computeStyle: { gpuAcceleration: false },
                    }}
                  >
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
                          transform: `translate3d(${left}px, ${top +
                            topOffset}px, 0) scale(${scale}) rotate(${rotation})`,
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
              : Null}
          </Transition>
        </Manager>
      </Main>
    </Fragment>
  )
);

const rootNode = document.querySelector('#root');

rootNode && ReactDOM.render(<Demo />, rootNode);
