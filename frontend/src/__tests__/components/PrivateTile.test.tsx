import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrivateTile from '../../components/PrivateTile';

describe('PrivateTile Component', () => {
  it('displays the placeholder text correctly', () => {
    // Arrange & Act
    render(<PrivateTile />);
    
    // Assert
    expect(screen.getByText('Private Content')).toBeInTheDocument();
    expect(screen.getByText('No access to private endpoint. Please login to get access.')).toBeInTheDocument();
  });
});