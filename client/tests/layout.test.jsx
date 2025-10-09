import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

const resizeObservers = [];

class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    resizeObservers.push(this);
  }

  observe(target) {
    this.target = target;
  }

  disconnect() {
    // noop for the mock
  }
}

beforeEach(() => {
  global.ResizeObserver = ResizeObserverMock;
  window.ResizeObserver = ResizeObserverMock;
});

afterEach(() => {
  resizeObservers.length = 0;
  // Vitest resets jsdom between tests, but we ensure cleanup.
  delete global.ResizeObserver;
  delete window.ResizeObserver;
});

describe('layout spacing', () => {
  it('applies sticky offsets so the score bar does not overlap the header', async () => {
    const { container } = render(<App />);
    const app = container.querySelector('.app');
    const header = container.querySelector('.app-header');
    const scoreBar = container.querySelector('.score-bar');

    expect(app?.dataset.layout).toBe('grid-rows');
    expect(header).not.toBeNull();
    expect(scoreBar).not.toBeNull();

    header.getBoundingClientRect = vi.fn(() => ({
      width: 0,
      height: 120,
      top: 0,
      left: 0,
      right: 0,
      bottom: 120,
    }));
    scoreBar.getBoundingClientRect = vi.fn(() => ({
      width: 0,
      height: 56,
      top: 0,
      left: 0,
      right: 0,
      bottom: 56,
    }));

    resizeObservers.forEach((observer) => {
      if (observer.target) {
        observer.callback([{ target: observer.target }]);
      }
    });

    await waitFor(() => {
      expect(app.style.getPropertyValue('--header-height')).toBe('120px');
      expect(app.style.getPropertyValue('--scorebar-height')).toBe('56px');
    });

    const scoreStatus = screen.getByRole('status', { name: /marcador de progreso/i });
    expect(scoreStatus).toBe(scoreBar);
  });
});
