package meson.horas.controllers;

import meson.horas.entities.Empleado;
import meson.horas.entities.Evento;
import meson.horas.security.JwtUtil;
import meson.horas.services.EmpleadoService;
import meson.horas.services.EventoService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/empleado")
public class EmpleadoController {

    @Autowired
    EmpleadoService empleadoService;

    @Autowired
    EventoService eventoService;

    @Autowired
    JwtUtil jwtUtil;


    @GetMapping
    public ResponseEntity<List<Empleado>> getEmpleado() {
        try{
            return ResponseEntity.ok(empleadoService.getEmpleados());
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> getEmpleado(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(empleadoService.getEmpleado(id));
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpleado(@PathVariable Long id) {
        try{
            empleadoService.deleteEmpleado(id);
            return ResponseEntity.ok().build();
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Empleado> saveEmpleado(@RequestBody Empleado empleado) {
        try{
            var empl = empleadoService.saveEmpleado(empleado);
            var id = empl.getId();
            var token = jwtUtil.doGenerateToken(id.toString());
            return ResponseEntity.ok().header("Authorization", token).body(empl);
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/generarInforme/{id}")
    public ResponseEntity<byte[]> generarInforme(@PathVariable Long id, @RequestParam("fechaInicio") String fechaInicioString,
                                                 @RequestParam("fechaFin") String fechaFinString) {
        try {

            var fechaInicio = convertToLocalDateTime(fechaInicioString);
            var fechaFin = convertToLocalDateTime(fechaFinString);

            Empleado empleado = empleadoService.getEmpleado(id);
            if (empleado == null) {
                return ResponseEntity.notFound().build();
            }
            var output = generarInformeEmpleado(empleado, fechaInicio, fechaFin);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + empleado.getNombre() + ".xlsx");
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            headers.add("Access-Control-Expose-Headers", "Content-Disposition, Content-Type");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(output);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/generarInforme")
    public ResponseEntity<byte[]> generarInformeParaTodos(@RequestParam("fechaInicio") String fechaInicioString,
                                                          @RequestParam("fechaFin") String fechaFinString) {
        try {

            var fechaInicio = convertToLocalDateTime(fechaInicioString);
            var fechaFin = convertToLocalDateTime(fechaFinString);

            List<Empleado> empleados = empleadoService.getEmpleados();

            if (empleados.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Create a ByteArrayOutputStream to hold the ZIP file
            ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
            try (ZipOutputStream zipStream = new ZipOutputStream(zipOutputStream)) {
                for (Empleado empleado : empleados) {
                    // Generate the report for each employee
                    byte[] report = generarInformeEmpleado(empleado, fechaInicio, fechaFin);

                    // Add the report to the ZIP file
                    ZipEntry zipEntry = new ZipEntry(empleado.getNombre() + ".xlsx");
                    zipStream.putNextEntry(zipEntry);
                    zipStream.write(report);
                    zipStream.closeEntry();
                }
            }

            // Prepare headers for the ZIP file response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=informes_empleados.zip");
            headers.add("Content-Type", "application/zip");
            headers.add("Access-Control-Expose-Headers", "Content-Disposition, Content-Type");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipOutputStream.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


    private byte[] generarInformeEmpleado(Empleado empleado, LocalDateTime fechaInicio, LocalDateTime fechaFin) throws IOException {

        // Obtener los eventos del empleado
        List<Evento> eventos = eventoService.getEventosPorEmpleadoYRango(empleado, fechaInicio, fechaFin);

        // Agrupar eventos por fecha (día)
        Map<LocalDate, List<Evento>> eventosPorDia = new TreeMap<>();
        for (Evento evento : eventos) {
            LocalDate dia = evento.getFechaHora().toLocalDate();
            eventosPorDia.computeIfAbsent(dia, k -> new ArrayList<>()).add(evento);
        }

        // Crear el archivo Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Informe");

        // Crear estilos
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);

        CellStyle monthSummaryStyle = workbook.createCellStyle();
        monthSummaryStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        monthSummaryStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        monthSummaryStyle.setAlignment(HorizontalAlignment.CENTER);

        // Crear la fila de encabezados
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Fecha", "Entrada Mañana", "Salida Mañana", "Entrada Tarde", "Salida Tarde", "Total Horas"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        // Agregar las filas con los eventos
        int rowIndex = 1;
        Map<YearMonth, Duration> duracionMensual = new TreeMap<>();
        for (Map.Entry<LocalDate, List<Evento>> entry : eventosPorDia.entrySet()) {
            LocalDate dia = entry.getKey();
            List<Evento> eventosDelDia = entry.getValue();

            LocalDateTime entradaMañana = null, salidaMañana = null, entradaTarde = null, salidaTarde = null;

            for (Evento evento : eventosDelDia) {
                if (evento.getTurno() == 0) {
                    if (evento.getTipo() == 0) {
                        entradaMañana = evento.getFechaHora();
                    } else {
                        salidaMañana = evento.getFechaHora();
                    }
                } else {
                    if (evento.getTipo() == 0) {
                        entradaTarde = evento.getFechaHora();
                    } else {
                        salidaTarde = evento.getFechaHora();
                    }
                }
            }

            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(dia.toString());
            row.createCell(1).setCellValue(entradaMañana != null ? entradaMañana.toLocalTime().toString() : "");
            row.createCell(2).setCellValue(salidaMañana != null ? salidaMañana.toLocalTime().toString() : "");
            row.createCell(3).setCellValue(entradaTarde != null ? entradaTarde.toLocalTime().toString() : "");
            row.createCell(4).setCellValue(salidaTarde != null ? salidaTarde.toLocalTime().toString() : "");

            Duration totalDuration = Duration.ZERO;
            if (entradaMañana != null && salidaMañana != null) {
                var duracionManana = Duration.between(entradaMañana, salidaMañana);
                if(!duracionManana.isNegative()) {
                    totalDuration = totalDuration.plus(duracionManana);
                }
            }
            if (entradaTarde != null && salidaTarde != null) {
                var duracionTarde = Duration.between(entradaTarde, salidaTarde);
                if(!duracionTarde.isNegative()) {
                    totalDuration = totalDuration.plus(duracionTarde);
                }
            }

            long hours = totalDuration.toHours();
            long minutes = totalDuration.toMinutesPart();
            long seconds = totalDuration.toSecondsPart();

            String totalHorasFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds);
            row.createCell(5).setCellValue(totalHorasFormatted);

            YearMonth mes = YearMonth.from(dia);
            duracionMensual.put(mes, duracionMensual.getOrDefault(mes, Duration.ZERO).plus(totalDuration));
        }

        // Crear la tabla de resumen mensual
        rowIndex += 2;
        Row monthlyHeaderRow = sheet.createRow(rowIndex++);
        Cell monthCell = monthlyHeaderRow.createCell(0);
        monthCell.setCellValue("Mes");
        monthCell.setCellStyle(headerStyle);

        Cell totalHoursCell = monthlyHeaderRow.createCell(1);
        totalHoursCell.setCellValue("Total Horas");
        totalHoursCell.setCellStyle(headerStyle);

        for (Map.Entry<YearMonth, Duration> entry : duracionMensual.entrySet()) {
            YearMonth mes = entry.getKey();
            Duration totalDuration = entry.getValue();

            long hours = totalDuration.toHours();
            long minutes = totalDuration.toMinutesPart();
            long seconds = totalDuration.toSecondsPart();

            String totalHorasFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds);

            Row row = sheet.createRow(rowIndex++);
            Cell mesCell = row.createCell(0);
            mesCell.setCellValue(mes.toString());
            mesCell.setCellStyle(monthSummaryStyle);

            Cell totalCell = row.createCell(1);
            totalCell.setCellValue(totalHorasFormatted);
            totalCell.setCellStyle(monthSummaryStyle);
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        workbook.write(byteArrayOutputStream);
        workbook.close();
        return byteArrayOutputStream.toByteArray();
    }

    private LocalDateTime convertToLocalDateTime(String dateString){
        // Parse the string to LocalDate
        LocalDate localDate = LocalDate.parse(dateString);

        // Convert LocalDate to LocalDateTime by adding time (defaulting to midnight)
        return localDate.atStartOfDay();
    }


}

