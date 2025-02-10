package meson.horas.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.Serializable;
import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre"}),
        @UniqueConstraint(columnNames = {"DNI"})
})
public class Empleado implements Serializable {

    @Id
    @GeneratedValue
    private Long id;


    private String nombre;

    private boolean trabajando;

    private String DNI;

    private String password; // Campo para la contraseña hasheada.

    private Time entrada_dia;

    private Time entrada_noche;

    public String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    public boolean checkPassword(String password) {
        return new BCryptPasswordEncoder().matches(password, this.password);
    }


}
