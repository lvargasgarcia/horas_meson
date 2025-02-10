package meson.horas.controllers;

import meson.horas.dtos.EventoDTO;
import meson.horas.entities.Evento;
import meson.horas.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/evento")
public class EventoController {

    @Autowired
    EventoService eventoService;

    @Autowired
    HttpServletRequest request;

    List<String> allowed_ips = List.of("46.37.82.184");

    final double LAT_MESON = 36.726272;
    final double LON_MESON = -4.468948;

    @GetMapping
    public ResponseEntity<List<Evento>> getEvento() {
        try{
            return ResponseEntity.ok(eventoService.getEventos());
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> saveEvento(@RequestBody EventoDTO eventoDTO) {
        try{
            var remote_ip = request.getRemoteAddr();
            System.out.println("IP: " + remote_ip);
            System.out.println("Latitud: " + eventoDTO.getLatitud());
            System.out.println("Longitud: " + eventoDTO.getLongitud());
            if(!(allowed_ips.contains(remote_ip)) && !validLocation(eventoDTO.getLatitud(), eventoDTO.getLongitud())){
                return ResponseEntity.status(403).body("La IP " + remote_ip + " no está autorizada");
            }
            var ev = eventoService.saveEvento(eventoDTO);
            return ResponseEntity.ok(ev);
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    private boolean validLocation(String latitud, String longitud){
        try{
            double lat = Double.parseDouble(latitud);
            double lon = Double.parseDouble(longitud);
            return Math.abs(lat - LAT_MESON) < (1/1110) && Math.abs(lon - LON_MESON) < (1/(1110*Math.cos(LAT_MESON)));
        }catch(Exception e){
            return false;
        }
    }

}