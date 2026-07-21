import React from 'react';
import { act, createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import Desktop from './Desktop';

jest.mock('../Application/SkillsHologram', () => function MockSkillsHologram() {
  return <div data-testid="skills-hologram" />;
});

const unlockDesktop = () => {
  render(<Desktop />);
  fireEvent.click(screen.getByRole('button', { name: 'Déverrouiller Maxence OS' }));
  act(() => jest.advanceTimersByTime(560));
};

const pressCommand = (key, options = {}) => {
  const event = createEvent.keyDown(window, {
    key,
    metaKey: true,
    cancelable: true,
    ...options,
  });
  fireEvent(window, event);
  return event;
};

describe('Desktop window management', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.cancelAnimationFrame = (id) => clearTimeout(id);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('keeps a window open when it is reopened during its closing animation', () => {
    unlockDesktop();

    pressCommand('o');
    expect(screen.getByRole('region', { name: 'CV Leroux Maxence.pdf' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fermer la fenêtre' }));
    pressCommand('o');
    act(() => jest.advanceTimersByTime(250));

    expect(screen.getByRole('region', { name: 'CV Leroux Maxence.pdf' })).toBeInTheDocument();
  });

  it('creates a distinct Finder window for every New Finder command', () => {
    unlockDesktop();

    for (let index = 0; index < 2; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Fichier' }));
      fireEvent.click(
        screen.getByRole('menuitem', { name: 'Nouvelle fenêtre Finder ⌘N' })
      );
    }

    expect(screen.getAllByRole('region', { name: 'MacBook de Maxence' })).toHaveLength(2);
  });

  it('handles the advertised window shortcuts and prevents browser defaults', () => {
    unlockDesktop();

    const newFinderEvent = pressCommand('n');
    expect(newFinderEvent.defaultPrevented).toBe(true);
    expect(screen.getAllByRole('region', { name: 'MacBook de Maxence' })).toHaveLength(1);

    const minimizeEvent = pressCommand('m');
    expect(minimizeEvent.defaultPrevented).toBe(true);
    act(() => jest.advanceTimersByTime(410));
    expect(screen.getByRole('region', { name: 'MacBook de Maxence' })).toHaveClass('hidden');

    pressCommand('n');
    const hideEvent = pressCommand('h');
    expect(hideEvent.defaultPrevented).toBe(true);
    act(() => jest.advanceTimersByTime(410));

    pressCommand('n');
    const closeEvent = pressCommand('w');
    expect(closeEvent.defaultPrevented).toBe(true);
    act(() => jest.advanceTimersByTime(220));
    expect(screen.getAllByRole('region', { name: 'MacBook de Maxence' })).toHaveLength(2);

    pressCommand('n');
    const quitEvent = pressCommand('q');
    expect(quitEvent.defaultPrevented).toBe(true);
    act(() => jest.advanceTimersByTime(220));
    expect(screen.queryByRole('region', { name: 'MacBook de Maxence' })).not.toBeInTheDocument();
  });

  it('keeps a compact five-app Dock on mobile', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 768px)' || query === '(hover: none)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    unlockDesktop();

    const dock = screen.getByRole('toolbar', { name: 'Dock' });
    const buttons = within(dock).getAllByRole('button');
    expect(buttons).toHaveLength(5);
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Finder',
      'Launchpad',
      'CV — Aperçu',
      'Me contacter',
      'Safari',
    ]);
  });
});
