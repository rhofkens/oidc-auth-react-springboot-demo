# Step 03: Guest UI Skeleton (Frontend) - Detailed Tasks

This document breaks down the implementation of Step 03 into granular tasks.

## A. Hook Implementation

**Create the useFetch hook:**
* Create a new file `frontend/src/hooks/useFetch.ts`:
  * Implement a generic hook that wraps the fetch API
  * Add TypeScript generics for the response type
  * Handle loading state, success state, and error state
  * Implement error handling that logs errors to the console
  * Add TSDoc comments explaining the hook's purpose and parameters

## B. Component Implementation

**Create the Header component:**
* Create a new file `frontend/src/components/Header.tsx`:
  * Display "Browsing as Guest" text
  * Add a disabled Login button
  * Use Tailwind CSS for styling
  * Add TSDoc comments

**Create the Tiles Grid layout:**
* Create a new file `frontend/src/components/TilesGrid.tsx`:
  * Implement a responsive grid layout using Tailwind CSS
  * Accept child components as props
  * Add TSDoc comments

**Create the PublicTile component:**
* Create a new file `frontend/src/components/PublicTile.tsx`:
  * Use the `useFetch` hook to call `/api/v1/public/health`
  * Display a loading spinner while fetching
  * Display an error message if the fetch fails
  * Display the `message` value from the response if successful
  * Use shadcn/ui card component for consistent styling
  * Add TSDoc comments

**Create the PrivateTile component:**
* Create a new file `frontend/src/components/PrivateTile.tsx`:
  * Display the static placeholder text: "No access to private endpoint. Please login to get access."
  * Use shadcn/ui card component for consistent styling
  * Add TSDoc comments

**Update the App component:**
* Update `frontend/src/App.tsx`:
  * Remove the default Vite + React content
  * Import and use the Header component
  * Import and use the TilesGrid component
  * Add PublicTile and PrivateTile as children to the TilesGrid
  * Use Tailwind CSS for layout and styling

## C. Test Implementation

**Implement tests for the components:**
* Create the `frontend/src/__tests__` directory structure:
  * Create subdirectories for `hooks` and `components`
* Move the existing `frontend/src/App.test.tsx` to `frontend/src/__tests__/App.test.tsx` and update it:
  * Test that all components are rendered correctly
* Create `frontend/src/__tests__/hooks/useFetch.test.ts`:
  * Test successful fetch scenario
  * Test error handling scenario
* Create `frontend/src/__tests__/components/PublicTile.test.tsx`:
  * Test loading state
  * Test successful fetch scenario (mock the useFetch hook)
  * Test error state scenario (mock the useFetch hook)
* Create `frontend/src/__tests__/components/PrivateTile.test.tsx`:
  * Test that the placeholder text is rendered correctly
* Create `frontend/src/__tests__/components/Header.test.tsx`:
  * Test that "Browsing as Guest" text is displayed
  * Test that the Login button is disabled
* Create `frontend/src/__tests__/components/TilesGrid.test.tsx`:
  * Test that child components are rendered correctly

## D. Configuration

**Update the Vite configuration:**
* Update `frontend/vite.config.ts`:
  * Add the dev server proxy configuration to forward `/api` requests to `http://localhost:8080`
  * Ensure the test configuration remains intact

## E. Documentation Updates

**Update project documentation:**
* Update the root `README.md`:
  * Add instructions to start the frontend dev server
  * Note the `/api` proxy requirement
* Update `CHANGELOG.md`:
  * Add entry: "**Step 03** – Guest UI skeleton with health fetch."
* Ensure all new components and hooks have proper TSDoc comments

## F. Verification

**Verify the implementation:**
* Run the backend with `./mvnw spring-boot:run` from the `backend/` directory
* Run the frontend with `pnpm dev` from the `frontend/` directory
* Verify that the UI shows:
  * Header with "Browsing as Guest"
  * PublicTile with the live message "Service up"
  * PrivateTile with the placeholder text
* Stop the backend and verify that the PublicTile shows an error state
* Run the frontend tests with `pnpm test` from the `frontend/` directory
* Verify test coverage is ≥ 80% with `pnpm test -- --coverage`

*End of Tasks for Step 03*