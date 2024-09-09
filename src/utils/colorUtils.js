// src/utils/colorUtils.js

export const POSTIT_COLORS = {
  yellow: '#ffff88',
  pink: '#ffb6c1',
  orange: '#ffa500',
  blue: '#87cefa',
  cyan: '#00ffff',
  purple: '#dda0dd',
};

export const getColorName = (colorValue) => {
  return Object.keys(POSTIT_COLORS).find(key => POSTIT_COLORS[key] === colorValue) || 'yellow';
};