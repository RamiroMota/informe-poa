"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportPDF } from "@/components/ReportPDF";
const QRCodeGenerator = dynamic(
  () =>
    import("@/components/QRCodeGenerator").then((mod) => mod.QRCodeGenerator),
  { ssr: false }
);

// ... existing code ...

const PDFDownloadLink = dynamic(
  () => import("@/components/PDFDownloadLinkWrapper"),
  { ssr: false }
);

interface TableRow {
  id: number;
  actividad: string;
  meta: string;
  indicador: string;
  nivelLogro: string;
}

export default function Home() {
  const [programaEducativo, setProgramaEducativo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [cargoAcademico, setCargoAcademico] = useState("");
  const [observacionesGenerales, setObservacionesGenerales] = useState("");
  const [actividadesNoProgramadas, setActividadesNoProgramadas] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, actividad: "", meta: "", indicador: "", nivelLogro: "" },
    { id: 2, actividad: "", meta: "", indicador: "", nivelLogro: "" },
    { id: 3, actividad: "", meta: "", indicador: "", nivelLogro: "" },
    { id: 4, actividad: "", meta: "", indicador: "", nivelLogro: "" },
    { id: 5, actividad: "", meta: "", indicador: "", nivelLogro: "" },
  ]);

  const agregarNuevaFila = () => {
    if (rows.length < 30) {
      const newRow: TableRow = {
        id: rows.length + 1,
        actividad: "",
        meta: "",
        indicador: "",
        nivelLogro: "",
      };
      setRows([...rows, newRow]);
    }
  };

  const eliminarUltimaFila = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const actualizarFila = (
    id: number,
    campo: keyof Omit<TableRow, "id">,
    valor: string
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [campo]: valor } : row))
    );
  };

  const calcularPromedio = () => {
    const filasActivas = rows.filter(
      (row) =>
        row.actividad.trim() ||
        row.meta.trim() ||
        row.indicador.trim() ||
        row.nivelLogro.trim()
    );

    if (filasActivas.length === 0) return "0%";

    const sumaNivelesLogro = filasActivas.reduce((suma, row) => {
      // Extraer el número del nivel de logro (ej: "10%" -> 10)
      const nivelNumerico = parseFloat(row.nivelLogro.replace("%", "")) || 0;
      return suma + nivelNumerico;
    }, 0);

    const promedio = sumaNivelesLogro / filasActivas.length;
    return `${promedio.toFixed(1)}%`;
  };

  useEffect(() => {
    setFileName(`informe-poa-${new Date().toISOString().split("T")[0]}.pdf`);
  }, []);

  const reportData = {
    programaEducativo,
    periodo,
    cargoAcademico,
    observacionesGenerales,
    actividadesNoProgramadas,
    rows,
    promedioTotal: calcularPromedio(),
    qrCodeDataUrl,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Informe de cumplimiento (Metas POA)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Formulario de información general */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Programa educativo:
                  </label>
                  <Select
                    value={programaEducativo}
                    onValueChange={setProgramaEducativo}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar programa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="licenciatura-arquitectura">
                        LIC. EN ARQUITECTURA
                      </SelectItem>
                      <SelectItem value="ingenieria-animacion">
                        ING. EN ANIMACIÓN Y DISEÑO DE CONTENIDOS DIGITALES
                      </SelectItem>
                      <SelectItem value="licenciatura-empresas">
                        LIC. ADMINISTRACIÓN DE EMPRESAS
                      </SelectItem>
                      <SelectItem value="licenciatura-contaduria">
                        LIC. EN CONTADURÍA PUBLICA
                      </SelectItem>
                      <SelectItem value="licenciatura-nutricion">
                        LIC. EN NUTRICIÓN
                      </SelectItem>
                      <SelectItem value="licenciatura-mercadotecnia">
                        LIC. EN MERCADOTECNIA
                      </SelectItem>
                      <SelectItem value="licenciatura-psicologia">
                        LIC. EN PSICOLOGÍA
                      </SelectItem>
                      <SelectItem value="licenciatura-derecho">
                        LIC. EN DERECHO
                      </SelectItem>
                      <SelectItem value="licenciatura-educacion">
                        LIC. EN EDUCACIÓN FÍSICA Y DEPORTIVA
                      </SelectItem>
                      <SelectItem value="licenciatura-enfermeria">
                        LIC. EN ENFERMERÍA
                      </SelectItem>
                      <SelectItem value="licenciatura-pedagogia">
                        LIC. EN PEDAGOGÍA
                      </SelectItem>
                      <SelectItem value="licenciatura-quimica">
                        LIC. QUÍMICO FARMACOBIOLOGO
                      </SelectItem>
                      <SelectItem value="licenciatura-odontologia">
                        LIC. CIRUJANO ODONTOLOGO
                      </SelectItem>
                      <SelectItem value="licenciatura-cirujano">
                        LIC. MEDICO CIRUJANO
                      </SelectItem>
                      <SelectItem value="direccion-academia">
                        DIRECCIÓN ACADÉMICA Y ADMINISTRATIVA
                      </SelectItem>
                      <SelectItem value="direccion-planificacion">
                        DIRECCIÓN DE PLANEACIÓN EDUCATIVA
                      </SelectItem>
                      <SelectItem value="direccion-linea">
                        DIRECCIÓN DE EDUCACIÓN EN LÍNEA
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Cargo o Académico:
                  </label>
                  <Select
                    value={cargoAcademico}
                    onValueChange={setCargoAcademico}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fernando Arreola Merino">
                        Fernando Arreola Merino
                      </SelectItem>
                      <SelectItem value="Emilio Curiel Herrera">
                        Emilio Curiel Herrera
                      </SelectItem>
                      <SelectItem value="Sergio Editson Echeverry Diaz">
                        Sergio Editson Echeverry Diaz
                      </SelectItem>
                      <SelectItem value="Marisol Salas Magaña">
                        Marisol Salas Magaña
                      </SelectItem>
                      <SelectItem value="Reyna Del C. Cancino Robles">
                        Reyna Del C. Cancino Robles
                      </SelectItem>
                      <SelectItem value="Carlos Valentín Veyna Martínez">
                        Carlos Valentín Veyna Martínez
                      </SelectItem>
                      <SelectItem value="Susana Sommers Manga">
                        Susana Sommers Manga
                      </SelectItem>
                      <SelectItem value="Benjamín Rodríguez Aquino">
                        Benjamín Rodríguez Aquino
                      </SelectItem>
                      <SelectItem value="Alejandro Fajardo Guerrero">
                        Alejandro Fajardo Guerrero
                      </SelectItem>
                      <SelectItem value="Erick Vázquez Yañez">
                        Erick Vázquez Yañez
                      </SelectItem>
                      <SelectItem value="Darwin González Sánchez">
                        Darwin González Sánchez
                      </SelectItem>
                      <SelectItem value="Carlos Martin Santos Llaven">
                        Carlos Martin Santos Llaven
                      </SelectItem>
                      <SelectItem value="Verónica Nevárez Ares">
                        Verónica Nevárez Ares
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Periodo:
                  </label>
                  <Select value={periodo} onValueChange={setPeriodo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar periodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ago24-ago25">
                        Ago 24 - Ago 25
                      </SelectItem>
                      <SelectItem value="ago25-ago26">
                        Ago 25 - Ago 26
                      </SelectItem>
                      <SelectItem value="Ago26-Ago27">
                        Ago 26 - Ago 27
                      </SelectItem>
                      <SelectItem value="Ago27-Ago28">
                        Ago 27 - Ago 28
                      </SelectItem>
                      <SelectItem value="Ago28-Ago29">
                        Ago 28 - Ago 29
                      </SelectItem>
                      <SelectItem value="Ago29-Ago30">
                        Ago 29 - Ago 30
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end items-end h-[76px]">
                  <div className="flex gap-2">
                    <Button
                      onClick={agregarNuevaFila}
                      disabled={rows.length >= 30}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      + Agregar nueva fila
                    </Button>
                    <Button
                      onClick={eliminarUltimaFila}
                      disabled={rows.length <= 1}
                      variant="outline"
                      className="border-gray-600 text-gray-600 hover:bg-gray-50"
                    >
                      Eliminar fila
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="overflow-x-auto">
              <div className="border border-gray-300 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="border border-gray-400 px-4 py-3 text-sm font-medium">
                        N#
                      </th>
                      <th className="border border-gray-400 px-4 py-3 text-sm font-medium">
                        Actividad
                      </th>
                      <th className="border border-gray-400 px-4 py-3 text-sm font-medium">
                        Meta
                      </th>
                      <th className="border border-gray-400 px-4 py-3 text-sm font-medium">
                        Indicador
                      </th>
                      <th className="border border-gray-400 px-4 py-3 text-sm font-medium">
                        Nivel de logro
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                          {row.id}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Textarea
                            value={row.actividad}
                            onChange={(e) =>
                              actualizarFila(
                                row.id,
                                "actividad",
                                e.target.value
                              )
                            }
                            className="min-h-[60px] resize-none border-none focus:ring-0 focus:border-none shadow-none p-2"
                            placeholder="Escribir actividad..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Textarea
                            value={row.meta}
                            onChange={(e) =>
                              actualizarFila(row.id, "meta", e.target.value)
                            }
                            className="min-h-[60px] resize-none border-none focus:ring-0 focus:border-none shadow-none p-2"
                            placeholder="Escribir meta..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Textarea
                            value={row.indicador}
                            onChange={(e) =>
                              actualizarFila(
                                row.id,
                                "indicador",
                                e.target.value
                              )
                            }
                            className="min-h-[60px] resize-none border-none focus:ring-0 focus:border-none shadow-none p-2"
                            placeholder="Escribir indicador..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Textarea
                            value={row.nivelLogro}
                            onChange={(e) =>
                              actualizarFila(
                                row.id,
                                "nivelLogro",
                                e.target.value
                              )
                            }
                            className="min-h-[60px] resize-none border-none focus:ring-0 focus:border-none shadow-none p-2"
                            placeholder="Escribir nivel..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nuevos apartados */}
            <div className="space-y-6">
              {/* Observaciones generales */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Observaciones generales:
                </label>
                <Textarea
                  value={observacionesGenerales}
                  onChange={(e) => setObservacionesGenerales(e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Escribir observaciones generales..."
                />
              </div>

              {/* Actividades que no estaban programadas */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Actividades que no estaban programadas:
                </label>
                <Textarea
                  value={actividadesNoProgramadas}
                  onChange={(e) => setActividadesNoProgramadas(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder="• Actividad 1&#10;• Actividad 2&#10;• Actividad 3"
                />
              </div>
            </div>

            {/* Código QR */}
            {cargoAcademico && (
              <div className="flex justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Código QR - {cargoAcademico}
                  </p>
                  <div className="inline-block p-4 bg-white border border-gray-300 rounded-lg">
                    <QRCodeGenerator
                      text={cargoAcademico}
                      onQRCodeGenerated={setQrCodeDataUrl}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer con promedio y botón de generar reporte */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-lg font-medium text-gray-900">
                Promedio total:{" "}
                <span className="font-bold">{calcularPromedio()}</span>
              </div>

              <PDFDownloadLink
                document={<ReportPDF data={reportData} />}
                fileName={fileName}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2"
                  >
                    {loading ? "Generando..." : "Generar reporte"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
