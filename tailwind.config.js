/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: ['./views/**/*.{html,js,ejs}', './public/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['sunset', 'autumn', 'valentine'],
  },
};
