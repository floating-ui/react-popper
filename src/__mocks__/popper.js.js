import PopperJs from 'popper.js';

export default class Popper {
  static placements = PopperJs.placements;

  state = {
    isDestroyed: false,
  };

  constructor() {
    return {
      state: this.state,
      destroy: () => (this.state.isDestroyed = true),
      scheduleUpdate: () => {},
    };
  }
}
