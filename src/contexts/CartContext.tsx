'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Cart, CartItem, CartContextType } from '@/types/cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }

const cartReducer = (state: Cart & { isLoading: boolean }, action: CartAction): Cart & { isLoading: boolean } => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = { ...action.payload, quantity: action.payload.quantity || 1 }
      const existingItemIndex = state.items.findIndex(item => 
        item.id === newItem.id || 
        (item.productId === newItem.productId && 
         JSON.stringify(item.variant) === JSON.stringify(newItem.variant))
      )

      let updatedItems
      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      } else {
        updatedItems = [...state.items, { ...newItem, id: newItem.id || `${newItem.productId}-${Date.now()}` }]
      }

      const newState = {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }

      return newState
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0,
      }

    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state
  }
}

const initialState: Cart & { isLoading: boolean } = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: true,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as Cart
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      try {
        const cartToSave: Cart = {
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
        }
        localStorage.setItem('cart', JSON.stringify(cartToSave))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [state.items, state.total, state.itemCount, state.isLoading])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const contextValue: CartContextType = {
    cart: {
      items: state.items,
      total: state.total,
      itemCount: state.itemCount,
    },
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading: state.isLoading,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}