package meson.horas.services;

import jakarta.transaction.Transactional;
import meson.horas.entities.Empleado;
import meson.horas.entities.Horario;
import meson.horas.repositories.EmpleadoRepository;
import meson.horas.repositories.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class EmpleadoService {

    @Autowired
    EmpleadoRepository empleadoRepository;

    @Autowired
    HorarioRepository horarioRepository;

    public List<Empleado> getEmpleados() {

        var empleados = empleadoRepository.findAll();

        empleados.forEach(empleado -> {
            var horarios = new HashMap<String, Horario>();
            horarioRepository.findByEmpleado(empleado).forEach(horario -> {
                horarios.put(horario.getDiaSemana().toString(), horario);
            });
            empleado.setHorarios(horarios);
        });

        return empleados;
    }

    public Empleado getEmpleado(Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    public Empleado saveEmpleado(Empleado empleado) {

        return empleadoRepository.save(Empleado.builder()
                .nombre(empleado.getNombre())
                .password(empleado.encodePassword(empleado.getPassword()))
                .DNI(empleado.getDNI())
                .build());
    }

    public Empleado editEmpleado(Empleado empleado) {

        if(empleado.getId() == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "El id del empleado no puede ser nulo");
        }

        var horarios = empleado.getHorarios();

        try{
            if(horarios != null) {
                horarios.forEach((k, v) -> {
                    v.setEmpleado(empleado);
                    var horario = horarioRepository.findByEmpleadoAndDiaSemana(empleado, v.getDiaSemana());
                    v.setId(horario == null ? null : horario.getId());
                    horarioRepository.save(v);
                });
            }
        }catch(Exception e){
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Error en formato de los horarios");
        }

        return empleadoRepository.save(empleado);

    }

    public void deleteEmpleado(Long id) {
        if(!empleadoRepository.existsById(id)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "El empleado no existe");
        }
        empleadoRepository.deleteById(id);
    }

}
