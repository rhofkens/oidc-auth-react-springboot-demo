package ai.bluefields.oidcauthdemo.health;

/**
 * Record representing the health check response. Contains a message indicating the service status.
 */
public record HealthResponse(String message) {}
