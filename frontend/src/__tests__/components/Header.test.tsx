import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../../components/Header';

describe('Header Component', () => {
  it('displays "Browsing as Guest" text', () => {
    render(<Header />);
    expect(screen.getByText('Browsing as Guest')).toBeInTheDocument();
  });

  it('displays a disabled login button', () => {
    render(<Header />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });

  it('displays the application title', () => {
    render(<Header />);
    expect(screen.getByText('OIDC Auth Demo')).toBeInTheDocument();
  });
});