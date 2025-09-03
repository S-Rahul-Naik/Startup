import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
interface CartItem {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  domain: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
}

// Action Types
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial State
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return calculateCartTotals(updatedItems);
      } else {
        // Add new item with quantity 1
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        
        return calculateCartTotals(updatedItems);
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item._id !== action.payload);
      return calculateCartTotals(updatedItems);
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const updatedItems = state.items.filter(item => item._id !== itemId);
        return calculateCartTotals(updatedItems);
      }
      
      const updatedItems = state.items.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      
      return calculateCartTotals(updatedItems);
    }


    case 'CLEAR_CART': {
      return initialState;
    }

    case 'LOAD_CART': {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        return calculateCartTotals(action.payload);
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]): CartState => {
  const total = items.reduce((sum, item) => {
    const price = item.discount ? 
      item.price - (item.price * item.discount / 100) : 
      item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    itemCount,
  };
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);


// Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isFirstLoad = React.useRef(true);

  // Helper to get cart key
  const getCartKey = () => {
    return isAuthenticated && user?._id ? `edutech-cart-${user._id}` : 'edutech-cart-guest';
  };

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } else {
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      } catch (error) {
        localStorage.removeItem(cartKey);
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
    isFirstLoad.current = false;
  }, [isAuthenticated, user?._id]);

  // Save cart to localStorage whenever it changes, but skip first load
  useEffect(() => {
    if (isFirstLoad.current) return;
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(state.items));
  }, [state.items, isAuthenticated, user?._id]);

  // Clear cart on logout (when user becomes unauthenticated)
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);


// (Remove duplicate code: all logic is now inside CartProvider above)

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Check if item is in cart
  const isInCart = (itemId: string): boolean => {
    return state.items.some(item => item._id === itemId);
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
