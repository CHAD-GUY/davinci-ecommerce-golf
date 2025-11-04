'use client'

import { useState } from 'react'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, ShoppingBag, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.enum(['general', 'support', 'orders', 'partnerships'], {
    required_error: 'Por favor selecciona un asunto',
  }),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('¡Mensaje enviado correctamente! Te responderemos pronto.')
      reset()
    } catch (error) {
      toast.error('Error al enviar el mensaje. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: 'Dirección',
      content: ['Av. Corrientes 1234', 'CABA, Buenos Aires', 'Argentina'],
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: 'Teléfono',
      content: ['+54 11 1234-5678', '+54 11 8765-4321'],
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: 'Email',
      content: ['info@davincistore.com', 'support@davincistore.com'],
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: 'Horarios',
      content: ['Lun - Vie: 9:00 - 18:00', 'Sáb: 9:00 - 14:00', 'Dom: Cerrado'],
    },
  ]

  const faqCategories = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-blue-500" />,
      title: 'Pedidos y Envíos',
      description: 'Información sobre el proceso de compra, envíos y entregas.',
      topics: ['Tiempos de entrega', 'Costos de envío', 'Seguimiento de pedidos'],
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-green-500" />,
      title: 'Soporte Técnico',
      description: 'Ayuda con problemas técnicos y funcionamiento del sitio.',
      topics: ['Problemas de pago', 'Cuenta de usuario', 'Navegación del sitio'],
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Devoluciones',
      description: 'Política de devoluciones, cambios y reembolsos.',
      topics: ['Proceso de devolución', 'Política de cambios', 'Reembolsos'],
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      title: 'Consultas Generales',
      description: 'Preguntas sobre productos, servicios y la empresa.',
      topics: ['Información de productos', 'Servicios', 'Sobre nosotros'],
    },
  ]

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white text-blue-600">Estamos Aquí para Ayudarte</Badge>
            <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o necesitas ayuda? Nuestro equipo está listo para asistirte.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                  <p className="text-gray-600">
                    Completa el formulario y te responderemos en menos de 24 horas.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="Tu nombre completo"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="tu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Teléfono (opcional)</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Asunto *</Label>
                        <Select onValueChange={(value) => setValue('subject', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un asunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Consulta General</SelectItem>
                            <SelectItem value="support">Soporte Técnico</SelectItem>
                            <SelectItem value="orders">Pedidos y Envíos</SelectItem>
                            <SelectItem value="partnerships">Asociaciones</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.subject && (
                          <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        {...register('message')}
                        placeholder="Describe tu consulta o mensaje..."
                        rows={6}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                      size="lg"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                        {info.content.map((line, i) => (
                          <p key={i} className="text-gray-600 text-sm">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">¿Necesitas Ayuda Rápida?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800 text-sm mb-4">
                    Para asistencia inmediata, puedes contactarnos por WhatsApp.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp: +54 11 1234-5678
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Categories */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo Podemos Ayudarte?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Selecciona el tipo de consulta que mejor describe tu situación para obtener ayuda más rápida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {faqCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="space-y-1">
                      {category.topics.map((topic, i) => (
                        <Badge key={i} variant="outline" className="text-xs mr-1">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Map Section */}
          <section className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Nuestra Ubicación</CardTitle>
                <p className="text-gray-600">
                  Visítanos en nuestras oficinas en el corazón de Buenos Aires.
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Mapa Interactivo</p>
                    <p className="text-sm">Av. Corrientes 1234, CABA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </>
  )
}