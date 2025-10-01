// Categories that match the backend Item.js model exactly
export const CATEGORIES = {
  Bakal: ['Solid A', 'Solid B', 'Solid C', 'Assorted', 'Tapalodo', 'Pundido'],
  Others: ['Lata', 'Yero']
};

export const UNITS = ['kg', 'pcs'];

export const getMainCategories = () => Object.keys(CATEGORIES);

export const getSubCategories = (mainCategory) => {
  return CATEGORIES[mainCategory] || [];
};

export const isValidCategory = (mainCategory, subCategory) => {
  return CATEGORIES[mainCategory]?.includes(subCategory) || false;
};
