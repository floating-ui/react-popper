import PopperJs from 'popper.js';

export default class Popper {
  static placements = PopperJs.placements;

  state = {
    isDestroyed: false,
  };

  constructor(reference, popper, options = {}) {
    return {
      reference,
      popper,
      options: { ...Popper.Defaults, ...options },
      state: this.state,
      destroy: () => (this.state.isDestroyed = true),
      scheduleUpdate: () => {},
    };
  }
}
