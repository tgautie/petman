# Petman Spec

## Goal

Build a very small first version of a retro, pixel-art inspired Pac-Man themed website.

This first milestone is not the game itself. It is a single responsive webpage that shows a player selection screen and allows the user to choose one of four characters.

## Product Scope

The page must show:

- A single full-screen view
- The title: `choose your player`
- Four selectable player cards
- Characters representing:
  - a grey cat
  - a black cat
  - a black dog
  - a black and white cat

The page must allow the user to:

- Move the active selection from character to character
- Confirm selection of one character
- Clearly see which character is currently focused
- Clearly see which character has been selected

This version does not need:

- Actual Pac-Man gameplay
- Routing or multiple pages
- Backend or persistence
- Authentication
- Multiplayer
- Sound
- Character stats

## UX Requirements

The visual style should feel:

- Retro arcade
- Pixelized
- Simple and readable
- Playful rather than realistic

The layout should work well on:

- Mobile phones
- Tablets
- Desktop browsers

### Screen Structure

- Centered game-like selection panel
- Large title at the top: `choose your player`
- Four character options displayed in a 2x2 grid on mobile and desktop unless implementation finds a stronger responsive arrangement
- Each option includes:
  - character sprite or portrait
  - short character label
  - visible focus/selection frame
- Small instruction text near the bottom

Example instruction copy:

- `tap or use arrow keys`
- `press enter to choose`

## Interaction Requirements

### Input Methods

Support:

- Touch
- Mouse
- Keyboard

### Keyboard Behavior

- Arrow keys move focus between characters
- `Enter` selects the focused character
- `Space` may also select the focused character

### Touch / Mouse Behavior

- Tapping or clicking a character moves focus to it
- Tapping or clicking the focused character selects it
- A direct select on first tap/click is also acceptable if focus and selection feedback are both clear

### Selection State

Need two visual states:

- Focused: currently highlighted for navigation
- Selected: confirmed choice

Selection should remain visible after confirmation.

## Visual Direction

### Art Style

- Pixel-art or pixel-inspired character portraits
- Limited color palette
- High contrast outlines
- Chunky borders and arcade framing

### Character Art

The first implementation can use either:

1. Hand-made simple pixel sprites created in code or as small local assets
2. Temporary placeholder pixel portraits matching the required animals and colors

Avoid photorealistic or smooth vector styles.

### Color Direction

Suggested palette direction:

- Deep near-black background
- Arcade accent colors such as neon yellow, cyan, red, and off-white
- Selected state should feel vivid and obvious

## Technical Recommendation

Use:

- `Vite`
- `React`
- `TypeScript`
- Plain CSS with CSS variables

### Why this stack

- Fast startup and fast builds
- Minimal complexity for a single-screen interactive UI
- Good mobile browser support
- Easy for future agents to extend into a real Pac-Man game
- TypeScript helps keep input, selection state, and future game logic predictable
- Plain CSS is enough here and avoids unnecessary styling runtime cost

## Architecture

Keep the project intentionally small.

Suggested structure:

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/CharacterSelect.tsx`
- `src/components/CharacterCard.tsx`
- `src/data/characters.ts`
- `src/styles.css`
- `src/assets/` for sprites if assets are used

## State Model

Minimal UI state:

- `focusedCharacterId`
- `selectedCharacterId`

Character data model:

- `id`
- `name`
- `species`
- `coatDescription`
- `sprite` or `spriteVariant`

## Responsive Behavior

### Mobile

- Prioritize portrait layout
- Large tap targets
- Keep cards readable without zoom
- Respect safe areas

### Desktop

- Maintain arcade cabinet feel with a centered stage
- Keep the content width constrained so it still feels game-like

## Performance Requirements

- Initial page should load quickly on mobile
- Avoid heavy animation libraries
- Keep assets lightweight
- Prefer CSS transitions over complex JS animation
- Avoid unnecessary dependencies

## Accessibility

- Character options must be keyboard reachable
- Focus state must be clearly visible
- Text must maintain readable contrast
- Selection feedback should not rely on color alone

## Implementation Notes For Future Agents

- Build the selection screen first before adding any game logic
- If no artist-provided assets exist yet, generate simple placeholder pixel portraits locally and keep them easy to replace
- Favor deterministic, explicit keyboard navigation rather than relying only on browser tab order
- Treat this page as the future front door to the game, so code should stay clean and extensible

## Acceptance Criteria

The milestone is complete when:

- A single webpage renders the title `choose your player`
- Four player options are visible:
  - grey cat
  - black cat
  - black dog
  - black and white cat
- The user can move focus across all four options
- The user can select one option
- Focused and selected states are visually distinct
- The page is usable on mobile and desktop
- The style clearly suggests retro/pixel arcade presentation

## Out Of Scope For This Milestone

- Starting the Pac-Man game after selection
- Saving the chosen character
- Complex transitions
- Menus, settings, credits, or scoreboards
