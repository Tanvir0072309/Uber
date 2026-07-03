# Ubar Frontend

Ubar Frontend ek modern ride-booking style React application hai. Iska focus clean mobile-first experience, simple onboarding, user-friendly forms, aur user/captain dono ke liye separate polished flows par hai.

## About The App

Ubar ka frontend ride app experience ko simple aur familiar banata hai. Home screen par full-screen visual background, clear brand logo, aur bottom action panel diya gaya hai jisse user quickly app start kar sakta hai.

Application me user aur captain dono ke liye dedicated login aur signup experiences hain. UI clean black-and-white theme follow karta hai, rounded input fields use karta hai, aur forms ko mobile screen ke hisaab se comfortable spacing ke saath design kiya gaya hai.

## Key Features

- Clean and minimal ride-booking app interface
- Mobile-first layout with full-screen home experience
- User login and signup screens
- Captain login and signup screens
- Separate captain onboarding with vehicle information
- Vehicle type selection with car, bike, and auto images
- Form validation for name, email, password, vehicle plate, vehicle color, and capacity
- Dynamic error messages shown near each input
- Vehicle color preview while entering captain vehicle details
- Auto-uppercase behavior for vehicle plate input
- Smooth hover and active button feedback
- Consistent logo usage across screens
- Tailwind CSS based responsive styling

## User Experience

The app is designed to feel direct and lightweight. Inputs are large, readable, and easy to tap. Buttons are visually strong, with black primary actions that make the next step clear.

User screens are focused on creating or accessing a rider account quickly. Captain screens include extra vehicle details while still keeping the layout simple and readable.

## Captain Experience

Captain signup includes a richer form because captains need vehicle details. The form supports:

- First and last name
- Email and password
- Vehicle type selection
- Vehicle color
- Plate number
- Seating capacity

Vehicle selection uses visual cards for car, bike, and auto, making the form easier to understand at a glance.

## Form Validation

The frontend includes client-side validation before form submission. It checks common mistakes like invalid email, short password, missing required fields, invalid plate number, and incorrect seating capacity.

For captain vehicles, seating capacity is checked according to selected vehicle type:

- Bike: maximum 2 seats
- Car: maximum 4 seats
- Auto: maximum 5 seats

## Visual Design

The interface uses a clean Uber-inspired style:

- White backgrounds
- Black primary buttons
- Soft gray input fields
- Rounded form controls
- Subtle shadows and transitions
- Full-screen visual home page
- Clear separation between rider and captain actions

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- ESLint

## Project Structure

```text
Frontend/
  public/
  src/
    assets/
    pages/
    App.jsx
    main.jsx
    index.css
  index.html
  package.json
  tailwind.config.js
  vite.config.js
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Assets

The frontend includes image assets for branding, home screen visuals, and vehicle selection. These assets help the UI feel closer to a real ride-booking product instead of a plain form demo.

## Current State

The frontend currently focuses on layout, navigation between screens, visual design, and client-side validation. Form data is prepared and logged after successful validation, making the UI ready for future integration work.
