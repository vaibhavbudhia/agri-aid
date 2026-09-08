import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ResourceSearch from '../pages/ResourceSearch';

beforeEach(() => {
  localStorage.setItem('agriaid_token', 'fake-jwt');
  vi.restoreAllMocks();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <ResourceSearch />
    </MemoryRouter>
  );
}

describe('ResourceSearch', () => {
  it('lists resources returned by the backend for a farmer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        if (url.includes('/profile')) return Promise.resolve({ ok: true, json: async () => ({ id: 'u1', role: 'farmer' }) });
        return Promise.resolve({
          ok: true,
          json: async () => ({
            results: [
              { id: '1', type: 'tractor', description: 'Mahindra 575', usage_charge: '1200.00', provider_name: 'Vaibhav', provider_region: 'Punjab' },
            ],
          }),
        });
      })
    );

    renderPage();

    expect(await screen.findByText('tractor')).toBeInTheDocument();
    expect(screen.getByText(/Mahindra 575/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
    // A farmer has no "list a resource" button -- that needs a provider account.
    expect(screen.queryByRole('button', { name: /list a resource/i })).not.toBeInTheDocument();
  });

  it('shows an empty state with no resources', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        if (url.includes('/profile')) return Promise.resolve({ ok: true, json: async () => ({ id: 'u1', role: 'farmer' }) });
        return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
      })
    );
    renderPage();
    expect(await screen.findByText(/no resources listed yet/i)).toBeInTheDocument();
  });

  it('lets a provider list a resource, posting to /resources', async () => {
    let resourcesCreated = false;
    const fetchMock = vi.fn((url, opts = {}) => {
      if (url.includes('/profile')) {
        return Promise.resolve({ ok: true, json: async () => ({ id: 'p1', role: 'provider' }) });
      }
      if (url.includes('/resources') && opts.method === 'POST') {
        resourcesCreated = true;
        return Promise.resolve({ ok: true, json: async () => ({ id: 'new', type: 'pump' }) });
      }
      if (url.includes('/resources')) {
        return Promise.resolve({ ok: true, json: async () => ({ results: resourcesCreated ? [{ id: 'new', type: 'pump', usage_charge: '500' }] : [] }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    vi.stubGlobal('fetch', fetchMock);

    renderPage();
    await screen.findByText(/you haven't listed anything yet/i);

    await userEvent.click(screen.getByRole('button', { name: /list a resource/i }));
    await userEvent.selectOptions(screen.getByLabelText(/^type$/i), 'pump');
    await userEvent.type(screen.getByLabelText(/usage charge/i), '500');
    await userEvent.click(screen.getByRole('button', { name: /^list this resource$/i }));

    await waitFor(() => {
      const postCall = fetchMock.mock.calls.find(([, opts]) => opts && opts.method === 'POST');
      expect(postCall).toBeTruthy();
    });
    const postCall = fetchMock.mock.calls.find(([, opts]) => opts && opts.method === 'POST');
    const body = JSON.parse(postCall[1].body);
    expect(body).toMatchObject({ type: 'pump', usage_charge: 500 });
  });
});
