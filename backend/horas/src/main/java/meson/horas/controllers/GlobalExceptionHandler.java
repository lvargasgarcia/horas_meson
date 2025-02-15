package meson.horas.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<String> handleHttpClientError(HttpClientErrorException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())  // Usa el mismo código de estado de la excepción
                .body("Error: " + ex.getStatusCode() + " - " + ex.getMessage());
    }

}
