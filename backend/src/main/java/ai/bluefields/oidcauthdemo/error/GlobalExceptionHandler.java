package ai.bluefields.oidcauthdemo.error;

import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * Global exception handler for the application that converts uncaught exceptions into standardized
 * {@link ApiError} responses following RFC 7807 "Problem Details for HTTP APIs".
 *
 * <p>This class is responsible for:
 *
 * <ul>
 *   <li>Catching exceptions thrown by controllers
 *   <li>Converting them to standardized ApiError responses
 *   <li>Setting the appropriate HTTP status code
 *   <li>Setting the content type to "application/problem+json"
 * </ul>
 *
 * <p>The handler prevents internal exception details from leaking to clients while still providing
 * useful error information. All exceptions are logged for diagnostic purposes.
 *
 * <p>Example response:
 *
 * <pre>
 * {
 *   "type": "https://api.bluefields.ai/errors/internal-error",
 *   "title": "Internal Server Error",
 *   "status": 500,
 *   "detail": "An unexpected error occurred while processing your request",
 *   "timestamp": "2025-04-17T19:08:00Z"
 * }
 * </pre>
 *
 * @see ApiError
 * @see <a href="https://datatracker.ietf.org/doc/html/rfc7807">RFC 7807</a>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /**
   * Handles all uncaught exceptions and converts them to a standardized {@link ApiError} response
   * with HTTP status 500 (Internal Server Error).
   *
   * <p>This method logs the exception for diagnostic purposes but returns a generic error message
   * to the client to avoid exposing sensitive implementation details.
   *
   * @param ex the exception that was thrown
   * @return a {@link ResponseEntity} containing an {@link ApiError} with status 500
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleException(Exception ex) {
    logger.error("Unhandled exception caught by global handler", ex);

    ApiError apiError =
        new ApiError(
            "https://api.bluefields.ai/errors/internal-error",
            "Internal Server Error",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred while processing your request",
            Instant.now());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .contentType(MediaType.valueOf("application/problem+json"))
        .body(apiError);
  }

  /**
   * Handles {@link NoHandlerFoundException} and converts it to a standardized {@link ApiError}
   * response with HTTP status 404 (Not Found).
   *
   * @param ex the exception that was thrown
   * @return a {@link ResponseEntity} containing an {@link ApiError} with status 404
   */
  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<ApiError> handleNoHandlerFoundException(NoHandlerFoundException ex) {
    logger.warn("No handler found for {}: {}", ex.getRequestURL(), ex.getMessage());

    ApiError apiError =
        new ApiError(
            "https://api.bluefields.ai/errors/not-found",
            "Not Found",
            HttpStatus.NOT_FOUND.value(),
            "The requested resource could not be found: " + ex.getRequestURL(),
            Instant.now());

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .contentType(MediaType.valueOf("application/problem+json"))
        .body(apiError);
  }

  /**
   * Handles {@link HttpRequestMethodNotSupportedException} and converts it to a standardized {@link
   * ApiError} response with HTTP status 405 (Method Not Allowed).
   *
   * @param ex the exception that was thrown
   * @return a {@link ResponseEntity} containing an {@link ApiError} with status 405
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleMethodNotAllowed(
      HttpRequestMethodNotSupportedException ex) {
    logger.warn("Method not allowed: {}", ex.getMessage());

    ApiError apiError =
        new ApiError(
            "https://api.bluefields.ai/errors/method-not-allowed",
            "Method Not Allowed",
            HttpStatus.METHOD_NOT_ALLOWED.value(),
            "The HTTP method " + ex.getMethod() + " is not supported for this resource",
            Instant.now());

    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
        .contentType(MediaType.valueOf("application/problem+json"))
        .body(apiError);
  }

  /**
   * Handles {@link HttpMediaTypeNotSupportedException} and converts it to a standardized {@link
   * ApiError} response with HTTP status 415 (Unsupported Media Type).
   *
   * @param ex the exception that was thrown
   * @return a {@link ResponseEntity} containing an {@link ApiError} with status 415
   */
  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<ApiError> handleUnsupportedMediaType(
      HttpMediaTypeNotSupportedException ex) {
    logger.warn("Unsupported media type: {}", ex.getMessage());

    ApiError apiError =
        new ApiError(
            "https://api.bluefields.ai/errors/unsupported-media-type",
            "Unsupported Media Type",
            HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
            "The content type " + ex.getContentType() + " is not supported",
            Instant.now());

    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        .contentType(MediaType.valueOf("application/problem+json"))
        .body(apiError);
  }
}
