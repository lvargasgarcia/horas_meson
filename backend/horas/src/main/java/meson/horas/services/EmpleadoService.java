package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.entities.Empleado;
import meson.horas.repositories.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class EmpleadoService {

    @Autowired
    EmpleadoRepository empleadoRepository;

    public List<Empleado> getEmpleados() {
        return empleadoRepository.findAll();
    }

    public Empleado getEmpleado(Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    public Empleado saveEmpleado(Empleado empleado) {
        return empleadoRepository.save(Empleado.builder()
                .nombre(empleado.getNombre())
                .password(empleado.encodePassword(empleado.getPassword()))
                .build());
    }

    public void deleteEmpleado(Long id) {
        empleadoRepository.deleteById(id);
    }

}
