package meson.horas.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Getter
@Setter
@EqualsAndHashCode
public class Evento {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)  // Propaga la eliminación a los eventos cuando se borra el empleado
    @JoinColumn(name = "empleado_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)  // Cascada a nivel de base de datos
    private Empleado empleado;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fechaHora;

    private int turno; // 0: mañana, 1: noche

    private int tipo; // 0: entrada, 1: salida

}
