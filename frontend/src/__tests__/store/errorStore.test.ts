import { describe, it, expect, beforeEach } from 'vitest';
import { useErrorStore } from '../../store/errorStore';

describe('errorStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useErrorStore.setState({ errorMessage: null });
  });

  it('should initialize with null error message', () => {
    const state = useErrorStore.getState();
    expect(state.errorMessage).toBeNull();
  });

  it('should set an error message', () => {
    const { setError } = useErrorStore.getState();
    setError('Test error message');

    const state = useErrorStore.getState();
    expect(state.errorMessage).toBe('Test error message');
  });

  it('should clear the error message', () => {
    const { setError, clearError } = useErrorStore.getState();

    // First set an error
    setError('Test error message');
    expect(useErrorStore.getState().errorMessage).toBe('Test error message');

    // Then clear it
    clearError();
    expect(useErrorStore.getState().errorMessage).toBeNull();
  });
});
