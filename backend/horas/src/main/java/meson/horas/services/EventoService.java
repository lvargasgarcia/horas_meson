package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.dtos.EventoDTO;
import meson.horas.entities.Empleado;
import meson.horas.entities.Evento;
import meson.horas.repositories.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import meson.horas.repositories.EventoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
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
        LocalDateTime fechaYHoraActual = zonedDateTime.toLocalDateTime();

        if(fechaYHoraActual.getHour() <= 2){
            fechaYHoraActual = fechaYHoraActual.minusDays(1);
        }

        var empleado = empleadoRepository.findByNombre(evento.getNombre());
        if(!empleado.checkPassword(evento.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        var turno = (fechaYHoraActual.getHour() < 19 && fechaYHoraActual.getHour() > 2) ? 0 : 1;

        int tipo;
        if(!eventoRepository.findEventosByEmpleadoAndTurnoAndFecha(empleado.getId(), turno, fechaYHoraActual.toLocalDate()).isEmpty()){
            tipo = 1;
        }else{
            tipo = 0;
        }

        var c1 = empleado.getEntrada_dia() != null && tipo == 0 && turno == 0 && ChronoUnit.MINUTES.between(fechaYHoraActual.toLocalTime(), empleado.getEntrada_dia().toLocalTime()) > 5;
        var c2 = empleado.getEntrada_noche() != null && tipo == 0 && turno == 1 && ChronoUnit.MINUTES.between(fechaYHoraActual.toLocalTime(), empleado.getEntrada_noche().toLocalTime()) > 5;
        if(c1 || c2){
            System.out.println("No se puede fichar más de 5 minutos antes de la hora de entrada");
            throw new RuntimeException();
        }

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
