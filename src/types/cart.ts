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

export interface Coupon {
  code: string
  discountType: 'percentage' | 'fixed' | 'free_shipping'
  discountValue: number
  discountAmount: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
  coupon?: Coupon
}

export interface CartContextType {
  cart: Cart
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  clearCart: () => void
  isLoading: boolean
}