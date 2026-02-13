

# Viking Trail - Murder Mystery Tourist Game

## Overview
A mobile-first, GPS-based murder mystery game set in Vaxholm, Stockholm. Players walk through real-world locations, solving riddles to uncover clues and ultimately identify the murderer. The app features a historic/vintage aesthetic fitting the 1800s Swedish maritime setting.

---

## Core Features

### 1. Mobile-First Design
- Clean, easy-to-read interface optimized for phones
- Historic/vintage visual theme with aged paper textures, serif fonts, and muted period-appropriate colors
- Smooth navigation between locations and game states
- Map view showing current location and destination

### 2. User Accounts & Progress
- Sign up and login functionality
- Persistent progress saved to user accounts
- Users can close and reopen the app without losing progress

### 3. GPS-Based Location Unlocking
- Uses phone GPS to detect when user arrives at a location
- Locations unlock only when physically present (or via Playtest mode)
- Shows walking directions to next destination when not at correct location
- Distance indicator to current target location

### 4. Game Progression Flow
- **Location 1 (Österhamnen)**: Introduction with story context and all 5 characters - unlocked from start
- **Location 2 (Norrhamnen: Kullarna)**: First puzzle location - unlocked from start
- **Locations 3-9**: Locked until previous location is completed (GPS reached + correct answer)
- Multiple-choice questions at each location
- Correct answer reveals clue and unlocks next location
- Wrong answer shows "try again" message

### 5. Character Profiles
- Dedicated Characters section in the app
- View all suspects with their photos, names, ages, and bios
- Pre-loaded with 5 characters: Tulda Thomasson, Jonas Thomasson, Kapten Löfving, Reverend Helsenius, Mrs. Svensson

### 6. Stripe Payment Integration
- Paywall before accessing game content
- Users must pay to unlock a city/mystery
- Payment confirmation required before playing

### 7. Playtest Mode (Developer Toggle)
- Single `PlaytestEnabled` boolean flag controls all playtest features
- When enabled:
  - "Playtest" button on payment screen to bypass paywall
  - "Playtest" button on each locked location to bypass GPS requirement
- When disabled: No playtest buttons appear, normal flow enforced
- Easy to disable for production release

### 8. Multilingual Support
- Content structure supports multiple languages
- Riddles, clues, and location descriptions can be translated
- Language selection for users

---

## Admin Dashboard (For Non-Technical Manager)

### City/Place Management
- Create, edit, and delete cities/mysteries
- Publish/unpublish cities

### Location Management
- Add/edit/delete locations within a city
- For each location, edit:
  - Location name
  - GPS coordinates (latitude/longitude)
  - Intro paragraph text
  - Riddle/question text
  - Answer options (multiple choice) with correct answer marked
  - Clue text revealed after solving
  - Location photo upload
  - Position in the sequence (next location)

### Character Management
- Add/edit/delete characters
- Fields: Image, Name, Age, Gender, Height, Bio

### Content Publishing
- Save drafts and publish when ready
- Changes go live after publishing

---

## Pre-Loaded Content

### City: Vaxholm (Stockholm)
**9 Locations in sequence:**

1. **Berth: Österhamnen** - Introduction with story background (1868 setting) and all character introductions
2. **Norrhamnen: Kullarna** - Fishing huts area with first puzzle
3. **Norrhamnen: The Marina** - Departure point investigation
4. **Vaxholm: Lägret** - Market/center area
5. **Vaxholm: Pastorsbostaden** - Pastor's residence investigation
6. **Vaxholm: Home > Officersparken** - Officers' park area
7. **Vaxholm: Back to Pastorsbostaden** - Return visit with new clues
8. **Vaxholm: The Church** - Church investigation
9. **Vaxholm: The Port** - Final revelation location

### 5 Pre-Loaded Characters:
- **Tulda Thomasson** (15) - Quiet girl who prefers solitude on the ship
- **Jonas Thomasson** (48) - Successful merchant, experienced sailor
- **Kapten Löfving** (35) - Former navy officer, now captain of the Varg
- **Reverend Helsenius** - Kind pastor, old friend of the Thomasson family
- **Mrs. Svensson** (47) - Expert housekeeper and cook

---

## Technical Approach

### Backend (Lovable Cloud + Supabase)
- User authentication and accounts
- Database for cities, locations, characters, and user progress
- Secure storage for images

### Payment (Stripe)
- Checkout integration for city/mystery purchases
- Payment verification before game access

### Scalability
- Structured for easy addition of new cities/mysteries
- Each city has its own location sequence and story

