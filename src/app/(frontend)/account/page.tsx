'use client'

import { useState } from 'react'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  CreditCard, 
  LogOut,
  Eye,
  Edit3,
  ShoppingBag
} from 'lucide-react'
import { toast } from 'sonner'

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: 'María González',
    email: 'maria@example.com',
    phone: '+54 11 1234-5678',
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      zipCode: '1043',
    },
    joinDate: '2023-03-15',
    orders: 12,
    favorites: 8,
  }

  // Mock orders data
  const orders = [
    {
      id: 'ORD-1734567890-ABC12',
      date: '2024-01-15',
      status: 'delivered',
      total: 45999,
      items: 3,
      statusColor: 'bg-green-100 text-green-800',
      statusLabel: 'Entregado',
    },
    {
      id: 'ORD-1734567891-DEF34',
      date: '2024-01-10',
      status: 'shipped',
      total: 89999,
      items: 1,
      statusColor: 'bg-blue-100 text-blue-800',
      statusLabel: 'Enviado',
    },
    {
      id: 'ORD-1734567892-GHI56',
      date: '2024-01-05',
      status: 'processing',
      total: 25999,
      items: 2,
      statusColor: 'bg-yellow-100 text-yellow-800',
      statusLabel: 'Procesando',
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSaveProfile = () => {
    toast.success('Perfil actualizado correctamente')
    setIsEditing(false)
  }

  const handleLogout = () => {
    toast.success('Sesión cerrada correctamente')
    // In a real app, this would handle logout
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
            <p className="text-gray-600">Gestiona tu información personal y revisa tus pedidos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  {/* User Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>

                  <Separator className="mb-6" />

                  {/* Quick Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Pedidos
                      </span>
                      <Badge>{user.orders}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Favoritos
                      </span>
                      <Badge variant="secondary">{user.favorites}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Miembro desde</span>
                      <span className="text-sm font-medium">{formatDate(user.joinDate)}</span>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Logout Button */}
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    <Package className="w-4 h-4 mr-2" />
                    Pedidos
                  </TabsTrigger>
                  <TabsTrigger value="favorites">
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Información Personal</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                              id="name"
                              defaultValue={user.name}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue={user.email}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            defaultValue={user.phone}
                            disabled={!isEditing}
                          />
                        </div>

                        {isEditing && (
                          <div className="flex gap-3">
                            <Button onClick={handleSaveProfile}>
                              Guardar Cambios
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dirección de Envío</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">{user.address.street}</p>
                            <p className="text-gray-600">
                              {user.address.city}, {user.address.state} {user.address.zipCode}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Cambiar Dirección
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de Pedidos</CardTitle>
                      <p className="text-gray-600">Revisa el estado de tus pedidos recientes</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">Pedido {order.id}</h3>
                                <p className="text-gray-600 text-sm">{formatDate(order.date)}</p>
                              </div>
                              <Badge className={order.statusColor}>
                                {order.statusLabel}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                {order.items} {order.items === 1 ? 'producto' : 'productos'} • {formatPrice(order.total)}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalles
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button size="sm">
                                    Recomprar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mt-6">
                        <Button variant="outline">
                          Ver Todos los Pedidos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Productos Favoritos</CardTitle>
                      <p className="text-gray-600">Los productos que has marcado como favoritos</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Lista de Favoritos
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Aquí aparecerán los productos que marques como favoritos
                        </p>
                        <Button>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Explorar Productos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferencias de Cuenta</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Notificaciones por Email</h4>
                            <p className="text-gray-600 text-sm">Recibir actualizaciones sobre pedidos y ofertas</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configurar
                          </Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Notificaciones Push</h4>
                            <p className="text-gray-600 text-sm">Notificaciones en tiempo real en el navegador</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activar
                          </Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Newsletter</h4>
                            <p className="text-gray-600 text-sm">Recibir nuestro newsletter semanal</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Suscribirse
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Zona Peligrosa</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-red-900">Eliminar Cuenta</h4>
                            <p className="text-red-700 text-sm">Esta acción no se puede deshacer</p>
                          </div>
                          <Button variant="destructive" size="sm">
                            Eliminar Cuenta
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}