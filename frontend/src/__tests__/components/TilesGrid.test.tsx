import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TilesGrid from '../../components/TilesGrid';

describe('TilesGrid Component', () => {
  it('renders child components correctly', () => {
    // Arrange
    const testId1 = 'test-child-1';
    const testId2 = 'test-child-2';
    
    // Act
    render(
      <TilesGrid>
        <div data-testid={testId1}>Child 1</div>
        <div data-testid={testId2}>Child 2</div>
      </TilesGrid>
    );
    
    // Assert
    expect(screen.getByTestId(testId1)).toBeInTheDocument();
    expect(screen.getByTestId(testId2)).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('applies the correct grid layout classes', () => {
    // Act
    const { container } = render(
      <TilesGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </TilesGrid>
    );
    
    // Assert
    // Find the grid container
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('md:grid-cols-2');
    expect(gridContainer).toHaveClass('gap-6');
  });

  it('applies additional className when provided', () => {
    // Act
    const { container } = render(
      <TilesGrid className="test-class">
        <div>Child</div>
      </TilesGrid>
    );
    
    // Assert
    const outerContainer = container.firstChild;
    expect(outerContainer).toHaveClass('test-class');
  });
});