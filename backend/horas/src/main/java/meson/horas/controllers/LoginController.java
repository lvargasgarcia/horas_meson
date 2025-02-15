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

        if(!empleado.getNombre().matches("\\s*administrador\\s*")) throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Credenciales incorrectas");
        var empl = empleadoRepository.findByNombre("administrador");
        var id = empl.getId();
        if(!empl.checkPassword(empleado.getPassword())) {
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Credenciales incorrectas");
        }
        String jwtToken = jwtUtil.doGenerateToken(id.toString());
        return ResponseEntity.ok().header("Authorization", jwtToken).body(empleado);

    }


}
