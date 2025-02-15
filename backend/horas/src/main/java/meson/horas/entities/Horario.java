package meson.horas.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
        @UniqueConstraint(columnNames = {"diaSemana", "empleado_id"})
})
public class Horario {

    @Id
    @GeneratedValue
    private Long id;

    private Time entradaDia;

    private Time entradaNoche;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiaSemana diaSemana;

    @ManyToOne(cascade = CascadeType.REMOVE)  // Propaga la eliminación a los eventos cuando se borra el empleado
    @JoinColumn(name = "empleado_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)  // Cascada a nivel de base de datos
    @JsonIgnore
    @ToString.Exclude
    private Empleado empleado;

}
