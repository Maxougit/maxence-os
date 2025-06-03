import { isMobileDevice } from './device';

describe('isMobileDevice', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  });

  test('returns true for width <= 768', () => {
    window.innerWidth = 768;
    expect(isMobileDevice()).toBe(true);
    window.innerWidth = 600;
    expect(isMobileDevice()).toBe(true);
  });

  test('returns false for width > 768', () => {
    window.innerWidth = 769;
    expect(isMobileDevice()).toBe(false);
    window.innerWidth = 1024;
    expect(isMobileDevice()).toBe(false);
  });
});
