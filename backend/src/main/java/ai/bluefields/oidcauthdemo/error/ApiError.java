package ai.bluefields.oidcauthdemo.error;

import java.time.Instant;

/**
 * Represents a standardized error response following RFC 7807 "Problem Details for HTTP APIs". This
 * record encapsulates error information to be returned to clients in a consistent format with the
 * content type "application/problem+json".
 *
 * <p>The fields follow the RFC 7807 specification:
 *
 * <ul>
 *   <li>{@code type} - A URI reference that identifies the problem type
 *   <li>{@code title} - A short, human-readable summary of the problem type
 *   <li>{@code status} - The HTTP status code for this occurrence of the problem
 *   <li>{@code detail} - A human-readable explanation specific to this occurrence of the problem
 *   <li>{@code timestamp} - The time when the error occurred (extension to the standard)
 * </ul>
 *
 * <p>Example usage:
 *
 * <pre>
 * ApiError error = new ApiError(
 *     "https://api.bluefields.ai/errors/not-found",
 *     "Resource Not Found",
 *     404,
 *     "The requested resource could not be found",
 *     Instant.now()
 * );
 * </pre>
 *
 * @see <a href="https://datatracker.ietf.org/doc/html/rfc7807">RFC 7807</a>
 */
public record ApiError(String type, String title, int status, String detail, Instant timestamp) {}
