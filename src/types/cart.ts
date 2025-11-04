export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: {
    id: string
    name: string
    color?: string
    size?: string
    price: number
  }
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartContextType {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
}