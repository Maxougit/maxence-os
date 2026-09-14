import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Window from './Windows';
import messages from '../../../messages/fr.json';

describe('déplacement des fenêtres', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // JSDOM ne fournit pas toujours PointerEvent ; les coordonnées sont celles
    // des événements souris dont il hérite dans le navigateur.
    window.PointerEvent = MouseEvent;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (callback) => setTimeout(callback, 16)
    );
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearTimeout);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function openWindow() {
    return render(
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Window title="Document"><p>Contenu</p></Window>
      </NextIntlClientProvider>
    );
  }

  it('applique la dernière position reçue avant une frame, y compris au relâchement', () => {
    openWindow();
    const region = screen.getByRole('region', { name: 'Document' });
    const initialX = parseFloat(region.style.left);
    const initialY = parseFloat(region.style.top);
    fireEvent.pointerDown(region.querySelector('header'), { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 110, clientY: 110 });
    fireEvent.pointerMove(window, { clientX: 180, clientY: 140 });
    fireEvent.pointerUp(window);
    act(() => jest.advanceTimersByTime(16));
    expect(parseFloat(region.style.left)).toBe(initialX + 80);
    expect(parseFloat(region.style.top)).toBe(initialY + 40);
  });

  it('annule la frame de déplacement lorsque la fenêtre est démontée', () => {
    const { unmount } = openWindow();
    const region = screen.getByRole('region', { name: 'Document' });
    fireEvent.pointerDown(region.querySelector('header'), { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 180, clientY: 140 });
    expect(jest.getTimerCount()).toBe(1);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
