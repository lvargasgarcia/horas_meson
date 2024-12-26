package meson.horas.repositories;

import meson.horas.entities.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Empleado findByNombre(String nombre);

    Empleado findByNombreAndPassword(String nombre, String password);
}
