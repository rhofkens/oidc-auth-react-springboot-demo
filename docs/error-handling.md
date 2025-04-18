# Error Handling in OIDC Auth Demo

This document details the error handling mechanisms implemented in the OIDC Auth Demo application, covering both backend and frontend components.

## Backend Error Handling

The backend implements a standardized error handling approach following RFC 7807 "Problem Details for HTTP APIs". This ensures consistent error responses across all API endpoints.

### ApiError Record

The core of the error handling mechanism is the `ApiError` record, which encapsulates error information in a standardized format:

```java
public record ApiError(
    String type,
    String title,
    int status,
    String detail,
    Instant timestamp
) {}
```

Fields:
- `type`: A URI reference that identifies the problem type
- `title`: A short, human-readable summary of the problem type
- `status`: The HTTP status code for this occurrence of the problem
- `detail`: A human-readable explanation specific to this occurrence of the problem
- `timestamp`: The time when the error occurred (extension to the standard)

### GlobalExceptionHandler

The `GlobalExceptionHandler` class is annotated with `@RestControllerAdvice` and intercepts exceptions thrown by controllers, converting them to standardized `ApiError` responses:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Exception handlers
}
```

The handler provides specialized handling for different types of exceptions:

1. **Generic Exception Handler**: Catches all uncaught exceptions and returns a 500 Internal Server Error response
2. **NoHandlerFoundException**: Returns a 404 Not Found response when a URL doesn't match any endpoint
3. **HttpRequestMethodNotSupportedException**: Returns a 405 Method Not Allowed response when an HTTP method is not supported
4. **HttpMediaTypeNotSupportedException**: Returns a 415 Unsupported Media Type response when a content type is not supported

All responses use the content type `application/problem+json` as specified by RFC 7807.

### Example Response

```json
{
  "type": "https://api.bluefields.ai/errors/internal-error",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "An unexpected error occurred while processing your request",
  "timestamp": "2025-04-17T19:08:00Z"
}
```

## Frontend Error Handling

The frontend implements a global error handling mechanism that captures and displays errors from API requests.

### Error Store

A lightweight Zustand store holds the latest error message and provides actions for setting and clearing errors:

```typescript
interface ErrorState {
  errorMessage: string | null;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: null,
  setError: (message: string) => set({ errorMessage: message }),
  clearError: () => set({ errorMessage: null }),
}));
```

### Enhanced useFetch Hook

The `useFetch` hook has been enhanced to:
1. Detect non-2xx responses
2. Parse Problem JSON format from the backend
3. Push error messages to the error store

The hook automatically handles:
- Network errors (connection issues)
- HTTP errors (4xx/5xx status codes)
- Problem JSON parsing
- Error message formatting for user display

### ErrorBanner Component

The `ErrorBanner` component displays error messages from the error store in a fixed-position alert at the top of the page. It uses:
- shadcn/ui Alert component for styling
- Framer Motion for fade in/out animations
- Auto-dismissal after 5 seconds

## Error Flow

When an error occurs:

1. Backend throws an exception
2. `GlobalExceptionHandler` catches the exception and converts it to an `ApiError`
3. Response is sent with content type `application/problem+json`
4. Frontend's `useFetch` hook detects the non-2xx status
5. Hook parses the Problem JSON and extracts the error message
6. Error message is stored in the error store
7. `ErrorBanner` component displays the error message to the user

## User Experience

For end users, errors are presented in a user-friendly manner:
- Technical details are hidden
- Clear, actionable messages are displayed
- For 500 errors, a generic "Service unavailable—please retry" message is shown

## Testing

Both backend and frontend error handling mechanisms are thoroughly tested:
- Backend tests verify correct status codes and response formats
- Frontend tests mock API responses to test error handling

## Using the Error Handling System in New Components

### Backend Integration

When creating new controllers or services, you should:

1. **Let exceptions propagate** to the `GlobalExceptionHandler` rather than catching and handling them locally:

```java
@RestController
@RequestMapping("/api/v1/example")
public class ExampleController {
    @GetMapping
    public ResponseEntity<ExampleResponse> getExample() {
        // If something goes wrong, let the exception propagate
        // The GlobalExceptionHandler will convert it to a Problem JSON response
        return ResponseEntity.ok(exampleService.getExample());
    }
}
```

2. **For custom exceptions**, consider adding specific handlers to the `GlobalExceptionHandler`:

```java
@ExceptionHandler(CustomBusinessException.class)
public ResponseEntity<ApiError> handleCustomBusinessException(CustomBusinessException ex) {
    logger.warn("Business exception: {}", ex.getMessage());

    ApiError apiError = new ApiError(
        "https://api.bluefields.ai/errors/business-error",
        "Business Error",
        HttpStatus.BAD_REQUEST.value(),
        ex.getMessage(),
        Instant.now());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .contentType(MediaType.valueOf("application/problem+json"))
        .body(apiError);
}
```

### Frontend Integration

When creating new components that make API requests:

1. **Use the enhanced `useFetch` hook** for all API calls:

```tsx
function MyComponent() {
  const { data, loading, error } = useFetch<MyDataType>('/api/v1/my-endpoint');

  if (loading) return <div>Loading...</div>;
  
  // No need to handle the error locally, the ErrorBanner will display it
  
  return <div>{data?.someProperty}</div>;
}
```

2. **Control error store updates** with the `updateErrorStore` option:

```tsx
// If you want to handle errors locally instead of showing the global banner
const { data, loading, error } = useFetch<MyDataType>(
  '/api/v1/my-endpoint',
  { updateErrorStore: false }
);

// Now you can handle the error locally
if (error) return <div>Custom error display: {error}</div>;
```

3. **Manually trigger error messages** when needed:

```tsx
import { useErrorStore } from '../store/errorStore';

function MyComponent() {
  const setError = useErrorStore(state => state.setError);
  
  const handleAction = () => {
    try {
      // Some action that might fail
    } catch (err) {
      setError('Failed to perform action: ' + err.message);
    }
  };
  
  return <button onClick={handleAction}>Perform Action</button>;
}
```

4. **Clear errors** when appropriate:

```tsx
import { useErrorStore } from '../store/errorStore';

function MyComponent() {
  const clearError = useErrorStore(state => state.clearError);
  
  useEffect(() => {
    // Clear any existing errors when the component mounts
    clearError();
    
    return () => {
      // Optionally clear errors when the component unmounts
      clearError();
    };
  }, [clearError]);
  
  return <div>My Component</div>;
}
```

By following these patterns, you ensure a consistent error handling experience throughout the application, with minimal boilerplate code in each component.