package ai.bluefields.oidcauthdemo.exception;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import org.junit.jupiter.api.Test;

/** Unit tests for {@link ApiError} record. */
class ApiErrorTest {

  @Test
  void shouldCreateApiErrorWithAllFields() {
    // Given
    String type = "https://api.bluefields.ai/errors/validation";
    String title = "Validation Error";
    int status = 400;
    String detail = "The request was invalid";
    Instant timestamp = Instant.now();

    // When
    ApiError apiError = new ApiError(type, title, status, detail, timestamp);

    // Then
    assertThat(apiError.type()).isEqualTo(type);
    assertThat(apiError.title()).isEqualTo(title);
    assertThat(apiError.status()).isEqualTo(status);
    assertThat(apiError.detail()).isEqualTo(detail);
    assertThat(apiError.timestamp()).isEqualTo(timestamp);
  }

  @Test
  void shouldHaveCorrectEqualsAndHashCode() {
    // Given
    Instant now = Instant.now();
    ApiError error1 = new ApiError("type", "title", 400, "detail", now);
    ApiError error2 = new ApiError("type", "title", 400, "detail", now);
    ApiError differentError = new ApiError("different", "title", 400, "detail", now);

    // Then
    assertThat(error1).isEqualTo(error2);
    assertThat(error1.hashCode()).isEqualTo(error2.hashCode());
    assertThat(error1).isNotEqualTo(differentError);
    assertThat(error1.hashCode()).isNotEqualTo(differentError.hashCode());
  }

  @Test
  void shouldHaveCorrectToString() {
    // Given
    Instant now = Instant.now();
    ApiError error = new ApiError("type", "title", 400, "detail", now);

    // When
    String toString = error.toString();

    // Then
    assertThat(toString).contains("type");
    assertThat(toString).contains("title");
    assertThat(toString).contains("400");
    assertThat(toString).contains("detail");
    assertThat(toString).contains(now.toString());
  }
}
