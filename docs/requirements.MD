# Food Wheel App Development Requirements

## Project Objective

Develop a responsive "What to Eat Today" wheel web application that helps users randomly decide what to eat. Users can add custom recipes or select from recommended recipes, and spin the wheel to randomly select a result.

## Tech Stack

- **Frontend Framework**: Next.js (App Router)
- **Development Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: SQLite (local database)

## Feature Requirements

1. **Recipe Management**
   - System pre-populated popular recipe list
   - Users can add custom recipes
   - Users can select recipes from the popular recipe list to add to the wheel
   - Users can delete recipes from the wheel
   - Each wheel supports a maximum of 12 recipes

2. **Wheel Functionality**
   - Dynamically generate wheel based on user-added recipes
   - Each recipe uses different colors for distinction
   - Click button to trigger wheel rotation animation
   - Display randomly selected result after rotation ends

3. **User System**
   - No-login design, using UUID to generate unique user ID
   - User ID stored in SQLite database for persistence
   - Automatically generate user ID and initialize on first visit

4. **Responsive Design**
   - Adapt to mobile, tablet, and desktop devices
   - Appropriate layout and interaction methods for different devices

## Data Storage Design

### Database Schema

- **users table**: Store user's unique identifier and creation time
  - `id` (TEXT PRIMARY KEY): User's unique identifier (UUID)
  - `created_at` (DATETIME): User creation timestamp

- **popular_recipes table**: System pre-populated recipe list, containing recipe ID and name
  - `id` (INTEGER PRIMARY KEY): Recipe ID
  - `name` (TEXT): Recipe name

- **user_custom_recipes table**: Recipes created by users
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Custom recipe ID
  - `user_id` (TEXT): Foreign key to users table
  - `name` (TEXT): Recipe name
  - `created_at` (DATETIME): Creation timestamp

- **user_wheel_items table**: Recipes added to user's wheel
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Wheel item ID
  - `user_id` (TEXT): Foreign key to users table
  - `recipe_name` (TEXT): Recipe name
  - `source_type` (TEXT): 'popular' or 'custom'
  - `color` (TEXT): Color assigned to this recipe on the wheel
  - `created_at` (DATETIME): Creation timestamp

### Data Relationship Description

1. **Popular Recipes**: System pre-populated, shared by all users, users cannot modify
2. **Custom Recipes**: Each user can create their own recipes
3. **Wheel Items**: Users can add popular recipes or custom recipes to their wheel
4. **Uniqueness Rule**: Duplicate recipe names are not allowed in the same user's wheel

## Business Logic Design

1. **User Identification Handling**
   - Generate UUID and store in SQLite database on first visit
   - Retrieve user ID from SQLite database on subsequent visits
   - Regenerate if retrieval fails

2. **Recipe Data Management**
   - Load user wheel items and popular recipes on initialization
   - Check for existence before creating custom recipes
   - Create association record when adding popular recipe to wheel
   - Delete operation only removes association between user and recipe

3. **Wheel Logic**
   - Dynamically generate wheel based on user's wheel item data
   - Implement wheel rotation using CSS animations
   - Randomly select result and control wheel stop position
   - Result display and highlight handling

## User Experience Design

1. **Page Layout**
   - Top: Application title and brief description
   - Middle: Wheel component and result display
   - Bottom/Side: Recipe management interface

2. **Interaction Design**
   - Prominent spin button at wheel center
   - Simple and intuitive recipe addition form
   - Quick selection and addition of popular recipes
   - One-click deletion of added recipes

3. **Responsive Adaptation**
   - Mobile: Vertical layout, wheel on top, recipe management below
   - Tablet/Desktop: Horizontal layout, wheel on left, recipe management on right
   - Wheel size automatically adjusts based on screen size

## Implementation Steps

### 1. Project Initialization and Environment Configuration

```bash
# Create Next.js project
npx create-next-app food-wheel-app --typescript
cd food-wheel-app

# Install dependencies
npm install uuid better-sqlite3
npm install -D @types/uuid @types/better-sqlite3

# Configure Tailwind CSS (already included in Next.js project)
```

### 2. Database Setup

1. Create SQLite database file and schema
2. Create database initialization script
3. Define data structure interfaces/types
4. Initialize popular recipe data in database
5. Create database utility functions for CRUD operations

### 3. Project Structure Setup

1. Create basic directory structure
2. Set up SQLite database connection and utilities
3. Implement user ID generation and management functionality

### 4. Component Development

1. Create wheel component
   - SVG implementation for wheel visual effects
   - Rotation animation and result selection logic

2. Create recipe management component
   - Custom recipe addition form
   - Popular recipe selection list
   - Added recipe display and deletion

3. Implement page layout and responsive design

### 5. Data Interaction Implementation

1. User data initialization
2. Recipe data CRUD operations (using SQLite)
3. Wheel data and view binding

### 6. Optimization and Testing

1. Performance optimization
2. Cross-device testing
3. Edge case handling

## Acceptance Criteria

1. Wheel correctly displays user-added recipes
2. Wheel rotation animation is smooth, result selection is random and effective
3. Recipe management functionality works correctly
4. User data is correctly persisted
5. Displays correctly and is user-friendly on different devices
