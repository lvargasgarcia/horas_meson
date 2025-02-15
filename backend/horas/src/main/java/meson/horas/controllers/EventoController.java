package meson.horas.controllers;

import meson.horas.dtos.EventoDTO;
import meson.horas.entities.Evento;
import meson.horas.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.client.HttpClientErrorException;

import java.net.InetAddress;
import java.util.List;

@RestController
@RequestMapping("/evento")
public class EventoController {

    @Autowired
    EventoService eventoService;

    @Autowired
    HttpServletRequest request;

    private String getIpCasa(){
        try{
            return InetAddress.getByName("vpnlalo.duckdns.org").toString().split("/")[1];
        }catch(Exception e){
            return "";
        }
    }

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
        var remote_ip = request.getHeader("X-Real-IP") != null ? request.getHeader("X-Real-IP") : getIpCasa();
        System.out.println("IP: " + remote_ip);
        System.out.println("Latitud: " + eventoDTO.getLatitud());
        System.out.println("Longitud: " + eventoDTO.getLongitud());
        if(!ipValida(remote_ip) && !validLocation(eventoDTO.getLatitud(), eventoDTO.getLongitud())){
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Ubicación no permitida ¿Estás conectado a la red del Mesón?");
        }
        var ev = eventoService.saveEvento(eventoDTO);
        return ResponseEntity.ok(ev);
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

    private boolean ipValida(String ip){
        return ip != null && (allowed_ips.contains(ip) || ip.equals(getIpCasa()));
    }

}
