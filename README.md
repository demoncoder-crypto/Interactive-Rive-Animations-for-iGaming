# Interactive Rive Animations for iGaming

This project demonstrates how to use Rive animations to create interactive iGaming experiences. It includes a simple demo interface for slot machines, roulette, and card games with animated elements.

## Features

- Three interactive game modes: Slot Machine, Roulette, and Card Game
- Real-time balance updates and betting mechanics
- Smooth animations and transitions
- Responsive design that works on all devices
- Canvas-based fallback animations if Rive isn't available

## How to Run

1. Simply open `index.html` in a modern web browser to run the application
2. No build process or server required - this is a standalone HTML/CSS/JS project

## Using the Demo

1. Select a game type from the left sidebar
2. Set your bet amount (between 1 and 100)
3. Click the action buttons (Spin or Deal) to play
4. Watch your balance update based on the outcome
5. Use the Reset button to start over with a fresh balance

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and animation CSS
- `scripts.js` - JavaScript code for game logic and Rive animation handling

## Technical Details

This project uses:

- Rive Runtime Web for animations
- Canvas API for fallback animations
- Modern JavaScript (ES6+) features
- CSS Grid and Flexbox for responsive layouts

## Adding Real Rive Animations

To use actual Rive animations:

1. Create your .riv files using the Rive editor (https://rive.app)
2. Replace the placeholder animation code in `scripts.js` with loading of your .riv files
3. Connect the state machines and inputs to your animations

## License

This project is for demonstration purposes only. 