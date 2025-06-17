package com.yoni.financetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is the main entry point of the Spring Boot application. The @SpringBootApplication
 * annotation is a convenience annotation that adds all of the following: - @Configuration: Tags the
 * class as a source of bean definitions for the application context - @EnableAutoConfiguration:
 * Tells Spring Boot to start adding beans based on classpath settings - @ComponentScan: Tells
 * Spring to look for other components, configurations, and services in the current package
 */
@SpringBootApplication
public class FinanceTrackerApplication {

  /**
   * The main method that starts the Spring Boot application. SpringApplication.run() bootstraps the
   * application, starting Spring, which in turn starts the auto-configured Tomcat web server.
   *
   * @param args Command line arguments passed to the application
   */
  public static void main(String[] args) {
    SpringApplication.run(FinanceTrackerApplication.class, args);
  }
}
