# Rive Animation Files

This directory is where you should place your .riv animation files created with the Rive editor.

## Creating Rive Animations

1. Go to https://rive.app and create an account
2. Create a new animation for each game type:
   - slot_machine.riv
   - roulette.riv
   - card_game.riv
3. Export your animations as .riv files and place them in this folder

## Connecting Animations to the App

In the scripts.js file, you'll need to modify the `loadRiveAnimation` function to load your actual Rive files instead of using the placeholder animations:

```javascript
async function loadRiveAnimation(animationName = 'slot') {
    try {
        // Clean up previous instance
        if (riveInstance) {
            riveInstance.cleanup();
        }

        // Map game type to .riv file
        const fileMap = {
            'slot': 'animations/slot_machine.riv',
            'roulette': 'animations/roulette.riv',
            'card': 'animations/card_game.riv'
        };

        // Load the appropriate .riv file
        const r = new rive.Rive({
            src: fileMap[animationName],
            canvas: riveCanvas,
            autoplay: true,
            stateMachines: 'State Machine 1',
            onLoad: () => {
                console.log(`${animationName} animation loaded`);
                artboard = riveInstance.renderer;
                
                // Set up inputs based on the current game
                setupInputs(animationName);
                
                // Update UI
                updateUI();
            }
        });
        
        riveInstance = r;
    } catch (error) {
        console.error('Error loading Rive animation:', error);
        
        // Fallback to placeholder
        createPlaceholderAnimation(animationName);
    }
}
```

## Animation Guidelines

For best results:
- Create animations at 60fps
- Use State Machines to control different states (idle, spinning, win, etc.)
- Add input triggers for user interactions
- Use consistent sizing across all animations
- Test animations in the browser before finalizing 