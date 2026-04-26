# Petman Spec

## Goal

Build a small retro, pixel-art inspired Pac-Man themed website.

The experience should begin with a responsive player selection screen, then launch into a simple Pac-Man style game using the selected pet as the player character.

## Product Scope

The product should include two states inside a single web app:

- A character selection screen
- A game screen

### Character Selection Screen

The first screen must show:

- A single full-screen view
- The title: `choose your player`
- Four selectable player cards
- Characters representing:
  - a grey cat
  - a black cat
  - a black dog
  - a black and white cat

The selection screen must allow the user to:

- Move the active selection from character to character
- Confirm selection of one character
- Clearly see which character is currently focused
- Clearly see which character has been selected
- Start the game after a character is selected

### Game Screen

After selection, the app must launch a simple Pac-Man style game.

The game screen must include:

- A maze-like playfield
- The selected character as the player avatar
- Ghost enemies
- Bowls of pet food as the collectible items
- Plants and brick walls as maze obstacles
- A visible score
- A visible game over or win state

This version does not need:

- Backend or persistence
- Authentication
- Multiplayer
- Sound
- Character stats
- Multiple levels unless implementation later adds them intentionally
- Online leaderboard

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

### Game Screen Structure

- A centered playfield with a fixed aspect ratio
- A retro HUD around or above the maze
- A score display
- Optional lives display
- A short label showing the chosen player
- A restart or return action after game over or win

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

### Launch Behavior

- Once the user confirms a character, the app transitions from the selection screen to the game screen
- The chosen character must become the in-game player immediately
- The selected character identity must persist for the duration of the run

### Game Controls

Support:

- Keyboard on desktop
- Touch-friendly controls on mobile

Keyboard behavior:

- Arrow keys move the player through the maze

Touch behavior:

- Provide large on-screen directional controls or an equally clear mobile-friendly input method

### Core Gameplay Rules

- The player moves through a maze collecting bowls of pet food
- Ghosts move through the maze as enemies
- Plants and brick walls block movement and define paths
- The player should avoid ghosts while collecting all required bowls
- Collecting every bowl of pet food wins the round
- Touching a ghost causes a loss condition or removes a life, depending on final implementation choice

### Collision Rules

- The player cannot move through brick walls
- The player cannot move through plants
- Ghosts obey maze boundaries and obstacle collisions
- Bowls of pet food disappear once collected

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

### Game Entity Art

The game entities should follow the same pixel-art direction.

- Player:
  - use the selected pet from the character selection screen
  - each of the four pets should be recognizable in-game even at small size
- Enemies:
  - ghosts should clearly read as arcade ghost enemies
  - they can use different colors to improve readability
- Collectibles:
  - bowls of pet food should be small but visually distinct from the floor
- Obstacles:
  - brick walls should define the major maze boundaries
  - plants should act as additional blockers or decorative obstacle clusters

### Maze Theme

The maze should feel like a pet-themed reinterpretation of Pac-Man rather than an exact copy.

- Ghosts replace classic enemies
- Bowls of pet food replace dots or pellets
- Plants and brick walls replace standard maze walls or environmental blockers
- The overall look should remain arcade-like and readable at a glance

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
- Minimal complexity for both the selection UI and the game screen
- Good mobile browser support
- Easy for future agents to extend into a real Pac-Man game
- TypeScript helps keep input, selection state, and future game logic predictable
- Plain CSS is enough here and avoids unnecessary styling runtime cost

### Rendering Recommendation

Use regular React rendering for menus and HUD, and choose one of these for the game board:

1. DOM/CSS grid rendering if the game remains small and tile-based
2. Canvas rendering if movement, animation, and enemy logic grow beyond simple tile updates

Current recommendation:

- Start with a tile/grid-based implementation in React because it is simpler to build and debug
- Move to `canvas` later only if performance or animation needs justify it

## Architecture

Keep the project intentionally small.

Suggested structure:

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/CharacterSelect.tsx`
- `src/components/CharacterCard.tsx`
- `src/components/GameBoard.tsx`
- `src/components/Hud.tsx`
- `src/components/TouchControls.tsx`
- `src/data/characters.ts`
- `src/data/maze.ts`
- `src/game/logic.ts`
- `src/game/types.ts`
- `src/styles.css`
- `src/assets/` for sprites if assets are used

## State Model

Selection state:

- `focusedCharacterId`
- `selectedCharacterId`
- `screen` with values such as `select`, `playing`, `gameOver`, `victory`

Game state:

- `playerPosition`
- `playerDirection`
- `ghosts`
- `remainingFoodBowls`
- `score`
- `lives` if lives are included
- `isGameOver`
- `isVictory`

Character data model:

- `id`
- `name`
- `species`
- `coatDescription`
- `sprite` or `spriteVariant`

Maze and entity model:

- `tileType`
- `isWalkable`
- `containsFoodBowl`
- `containsPlant`
- `containsBrickWall`
- `ghostSpawn`
- `playerSpawn`

## Responsive Behavior

### Mobile

- Prioritize portrait layout
- Large tap targets
- Keep cards readable without zoom
- Respect safe areas

### Desktop

- Maintain arcade cabinet feel with a centered stage
- Keep the content width constrained so it still feels game-like

### Game Responsiveness

- The maze must remain fully visible on common mobile screens without horizontal scrolling
- HUD and controls must not cover important game tiles
- On mobile, reserve space for touch controls below or beside the playfield

## Performance Requirements

- Initial page should load quickly on mobile
- Avoid heavy animation libraries
- Keep assets lightweight
- Prefer CSS transitions over complex JS animation
- Avoid unnecessary dependencies
- Keep game update logic simple and deterministic
- Prefer tile-based movement to reduce rendering complexity in the first game version

## Accessibility

- Character options must be keyboard reachable
- Focus state must be clearly visible
- Text must maintain readable contrast
- Selection feedback should not rely on color alone
- Game HUD text should remain legible on mobile
- Touch controls should be comfortably tappable

## Implementation Notes For Future Agents

- Build the selection screen first before adding any game logic
- If no artist-provided assets exist yet, generate simple placeholder pixel portraits locally and keep them easy to replace
- Favor deterministic, explicit keyboard navigation rather than relying only on browser tab order
- Treat this page as the future front door to the game, so code should stay clean and extensible
- Keep gameplay rules intentionally simple in the first game version
- Use clear separation between UI state and game simulation state
- Represent the maze as structured data rather than hardcoding behavior into JSX
- Keep entities tile-aligned at first instead of attempting smooth analog movement

## Gameplay Specification

### Player

- The player is the pet chosen on the selection screen
- The chosen pet sprite must carry into gameplay
- Different pets do not need different abilities in the first version

### Enemies

- Enemies are ghosts
- Ghosts patrol or chase through valid maze paths
- Ghost behavior can be simpler than classic Pac-Man in the first version, but they must create pressure and failure risk

### Collectibles

- Collectibles are bowls of pet food
- Every bowl collected increases the score
- Clearing all bowls wins the level

### Obstacles

- Brick walls are major solid barriers that shape the maze
- Plants are also blocking obstacles
- Plants may be used for smaller choke points, corners, or decorative maze pockets
- Both obstacle types must be visually distinct from walkable floor tiles

### Win And Loss Conditions

Win condition:

- All bowls of pet food have been collected

Loss condition:

- The player collides with a ghost and loses the run

Optional extension:

- Add multiple lives later if desired, but a single-life run is acceptable for the first playable version

## Game Flow

1. The app opens on the selection screen.
2. The user focuses a pet.
3. The user confirms the pet choice.
4. The app transitions into the maze.
5. The chosen pet becomes the player avatar.
6. The player collects bowls of pet food while avoiding ghosts and navigating around plants and brick walls.
7. The game ends in either victory or defeat.
8. The user can restart the run or return to character selection.

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
- After selection, the app launches into a Pac-Man style game screen
- The selected pet is used as the player character in the maze
- Ghosts act as enemies
- Bowls of pet food act as the collectibles
- Plants and brick walls act as obstacles
- The player can move through walkable paths and cannot pass through obstacles
- The round ends with a clear win or loss state
- The page is usable on mobile and desktop
- The style clearly suggests retro/pixel arcade presentation

## Out Of Scope For This Milestone

- Saved progress between sessions
- Multiplayer
- Online leaderboard
- Advanced ghost AI matching original Pac-Man exactly
- Cutscenes
- Menus, settings, credits, or account systems
