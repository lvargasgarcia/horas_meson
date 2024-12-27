package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.entities.Empleado;
import meson.horas.repositories.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.net.http.HttpConnectTimeoutException;
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

        if(!empleado.getDNI().matches("\\d{8}[A-Z]")) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        return empleadoRepository.save(Empleado.builder()
                .nombre(empleado.getNombre())
                .password(empleado.encodePassword(empleado.getPassword()))
                .DNI(empleado.getDNI())
                .build());
    }

    public Empleado editEmpleado(Empleado empleado) {

        if(!empleado.getDNI().matches("\\d{8}[A-Z]") || empleado.getId() == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }
        return empleadoRepository.save(empleado);

    }

    public void deleteEmpleado(Long id) {
        empleadoRepository.deleteById(id);
    }

}
