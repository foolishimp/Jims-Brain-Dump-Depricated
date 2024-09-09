// src/utils/colorUtils.js

export const POSTIT_COLORS = {
  yellow: ['#ffff88', '#ffff44'],
  pink: ['#ffb6c1', '#ff69b4'],
  orange: ['#ffa500', '#ff8c00'],
  blue: ['#87cefa', '#1e90ff'],
  cyan: ['#00ffff', '#00ced1'],
  purple: ['#dda0dd', '#ba55d3'],
  green: ['#90ee90', '#32cd32'], // Added green color
};

export const getColorName = (colorValue) => {
  for (const [name, shades] of Object.entries(POSTIT_COLORS)) {
    if (shades.includes(colorValue)) {
      return name;
    }
  }
  return 'yellow'; // Default color
};