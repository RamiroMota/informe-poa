import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Definir estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    width: 120,
  },
  infoValue: {
    flex: 1,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#6B7280",
    color: "white",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 40,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    minHeight: 40,
  },
  cellNumber: {
    width: "8%",
    padding: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    justifyContent: "center",
  },
  cellActivity: {
    width: "30%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    justifyContent: "center",
  },
  cellMeta: {
    width: "25%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    justifyContent: "center",
  },
  cellIndicator: {
    width: "15%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    justifyContent: "center",
  },
  cellLevel: {
    width: "22%",
    padding: 8,
    justifyContent: "center",
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    justifyContent: "center",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  averageText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 9,
    color: "#6B7280",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  sectionContent: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

interface ReportData {
  programaEducativo: string;
  periodo: string;
  cargoAcademico: string;
  observacionesGenerales: string;
  actividadesNoProgramadas: string;
  rows: Array<{
    id: number;
    actividad: string;
    meta: string;
    indicador: string;
    nivelLogro: string;
  }>;
  promedioTotal: string;
  qrCodeDataUrl?: string;
}

interface ReportPDFProps {
  data: ReportData;
}

export const ReportPDF: React.FC<ReportPDFProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filtrar filas con contenido para el reporte
  const activeRows = data.rows.filter(row => 
    row.actividad.trim() || row.meta.trim() || row.indicador.trim() || row.nivelLogro.trim()
  );

  // Función para dividir texto largo en múltiples líneas
  const splitText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    
    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          lines.push(word);
        }
      } else {
        currentLine += word + " ";
      }
    }
    
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    
    return lines.join("\n");
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Informe de cumplimiento (Metas POA)</Text>
        </View>

        {/* Información general */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Programa educativo:</Text>
            <Text style={styles.infoValue}>
              {data.programaEducativo || "No especificado"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Periodo:</Text>
            <Text style={styles.infoValue}>
              {data.periodo || "No especificado"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo o Académico:</Text>
            <Text style={styles.infoValue}>
              {data.cargoAcademico || "No especificado"}
            </Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableHeader}>
            <View style={[styles.cellNumber, styles.headerCell]}>
              <Text>N#</Text>
            </View>
            <View style={[styles.cellActivity, styles.headerCell]}>
              <Text>Actividad</Text>
            </View>
            <View style={[styles.cellMeta, styles.headerCell]}>
              <Text>Meta</Text>
            </View>
            <View style={[styles.cellIndicator, styles.headerCell]}>
              <Text>Indicador</Text>
            </View>
            <View style={[styles.cellLevel, styles.headerCell]}>
              <Text>Nivel de logro</Text>
            </View>
          </View>

          {/* Filas de la tabla */}
          {activeRows.map((row, index) => (
            <View 
              key={row.id} 
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <View style={styles.cellNumber}>
                <Text>{row.id}</Text>
              </View>
              <View style={styles.cellActivity}>
                <Text>{splitText(row.actividad, 35)}</Text>
              </View>
              <View style={styles.cellMeta}>
                <Text>{splitText(row.meta, 25)}</Text>
              </View>
              <View style={styles.cellIndicator}>
                <Text>{row.indicador}</Text>
              </View>
              <View style={styles.cellLevel}>
                <Text>{row.nivelLogro}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.averageText}>
            Promedio total: {data.promedioTotal}
          </Text>
          <Text style={styles.dateText}>
            Generado el {currentDate}
          </Text>
        </View>

        {/* Observaciones Generales */}
        {data.observacionesGenerales && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones generales</Text>
            <Text style={styles.sectionContent}>{data.observacionesGenerales}</Text>
          </View>
        )}

        {/* Actividades no programadas */}
        {data.actividadesNoProgramadas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividades que no estaban programadas</Text>
            <Text style={styles.sectionContent}>{data.actividadesNoProgramadas}</Text>
          </View>
        )}

        {/* Código QR */}
        {data.qrCodeDataUrl && (
          <View style={styles.qrCodeContainer}>
             <Image src={data.qrCodeDataUrl} style={{ width: 100, height: 100 }} />
          </View>
        )}
      </Page>
    </Document>
  );
};