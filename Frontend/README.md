# Ubar Frontend 🚗🏍️🛺

Ubar Frontend is a modern, production-ready ride-booking web application designed with a mobile-first philosophy. Built using **React**, **Vite**, and **Tailwind CSS**, the project prioritizes an intuitive user onboarding experience, frictionless form flows, and distinct, polished journeys for both Riders and Captains (drivers).

---

## 🚀 Key Features

* **Mobile-First Architecture:** Optimized layout structures crafted specifically for a native app feel on mobile viewports.
* **Dual Authentication Workflows:** Tailored, isolated Login and Registration systems for both Riders and Captains.
* **Structured Captain Onboarding:** Comprehensive data collection pipeline for driver profiles and vehicle asset registration.
* **Visual Asset Selection:** Interactive UI cards featuring high-quality graphics for Car, Bike, and Auto selection.
* **Inline Client-Side Validation:** Real-time form evaluation covering structural validation for names, emails, passwords, license plates, colors, and seating capacities.
* **Dynamic Visual Aids:** Live vehicle color preview indicators that update reactively based on input strings and auto-capitalization constraints on vehicle license plate inputs.
* **Fluid Motion & Feedback:** Enhanced user feedback loop utilizing smooth transitions, hover states, and active scale micro-interactions.

---

## 🛠️ Tech Stack

The application is built using modern web technologies focused on performance and developer velocity:

* **Core Library:** [React](https://react.dev/) (Functional components with Hooks state architecture)
* **Build Toolchain:** [Vite](https://vite.dev/) (For ultra-fast Hot Module Replacement and highly optimized production bundlings)
* **Styling Engine:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first framework for rapid responsive styling)
* **Routing:** [React Router Dom](https://reactrouter.com/) (For fluid single-page transitions)

---

## 📐 User Experience & Workflows

### Rider Experience
The rider experience is engineered to be lightweight and declarative. Touch targets are large and accessible to reduce accidental inputs. High-contrast primary action buttons clearly map out the flow, enabling riders to create or log into accounts with minimal cognitive overhead.

### Captain Onboarding
To ensure operational compliance, the Captain registration process handles richer datasets without sacrificing layout readability. The capture sequence includes:
1. **Identity Credentials:** First name, last name, and validated contact credentials.
2. **Vehicle Classification:** Interactive modal components for fleet tagging (Car, Bike, Auto).
3. **Asset Properties:** Vehicle identification (Plate No.), exterior color configurations, and passenger capacity.

---

## 🔒 Business Logic & Validation Constraints

The client-side validation engine strictly evaluates datasets prior to form processing to prevent bad payload submissions. Beyond standard regex email validation and password entropy checks, the system enforces contextual domain rules for fleet capacity:

| Vehicle Type | Capacity Constraint | UI Asset Component |
| :--- | :--- | :--- |
| 🏍️ **Bike** | Maximum 2 seats | Integrated Bike Illustration |
| 🚗 **Car** | Maximum 4 seats | Integrated Car Illustration |
| 🛺 **Auto** | Maximum 5 seats | Integrated Auto Illustration |

---

## 🎨 Visual Design System

Inspired by elite-tier global mobility applications, the frontend relies on a hyper-clean visual language:
* **Color Palette:** Pure white canvases supplemented by rich neutral depth shades (`#000000` / `#ffffff`).
* **Ergonomics:** Deep input fields featuring soft gray backgrounds (`bg-gray-100`) moving fluidly to crisp dark focus borders (`focus:border-black`).
* **Layout Grid:** Sophisticated spatial distributions built on explicit microscale padding schemes for effortless readability.

---
