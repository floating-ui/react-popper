import PopperJs from 'popper.js';

export default class Popper {
  static placements = PopperJs.placements;

  state = {
    isDestroyed: false,
  };

  constructor(reference, popper, options = {}) {
    const modifiers = Object.keys(options.modifiers)
      .map(name => ({
        name,
        ...options.modifiers[name],
      }))
      .sort((a, b) => a.order - b.order);

    const update = () => {
      const data = {
        placement: options.placement,
        arrowStyles: {},
        offsets: {
          popper: {
            position: 'absolute',
          },
          reference: {},
        },
      };
      modifiers.forEach(m => {
        if (m.enabled && m.fn) {
          m.fn(data, m);
        }
      });
    };
    update();

    return {
      reference,
      popper,
      options: { ...Popper.Defaults, ...options },
      state: this.state,
      destroy: () => (this.state.isDestroyed = true),
      scheduleUpdate: () => {
        update();
      },
    };
  }
}
