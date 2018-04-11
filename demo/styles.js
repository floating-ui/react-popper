import styled, { keyframes } from 'react-emotion';

const gradients = {
  purple: 'linear-gradient(to right, #9d50bb, #6e48aa)',
  orange: 'linear-gradient(to right, #ff4e50, #f9d423)',
};

export const Main = styled('main')`
  overflow: hidden;
  min-height: 30em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: ${props => gradients[props.gradient]};
  color: #ffffff;
  clip-path: polygon(99% 1%, 99% 95%, 50% 99%, 1% 95%, 1% 1%, 50% 5%);
  &:first-child {
    clip-path: polygon(99% 2%, 99% 97%, 50% 100%, 1% 97%, 1% 2%);
  }
  &:last-child {
    height: calc(100vh - 0.5em);
    clip-path: polygon(99% 0%, 99% 98%, 50% 98%, 1% 98%, 1% 0%, 50% 3%);
  }
`;

export const ReferenceBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 10em;
  height: 6em;
  background-color: #ffffff;
  color: #000000;
  border-radius: 4px;
  z-index: 1;
  position: relative;

  a {
    color: #000000;
  }
`;

export const ClickableReferenceBox = styled(ReferenceBox)`
  cursor: pointer;
`;

export const PopperBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 6em;
  height: 6em;
  background-color: #232323;
  color: #ffffff;
  border-radius: 10px;
  margin: 0.9em;
  padding: 0.5em;
  text-align: center;
  ${props => props.popperStyle};
`;

export const TransitionedPopperBox = styled(PopperBox)`
  transition: all 0.2s ease-out;
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
export const PoppersContainer = styled('div')`
  opacity: 0;
  animation: ${fadeIn} 0.3s ease-in 0.5s forwards;
`;

export const pulse = keyframes`
  0%   { box-shadow: 0 0 0 rgba(0, 0, 0, .2); }
  50%  { box-shadow: 0 0 0 4px rgba(0, 0, 0, .2); }
  100% { box-shadow: 0 0 0 rgba(0, 0, 0, .2); }
`;

export const PopperDot = styled('button')`
  cursor: pointer;
  border: 0;
  font-size: inherit;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #232323;
  margin: 3.5em;
  animation: ${pulse} 2s ease infinite;
`;

export const Arrow = styled('div')`
  position: absolute;
  width: 3em;
  height: 3em;
  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -0.9em;
    width: 3em;
    height: 1em;
    &::before {
      border-width: 0 1.5em 1em 1.5em;
      border-color: transparent transparent #232323 transparent;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -0.9em;
    width: 3em;
    height: 1em;
    &::before {
      border-width: 1em 1.5em 0 1.5em;
      border-color: #232323 transparent transparent transparent;
    }
  }
  &[data-placement*='right'] {
    left: 0;
    margin-left: -0.9em;
    height: 3em;
    width: 1em;
    &::before {
      border-width: 1.5em 1em 1.5em 0;
      border-color: transparent #232323 transparent transparent;
    }
  }
  &[data-placement*='left'] {
    right: 0;
    margin-right: -0.9em;
    height: 3em;
    width: 1em;
    &::before {
      border-width: 1.5em 0 1.5em 1em;
      border-color: transparent transparent transparent#232323;
    }
  }
  &::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`;
