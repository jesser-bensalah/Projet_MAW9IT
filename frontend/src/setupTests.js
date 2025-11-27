// Fichier: frontend/src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock pour window.alert
window.alert = vi.fn();

// Mock pour les animations
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  get() {
    return () => Promise.resolve();
  },
});