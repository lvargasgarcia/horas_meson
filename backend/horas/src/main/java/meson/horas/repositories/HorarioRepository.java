package meson.horas.repositories;

import meson.horas.entities.DiaSemana;
import meson.horas.entities.Empleado;
import meson.horas.entities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {

    Horario findByEmpleadoAndDiaSemana(Empleado empleado, DiaSemana dia);

    List<Horario> findByEmpleado(Empleado empleado);
}