// export const cartItemsTotalPrice = (items, { discountInPercent = 0 } = {}) => {
export const cartItemsTotalPrice = (items, coupon = null) => {
  if (items === null || items.length === 0) return 0;
  let itemCost = items.reduce((total, item) => {
    if (item.salePrice) {
      const addonPrice = item.addons?.reduce((price, addon) => {
        return price + addon.price * (addon.quantity || 0)
      }, 0);
      return total + addonPrice + item.salePrice * item.quantity;
    }
    console.log(item.addons)

    const addonPrice = item.addons?.reduce((price, addon) => {
      return price + addon.price * (addon.quantity || 0)
    }, 0);
    return total + addonPrice + item.price * item.quantity;
  }, 0);
  // const discountRate = 1 - discountInPercent;
  const discount = coupon
    ? (itemCost * Number(coupon.discountInPercent)) / 100
    : 0;
  // itemCost * discountRate * TAX_RATE + shipping;
  // return itemCost * discountRate;
  return itemCost - discount;
};
// cartItems, cartItemToAdd
const addItemToCart = (state, action) => {
  const existingCartItemIndex = state.items.findIndex(
    (item) => item.id === action.payload.id
  );

  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    newState[existingCartItemIndex].quantity += action.payload.quantity;
    return newState;
  }
  return [...state.items, action.payload];
};

const updateAddonToCart = (state, action) => {

  const a=  [...state.items.map(m => {
    if (m.id === action.payload.productId) {
      return {...m, addons: m.addons.map(addon => {
        if (addon.id === action.payload.addonId) {
          console.log('update addon', action.payload.quantity)
          return {...addon, quantity: action.payload.quantity}
        } else {
          console.log('noio change')
          return addon
        }
      })
    }} else {
      return m
    }
  })]
  return a
}

// cartItems, cartItemToRemove
const removeItemFromCart = (state, action) => {
  return state.items.reduce((acc, item) => {
    if (item.id === action.payload.id) {
      const newQuantity = item.quantity - action.payload.quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
};

const clearItemFromCart = (state, action) => {
  return state.items.filter((item) => item.id !== action.payload.id);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'REHYDRATE':
      return { ...state, ...action.payload };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'UPDATE_ADDON':
      return { ...state, items: updateAddonToCart(state, action) };
    case 'ADD_ITEM':
      return { ...state, items: addItemToCart(state, action) };
    case 'REMOVE_ITEM':
      return { ...state, items: removeItemFromCart(state, action) };
    case 'CLEAR_ITEM_FROM_CART':
      return { ...state, items: clearItemFromCart(state, action) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'TOGGLE_RESTAURANT':
      return { ...state, isRestaurant: !state.isRestaurant };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
