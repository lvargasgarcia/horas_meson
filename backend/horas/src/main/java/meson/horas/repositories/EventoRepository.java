package meson.horas.repositories;

import meson.horas.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByEmpleadoId(Long empleadoId);

    // Consultar los eventos de un empleado en un día específico
    @Query("SELECT e FROM Evento e WHERE e.empleado.id = :empleadoId AND FUNCTION('DATE', e.fechaHora) = :fecha")
    List<Evento> findEventosByEmpleadoAndFecha(Long empleadoId, LocalDate fecha);

    // Consultar los eventos de un empleado en un día específico y filtrados por tipo
    @Query("SELECT e FROM Evento e WHERE e.empleado.id = :empleadoId AND FUNCTION('DATE', e.fechaHora) = :fecha AND e.tipo = :tipo")
    List<Evento> findEventosByEmpleadoAndFechaAndTipo(Long empleadoId, LocalDateTime fecha, int tipo);

    // Consultar los eventos de un empleado en un rango de fechas
    @Query("SELECT e FROM Evento e WHERE e.empleado.id = :empleadoId AND FUNCTION('DATE', e.fechaHora) BETWEEN :fechaInicio AND :fechaFin")
    List<Evento> findEventosByEmpleadoAndRangoFechas(Long empleadoId, LocalDateTime fechaInicio, LocalDateTime fechaFin);

}
