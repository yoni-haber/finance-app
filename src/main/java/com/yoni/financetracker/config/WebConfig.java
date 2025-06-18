package com.yoni.financetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration class for the application. This class configures various web-related settings,
 * including CORS (Cross-Origin Resource Sharing) to allow the frontend application to communicate
 * with the backend API.
 *
 * <p>The @Configuration annotation marks this class as a source of bean definitions for the
 * application context.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  /**
   * Configures CORS settings for the application. This method: 1. Allows requests from the frontend
   * development server (http://localhost:5173) 2. Allows common HTTP methods (GET, POST, PUT,
   * DELETE, OPTIONS) 3. Allows all headers 4. Allows credentials (cookies, authorisation headers)
   *
   * @param registry The CORS registry to configure
   */
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/api/**")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}
