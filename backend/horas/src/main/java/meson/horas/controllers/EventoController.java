package meson.horas.controllers;

import meson.horas.dtos.EventoDTO;
import meson.horas.entities.Empleado;
import meson.horas.entities.Evento;
import meson.horas.services.EmpleadoService;
import meson.horas.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/evento")
public class EventoController {

    @Autowired
    EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<Evento>> getEvento() {
        try{
            return ResponseEntity.ok(eventoService.getEventos());
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Evento> saveEvento(@RequestBody EventoDTO eventoDTO) {
        try{
            var ev = eventoService.saveEvento(eventoDTO);
            return ResponseEntity.ok(ev);
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

}