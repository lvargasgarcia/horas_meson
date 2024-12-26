package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.dtos.EventoDTO;
import meson.horas.entities.Empleado;
import meson.horas.entities.Evento;
import meson.horas.repositories.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import meson.horas.repositories.EventoRepository;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Transactional
public class EventoService {

    @Autowired
    EventoRepository eventoRepository;

    @Autowired
    EmpleadoRepository empleadoRepository;

    public List<Evento> getEventos() {
        return eventoRepository.findAll();
    }

    public Evento saveEvento(EventoDTO evento) {
        
        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Europe/Madrid"));
        LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
        
        var fechaYHoraActual = localDateTime;
        var empleado = empleadoRepository.findByNombre(evento.getNombre());
        if(!empleado.checkPassword(evento.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        var turno = fechaYHoraActual.getHour() < 19 ? 0 : 1;
        var tipo = !empleado.isTrabajando() ? 0 : 1;
        empleado.setTrabajando(!empleado.isTrabajando());
        return eventoRepository.save(Evento.builder()
                .empleado(empleado)
                .fechaHora(fechaYHoraActual)
                .tipo(tipo)
                .turno(turno)
                .build());

    }

    public List<Evento> getEventosPorEmpleado(Empleado empleado) {
        return eventoRepository.findByEmpleadoId(empleado.getId());
    }

    public List<Evento> getEventosPorEmpleadoYRango(Empleado empleado, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return eventoRepository.findEventosByEmpleadoAndRangoFechas(empleado.getId(), fechaInicio, fechaFin);
    }

}
