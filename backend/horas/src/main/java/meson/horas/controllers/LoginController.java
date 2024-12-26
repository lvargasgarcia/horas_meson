package meson.horas.controllers;

import meson.horas.entities.Empleado;
import meson.horas.repositories.EmpleadoRepository;
import meson.horas.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    EmpleadoRepository empleadoRepository;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Empleado> authenticate(@RequestBody Empleado empleado) {

        try {

            if(!empleado.getNombre().equals("administrador")) throw new Exception();
            var empl = empleadoRepository.findByNombre(empleado.getNombre());
            var id = empl.getId();
            if(!empl.checkPassword(empleado.getPassword())) {
                throw new Exception();
            }
            String jwtToken = jwtUtil.doGenerateToken(id.toString());
            return ResponseEntity.ok().header("Authorization", jwtToken).body(empleado);


        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

    }


}
