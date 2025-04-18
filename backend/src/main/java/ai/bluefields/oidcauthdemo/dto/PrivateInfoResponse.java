package ai.bluefields.oidcauthdemo.dto;

/**
 * Represents the response containing private information accessible only to authenticated users.
 * Data Transfer Object (DTO).
 *
 * @param message A static message confirming access.
 * @param email The email address of the authenticated user, extracted from the JWT.
 */
public record PrivateInfoResponse(String message, String email) {}
