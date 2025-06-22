import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import sagardoyLogo from "@assets/sagardoy-logo-1_1750499204211.png";

const collaboratorFormSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  nif: z.string().min(9, "NIF válido requerido"),
  movil: z.string().min(9, "Móvil válido requerido"),
  emailPersonal: z.string().email("Email personal válido requerido"),
  emailProfesional: z.string().email("Email profesional válido requerido"),
  telefonoProfesional: z.string().min(9, "Teléfono profesional válido requerido"),
  empresaActualPersonal: z.string().min(2, "La empresa actual es requerida"),
  sector: z.string().min(2, "El sector es requerido"),
  cargoPuesto: z.string().min(2, "El cargo/puesto es requerido"),
  linkedin: z.string().optional(),
  empresaActual: z.string().min(2, "La empresa actual es requerida"),
  cargo: z.string().min(2, "El cargo es requerido"),
  email: z.string().email("Email válido requerido"),
  telefonoEmpresa: z.string().min(9, "Teléfono de empresa válido requerido"),
  domicilio: z.string().min(5, "Domicilio completo requerido"),
  codigoPostal: z.string().min(5, "Código postal válido requerido"),
  localidad: z.string().min(2, "La localidad es requerida"),
  provincia: z.string().min(2, "La provincia es requerida"),
  nombreTitular: z.string().min(2, "Nombre del titular requerido"),
  bancoCaja: z.string().min(2, "Banco/Caja requerido"),
  direccionBanco: z.string().min(5, "Dirección del banco requerida"),
  codigoPostalBanco: z.string().min(5, "Código postal del banco requerido"),
  localidadBanco: z.string().min(2, "Localidad del banco requerida"),
  provinciaBanco: z.string().min(2, "Provincia del banco requerida"),
  iban: z.string().min(24, "IBAN válido requerido"),
  opcionFacturacion: z.string().min(1, "Seleccione una opción de facturación"),
  formaRetribucion: z.string().min(1, "Seleccione una forma de retribución"),
  imagenClaustro: z.any().optional(),
  usoImagen: z.boolean().default(false),
  politicaPrivacidad: z.boolean().refine(val => val === true, "Debe aceptar la política de privacidad")
});

type CollaboratorFormData = z.infer<typeof collaboratorFormSchema>;

export default function CollaboratorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageRightsModalOpen, setImageRightsModalOpen] = useState(false);
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  const form = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorFormSchema),
    defaultValues: {
      usoImagen: false,
      politicaPrivacidad: false,
      formaRetribucion: "",
      opcionFacturacion: ""
    }
  });

  const onSubmit = async (data: CollaboratorFormData) => {
    setIsSubmitting(true);
    try {
      // Aquí se enviarían los datos al servidor
      console.log("Datos del colaborador:", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular envío
      alert("Formulario enviado correctamente");
    } catch (error) {
      alert("Error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-sagardoy-navy text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <img 
              src={sagardoyLogo} 
              alt="Sagardoy School" 
              className="h-12 w-auto filter brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sagardoy-navy mb-4">
            Equipo docente Sagardoy School
          </h1>
          <p className="text-sagardoy-gray">
            Complete los siguientes datos para formar parte de nuestro equipo docente
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...form.register("nombre")}
                    className="mt-1"
                  />
                  {form.formState.errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    {...form.register("apellidos")}
                    className="mt-1"
                  />
                  {form.formState.errors.apellidos && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.apellidos.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nif">NIF *</Label>
                  <Input
                    id="nif"
                    {...form.register("nif")}
                    className="mt-1"
                    placeholder="12345678A"
                  />
                  {form.formState.errors.nif && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nif.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="movil">Móvil *</Label>
                  <Input
                    id="movil"
                    {...form.register("movil")}
                    className="mt-1"
                    placeholder="+34 600 000 000"
                  />
                  {form.formState.errors.movil && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.movil.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emailPersonal">Email Personal *</Label>
                  <Input
                    id="emailPersonal"
                    type="email"
                    {...form.register("emailPersonal")}
                    className="mt-1"
                    placeholder="personal@ejemplo.com"
                  />
                  {form.formState.errors.emailPersonal && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.emailPersonal.message}</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Datos Profesionales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Datos Profesionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="empresaActualPersonal">Empresa Actual *</Label>
                  <Input
                    id="empresaActualPersonal"
                    {...form.register("empresaActualPersonal")}
                    className="mt-1"
                  />
                  {form.formState.errors.empresaActualPersonal && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.empresaActualPersonal.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sector">Sector *</Label>
                  <Input
                    id="sector"
                    {...form.register("sector")}
                    className="mt-1"
                    placeholder="Ej: Servicios financieros, Tecnología..."
                  />
                  {form.formState.errors.sector && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.sector.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cargoPuesto">Cargo/Puesto *</Label>
                  <Input
                    id="cargoPuesto"
                    {...form.register("cargoPuesto")}
                    className="mt-1"
                  />
                  {form.formState.errors.cargoPuesto && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cargoPuesto.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefonoProfesional">Teléfono Profesional *</Label>
                  <Input
                    id="telefonoProfesional"
                    {...form.register("telefonoProfesional")}
                    className="mt-1"
                    placeholder="+34 91 000 00 00"
                  />
                  {form.formState.errors.telefonoProfesional && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.telefonoProfesional.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emailProfesional">Email Profesional *</Label>
                  <Input
                    id="emailProfesional"
                    type="email"
                    {...form.register("emailProfesional")}
                    className="mt-1"
                    placeholder="profesional@empresa.com"
                  />
                  {form.formState.errors.emailProfesional && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.emailProfesional.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    {...form.register("linkedin")}
                    className="mt-1"
                    placeholder="https://linkedin.com/in/tu-perfil"
                  />
                  {form.formState.errors.linkedin && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.linkedin.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domicilio Fiscal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Domicilio fiscal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="empresaActual">Empresa actual *</Label>
                  <Input
                    id="empresaActual"
                    {...form.register("empresaActual")}
                    className="mt-1"
                  />
                  {form.formState.errors.empresaActual && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.empresaActual.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    {...form.register("cargo")}
                    className="mt-1"
                  />
                  {form.formState.errors.cargo && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cargo.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="mt-1"
                    placeholder="email@ejemplo.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefonoEmpresa">Teléfono *</Label>
                  <Input
                    id="telefonoEmpresa"
                    {...form.register("telefonoEmpresa")}
                    className="mt-1"
                  />
                  {form.formState.errors.telefonoEmpresa && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.telefonoEmpresa.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="domicilio">Domicilio *</Label>
                  <Input
                    id="domicilio"
                    {...form.register("domicilio")}
                    className="mt-1"
                  />
                  {form.formState.errors.domicilio && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.domicilio.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="codigoPostal">Código postal *</Label>
                  <Input
                    id="codigoPostal"
                    {...form.register("codigoPostal")}
                    className="mt-1"
                    placeholder="28001"
                  />
                  {form.formState.errors.codigoPostal && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.codigoPostal.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="localidad">Localidad *</Label>
                  <Input
                    id="localidad"
                    {...form.register("localidad")}
                    className="mt-1"
                  />
                  {form.formState.errors.localidad && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.localidad.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    {...form.register("provincia")}
                    className="mt-1"
                  />
                  {form.formState.errors.provincia && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.provincia.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos Bancarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Datos Bancarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombreTitular">Nombre del titular *</Label>
                  <Input
                    id="nombreTitular"
                    {...form.register("nombreTitular")}
                    className="mt-1"
                  />
                  {form.formState.errors.nombreTitular && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nombreTitular.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bancoCaja">Banco / Caja *</Label>
                  <Input
                    id="bancoCaja"
                    {...form.register("bancoCaja")}
                    className="mt-1"
                  />
                  {form.formState.errors.bancoCaja && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.bancoCaja.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="direccionBanco">Dirección del banco *</Label>
                  <Input
                    id="direccionBanco"
                    {...form.register("direccionBanco")}
                    className="mt-1"
                  />
                  {form.formState.errors.direccionBanco && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.direccionBanco.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="codigoPostalBanco">Código postal *</Label>
                  <Input
                    id="codigoPostalBanco"
                    {...form.register("codigoPostalBanco")}
                    className="mt-1"
                  />
                  {form.formState.errors.codigoPostalBanco && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.codigoPostalBanco.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="localidadBanco">Localidad *</Label>
                  <Input
                    id="localidadBanco"
                    {...form.register("localidadBanco")}
                    className="mt-1"
                  />
                  {form.formState.errors.localidadBanco && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.localidadBanco.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="provinciaBanco">Provincia *</Label>
                  <Input
                    id="provinciaBanco"
                    {...form.register("provinciaBanco")}
                    className="mt-1"
                  />
                  {form.formState.errors.provinciaBanco && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.provinciaBanco.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="iban">IBAN / Número de cuenta bancaria *</Label>
                  <Input
                    id="iban"
                    {...form.register("iban")}
                    className="mt-1"
                    placeholder="ES00 0000 0000 0000 0000 0000"
                  />
                  {form.formState.errors.iban && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.iban.message}</p>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Forma de Retribución */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Forma de Retribución</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="formaRetribucion">Tipo de retribución *</Label>
                <Select onValueChange={(value) => form.setValue("formaRetribucion", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rendimiento-trabajo">Retribución como rendimiento del trabajo</SelectItem>
                    <SelectItem value="actividad-profesional">Retribución como actividad profesional</SelectItem>
                    <SelectItem value="actividad-empresarial">Retribución como actividad empresarial</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.formaRetribucion && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.formaRetribucion.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="opcionFacturacion">Opción de facturación *</Label>
                <Select onValueChange={(value) => form.setValue("opcionFacturacion", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autonomo">Autónomo</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.opcionFacturacion && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.opcionFacturacion.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Imagen Claustro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Imagen Claustro</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="imagenClaustro">Subir fotografía</Label>
                <Input
                  id="imagenClaustro"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("imagenClaustro", file);
                    }
                  }}
                />
                <p className="text-xs text-sagardoy-gray mt-1">
                  Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Políticas de Imagen y Privacidad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-sagardoy-navy">Políticas de Imagen y Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="usoImagen"
                  checked={form.watch("usoImagen")}
                  onCheckedChange={(checked) => form.setValue("usoImagen", !!checked)}
                />
                <div className="text-sm">
                  <Label htmlFor="usoImagen" className="cursor-pointer">
                    Uso del derecho de imagen.{" "}
                    <button 
                      type="button"
                      onClick={() => setImageRightsModalOpen(true)}
                      className="text-sagardoy-blue hover:underline"
                    >
                      Ver
                    </button>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="politicaPrivacidad"
                  checked={form.watch("politicaPrivacidad")}
                  onCheckedChange={(checked) => form.setValue("politicaPrivacidad", !!checked)}
                />
                <div className="text-sm">
                  <Label htmlFor="politicaPrivacidad" className="cursor-pointer">
                    Política de privacidad.{" "}
                    <button 
                      type="button"
                      onClick={() => setPrivacyPolicyModalOpen(true)}
                      className="text-sagardoy-blue hover:underline"
                    >
                      Ver
                    </button>
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>
              </div>
              {form.formState.errors.politicaPrivacidad && (
                <p className="text-red-500 text-sm">{form.formState.errors.politicaPrivacidad.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center mt-8 mb-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-sagardoy-red text-white px-12 py-4 text-lg font-semibold hover:bg-red-700 disabled:opacity-50 shadow-lg"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-sagardoy-navy text-white py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src={sagardoyLogo} 
                alt="Sagardoy School" 
                className="h-12 w-auto filter brightness-0 invert mb-6"
              />
              <div className="space-y-2 text-slate-300">
                <p>
                  <Link href="#" className="hover:text-white">Condiciones de uso</Link>
                </p>
                <p>
                  <Link href="#" className="hover:text-white">Política de Cookies</Link>
                </p>
                <p>
                  <Link href="#" className="hover:text-white">Política de Privacidad</Link>
                </p>
                <p className="text-sm mt-4">
                  © Copyright 2024<br />
                  Sagardoy School<br />
                  Powered by: Engage360
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">VISITA NUESTRA ESCUELA:</h4>
                <p className="text-slate-300">
                  C/Velázquez 86D, 28006 Madrid
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">ESCRÍBENOS UN EMAIL:</h4>
                <p className="text-slate-300">
                  info@sagardoyschool.com
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">LLÁMANOS:</h4>
                <p className="text-slate-300">
                  Telf: +34 91 54 29 040
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Derechos de Imagen */}
      <Dialog open={imageRightsModalOpen} onOpenChange={setImageRightsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-sagardoy-navy">
              Autorización para el uso del derecho de imagen
            </DialogTitle>
            <DialogDescription className="sr-only">
              Términos y condiciones para el uso del derecho de imagen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Mediante la aceptación de la presente autorización ("Autorización") declaro ser mayor de 
              edad y autorizo expresamente a Sagardoy Business & Law School (en adelante "SBLS"), 
              con domicilio social en la c/ Tutor, 27, 28008 Madrid y C.I.F. nº B-88.562.079 para que, 
              directamente o a través de terceros, pueda captar y reproducir por cualquier medio mi 
              imagen (incluyendo mi voz y mi nombre) (las "Captaciones") con ocasión de mi 
              participación en las actividades docentes y no docentes de SBLS durante el curso 
              académico 2020-2021. La presente Autorización comprende la captación, explotación, 
              reproducción, publicación, transformación y comunicación pública (incluyendo la puesta a 
              disposición del público) de mi imagen (y/o mi voz o nombre) por cualquier medio o soporte, 
              incluyendo a título enunciativo medios impresos, audiovisuales, digitales, internet, prensa, 
              radio, redes sociales, páginas web, aplicaciones móviles, etc. La presente Autorización 
              abarca el uso de la imagen, voz y/o nombre con la finalidad de difundir y publicitar la 
              actividad docente y/o comercial de SBLS en cualquier medio de comunicación, con 
              capacidad plena de transmisión o sublicencia a terceros, para un ámbito territorial mundial 
              y por el plazo máximo de duración de los derechos, de conformidad con la legislación 
              aplicable.
            </p>

            <div className="mt-6">
              <h3 className="font-bold text-sagardoy-navy mb-3">DECLARO Y ASUMO</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Que SBLS no tendrá que contar con mi aprobación para la utilización de las 
                  Captaciones.
                </li>
                <li>
                  Que la presente Autorización no dará lugar a ningún tipo de contraprestación 
                  económica.
                </li>
                <li>
                  Que no realizaré ningún acto susceptible de impedir o dificultar el pleno ejercicio 
                  pacífico de los derechos que a SBLS le correspondan en virtud de la presente 
                  Autorización.
                </li>
                <li>
                  Que las Captaciones podrán encontrarse disponibles, más allá de los límites de la 
                  presente Autorización, en repositorios virtuales y/o redes sociales.
                </li>
              </ul>
            </div>

            <p className="mt-4">
              El responsable del tratamiento de los datos personales facilitados en el formulario es el 
              Sagardoy Business & Law School, quien tiene un interés legítimo en tratarlos con la 
              finalidad gestionar la presente autorización y su participación en la difusión y publicidad de 
              SBLS para promocionar sus actividades y servicios pertenecientes al sector de la 
              educación superior. Podrán acceder a sus datos personales los prestadores de servicios 
              de SBLS. Tiene derecho a acceder, rectificar y suprimir sus datos, así como otros 
              derechos, como se explica en la información adicional sobre privacidad que figura al 
              reverso de este documento.
            </p>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setImageRightsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-sagardoy-red text-white hover:bg-red-700"
              onClick={() => {
                form.setValue("usoImagen", true);
                setImageRightsModalOpen(false);
              }}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Política de Privacidad */}
      <Dialog open={privacyPolicyModalOpen} onOpenChange={setPrivacyPolicyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-sagardoy-navy">
              Política de Privacidad
            </DialogTitle>
            <DialogDescription className="sr-only">
              Política de privacidad de Sagardoy Business & Law School
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Con la aceptación del presente documento declaro conocer y entender la política de 
              privacidad de SBLS.
            </p>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Identificación y datos de contacto del Responsable
              </h3>
              <p>
                La compañía responsable del tratamiento de sus datos personales, SAGARDOY BUSINESS & 
                LAW SCHOOL, S.L. (en adelante, "SAGARDOY") inscrita en el Registro Mercantil de Madrid 
                al Tomo 40086, Libro 0, Folio 140, Sec. 8ª, Hoja M-712220, inscripción 1ª con CIF 
                número B-88562079 y con domicilio social en la calle Tutor nº 27, 28008 Madrid (Madrid).
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Información general: descripción de la información contenida en la política de privacidad
              </h3>
              <p>
                En la presente política de privacidad encontrará una tabla identificando, por cada uno de 
                los diferentes tratamientos de datos realizados por el SBLS, la siguiente información:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Las finalidades del tratamiento de sus datos personales, esto es, el motivo por el cual el SBLS trata sus datos personales.</li>
                <li>Las bases legales que permiten el tratamiento de sus datos por parte de SBLS para cada una de las finalidades indicadas.</li>
                <li>La posible comunicación de sus datos a terceros, así como la causa de dicha comunicación.</li>
                <li>La existencia de potenciales transferencias internacionales de datos.</li>
                <li>El plazo de conservación de los datos que nos facilite.</li>
              </ul>
              <p className="mt-2">
                Le informamos de que puede solicitar mayor detalle de información respecto de los 
                destinatarios de sus datos enviando un correo electrónico a la dirección 
                protecciondedatos@sagardoy.com indicando el tratamiento concreto sobre cuyos 
                destinatarios querría información.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Información necesaria y actualizada
              </h3>
              <p>
                Todos los campos que aparezcan señalados con un asterisco (*) en los formularios serán 
                de obligada cumplimentación, de tal modo que la omisión de alguno de ellos podría 
                comportar la imposibilidad de que se le puedan facilitar los servicios o información 
                solicitados.
              </p>
              <p className="mt-2">
                Deberá proporcionar información verídica, para que la información facilitada esté 
                siempre actualizada y no contenga errores, deberá comunicar al SBLS a la mayor brevedad 
                posible, las modificaciones y rectificaciones de sus datos de carácter personal que se 
                vayan produciendo a través de un correo electrónico a la dirección: 
                protecciondedatos@sagardoy.com
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Información detallada de los tratamientos realizados por el SBLS
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Finalidad del tratamiento</th>
                      <th className="border border-gray-300 p-2 text-left">Base legal</th>
                      <th className="border border-gray-300 p-2 text-left">Destinatarios</th>
                      <th className="border border-gray-300 p-2 text-left">Transferencias internacionales</th>
                      <th className="border border-gray-300 p-2 text-left">Plazo de conservación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Gestionar sus solicitudes de información</td>
                      <td className="border border-gray-300 p-2">Interés legítimo: para atender a sus requerimientos de información</td>
                      <td className="border border-gray-300 p-2">No se realizará ninguna cesión o acceso a sus datos personales diferente de la indicada en el apartado 2.</td>
                      <td className="border border-gray-300 p-2">No se hacen transferencias internacionales de sus datos personales.</td>
                      <td className="border border-gray-300 p-2">Hasta la resolución de su solicitud.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Mantenernos en contacto con usted y mantenerle informado de todas las noticias de actualidad de SBLS</td>
                      <td className="border border-gray-300 p-2">Consentimiento.</td>
                      <td className="border border-gray-300 p-2">No se realizará ninguna comunicación o acceso a sus datos personales diferente de la indicada en el apartado 2, excepto los prestadores de servicios de envío de comunicaciones comerciales.</td>
                      <td className="border border-gray-300 p-2">No se hacen transferencias internacionales de sus datos personales.</td>
                      <td className="border border-gray-300 p-2">Durante tres años desde la última interacción con el SBLS o hasta que revoque su consentimiento (lo que suceda antes).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Ejercicio de sus derechos
              </h3>
              <p>Le informamos de que podrá ejercer los siguientes derechos:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>derecho de acceso a sus datos personales para saber cuáles están siendo objeto de tratamiento y las operaciones de tratamiento llevadas a cabo con ellos;</li>
                <li>derecho de rectificación de cualquier dato personal inexacto;</li>
                <li>derecho de supresión de sus datos personales, cuando esto sea posible;</li>
                <li>derecho de oposición al tratamiento de sus datos personales;</li>
                <li>derecho a solicitar la limitación del tratamiento de sus datos personales;</li>
                <li>derecho a la portabilidad de sus datos personales;</li>
                <li>derecho a revocar su consentimiento en cualquier momento.</li>
              </ul>
              <p className="mt-2">
                Podrá ejercitar sus derechos en cualquier momento y de forma gratuita dirigiendo un 
                correo electrónico a protecciondedatos@sagardoy.com indicando el derecho que desea 
                ejercitar y sus datos identificativos.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sagardoy-navy mb-3">
                Medidas de seguridad
              </h3>
              <p>
                SBLS adopta los niveles de seguridad requeridos por el RGPD adecuados a la naturaleza 
                de los datos que son objeto de tratamiento en cada momento. No obstante lo anterior, 
                pueden existir actuaciones dolosas de terceros, si bien SBLS pone todos los medios a 
                su alcance para evitar dichas actuaciones.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setPrivacyPolicyModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-sagardoy-red text-white hover:bg-red-700"
              onClick={() => {
                form.setValue("politicaPrivacidad", true);
                setPrivacyPolicyModalOpen(false);
              }}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}