import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';

beforeEach(() => {
  localStorage.setItem('agriaid_token', 'fake-jwt');
  vi.restoreAllMocks();
});

function mockFetch() {
  return vi.fn((url) => {
    if (url.includes('/profile')) {
      return Promise.resolve({ ok: true, json: async () => ({ id: 'u1', name: 'Meera Sharma', role: 'farmer', region: 'Gonda, UP' }) });
    }
    if (url.includes('/bookings')) {
      return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
    }
    if (url.includes('/resources')) {
      return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
}

describe('Dashboard', () => {
  it('greets the farmer by first name and shows quick stats', async () => {
    vi.stubGlobal('fetch', mockFetch());

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/meera/i)).toBeInTheDocument();
    expect(screen.getByText(/active bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/ready when you are/i)).toBeInTheDocument();
  });
});
