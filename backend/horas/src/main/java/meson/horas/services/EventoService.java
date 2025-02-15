package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.dtos.EventoDTO;
import meson.horas.entities.DiaSemana;
import meson.horas.entities.Empleado;
import meson.horas.entities.Evento;
import meson.horas.repositories.EmpleadoRepository;
import meson.horas.repositories.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import meson.horas.repositories.EventoRepository;
import org.springframework.web.client.HttpClientErrorException;

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

    @Autowired
    HorarioRepository horarioRepository;

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
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Credenciales incorrectas");
        }
        var turno = (fechaYHoraActual.getHour() < 19 && fechaYHoraActual.getHour() > 2) ? 0 : 1;

        int tipo;
        if(!eventoRepository.findEventosByEmpleadoAndTurnoAndFecha(empleado.getId(), turno, fechaYHoraActual.toLocalDate()).isEmpty()){
            tipo = 1;
        }else{
            tipo = 0;
        }

        DiaSemana diaSemana = DiaSemana.valueOf(List.of("L", "M", "X", "J", "V", "S", "D").get(fechaYHoraActual.getDayOfWeek().getValue() - 1));
        var horario = horarioRepository.findByEmpleadoAndDiaSemana(empleado, diaSemana);

        if(horario != null && tipo == 0){
            if(turno == 0 && horario.getEntradaDia() != null && ChronoUnit.MINUTES.between(fechaYHoraActual.toLocalTime(), horario.getEntradaDia().toLocalTime()) > 5){
                throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "No se puede fichar más de 5 minutos antes de la hora de entrada: " + horario.getEntradaDia().toLocalTime());
            }else if(horario.getEntradaNoche() != null && ChronoUnit.MINUTES.between(fechaYHoraActual.toLocalTime(), horario.getEntradaNoche().toLocalTime()) > 5){
                throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "No se puede fichar más de 5 minutos antes de la hora de entrada: " + horario.getEntradaNoche().toLocalTime());
            }
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
