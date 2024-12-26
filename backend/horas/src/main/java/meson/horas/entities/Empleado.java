package meson.horas.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"nombre"}))
public class Empleado implements Serializable {

    @Id
    @GeneratedValue
    private Long id;


    private String nombre;

    private boolean trabajando;

    private String password; // Campo para la contraseña hasheada.

    public String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    public boolean checkPassword(String password) {
        return new BCryptPasswordEncoder().matches(password, this.password);
    }


}
