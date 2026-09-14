import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Notification from './Notification';
import messages from '../../../messages/fr.json';

describe('fermeture des notifications', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  function show(onDismiss) {
    return render(
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Notification appName="Finder" title="Information" body="Document prêt" onDismiss={onDismiss} />
      </NextIntlClientProvider>
    );
  }

  it('ne rappelle pas onDismiss si la fermeture manuelle croise la fermeture automatique', () => {
    const onDismiss = jest.fn();
    show(onDismiss);
    act(() => jest.advanceTimersByTime(7900));
    fireEvent.click(screen.getByRole('button'));
    act(() => jest.advanceTimersByTime(500));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('annule aussi la fin de l’animation au démontage', () => {
    const onDismiss = jest.fn();
    const { unmount } = show(onDismiss);
    fireEvent.click(screen.getByRole('button'));
    unmount();
    act(() => jest.advanceTimersByTime(9000));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
