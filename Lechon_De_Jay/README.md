# Lechon De Jay: Web-Based Ordering and Management System

Website and ordering system for **Lechon De Jay**, a Filipino lechon store in Casimiro Westville, Ligas 2, Bacoor City, Cavite. Open daily 10 AM to 10 PM for dine-in and takeout.

Web Development Project (BSIS 3C-M), Phase 1. Built with **HTML, CSS and JavaScript only**.

**Live site:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME

## Team

| Member | Role |
| --- | --- |
| Salcedo, Tristan Anjelo A. | Project Manager |
| Contadan, Jeric | Database / Back-End |
| Olvina, Drew Carlos R. | Front-End Developer |
| Pascual, Meg-Ryan O. | Content Writer |
| Panis, Jayson | UI/UX Designer |

Submitted to: Doc. Mary Joy Viñas

## Features

**Customer side**

- Account registration and login (with a data privacy consent)
- Menu with categories, cart and online ordering (dine-in or takeout, pickup time within store hours)
- Online lechon reservation (size, date, time, add-ons) with a lead time and a daily limit
- Event booking (birthday, wedding, fiesta and more) that staff confirm
- Payment integration (simulated GCash and Maya, or pay at pickup) with a deposit for reservations and events
- Order tracking with a status bar (Received, Confirmed, Preparing, Ready for pickup, Completed)
- Order history, printable receipts, "Order again", and cancel
- Customer reviews (shown after the owner approves them)
- Profile page

**Admin side** (owner and staff)

- Dashboard with today's orders, pending requests, upcoming events and sales
- Order queue: change status, mark paid, cancel with a reason (customers see a message)
- Reservation and event calendar with the daily lechon limit
- Menu management: add, edit, hide, sold out, prices
- Customers and contact-form messages, block or unblock accounts
- Review moderation
- Reports with a sales chart, best sellers, payment methods and CSV export
- **Demand forecasting for lechon orders** (next 14 days, by size, with likely range, reserved lechon and the daily limit)
- **Customer preference analysis**: best sellers and slow movers, busiest days and hours, items often bought together, repeat customers, customer groups, ratings per item
- Settings for store rules (lead time, daily limit, deposit, hours, peak periods)

Staff can see the dashboard, orders, calendar and availability. Only the owner (admin) can change prices, see reports and forecasts, and edit settings.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin (owner) | admin@lechondejay.test | admin123 |
| Staff | staff@lechondejay.test | staff123 |
| Customer | customer@lechondejay.test | customer123 |

These are for the class demo only.

## How it works

There is no server. All data (accounts, orders, reservations, reviews, settings) is saved in the browser with `localStorage`, so it is saved per browser. To demo the full flow, use one browser: place an order as a customer, then log in as admin in the same browser to process it. Payment is simulated and uses no real money. Passwords are hashed in the browser for the demo; a real system hashes them on a server.

Forecasts use a weekday average of past whole-lechon orders, multiplied by a peak-period boost (Christmas, New Year, fiestas) that the owner can edit in Settings. The store opened in July 2026, so the admin pages have an **Include sample data** switch. It adds 70 days of made-up sales so the charts can be shown in the demo. Turn it off to see only real orders.

## Project structure

```
Lechon De Jay/
├── index.html      Home
├── about.html      About Us
├── menu.html       Menu and add-ons
├── gallery.html    Photo gallery
├── contact.html    Contact form, map and hours
├── register.html   Create account
├── login.html      Log in
├── profile.html    My profile
├── cart.html       Cart and checkout
├── reserve.html    Lechon reservation
├── event.html      Event booking
├── orders.html     My orders (tracking, history, reviews)
├── admin.html      Admin and staff area
├── style.css       Styles
├── script.js       All interactivity (organized in numbered sections)
├── assets/         Images and icons
├── README.md
├── .gitignore
└── LICENSE
```

## Run locally

1. Install Visual Studio Code and the **Live Server** extension.
2. Open this folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.

## Add your photos

Put image files in `assets/`. Then in `script.js`, near the top, set the file names in `IMAGES` (hero and category cards) and `GALLERY` (gallery photos), for example `'assets/banner.jpg'`. Menu item photos can be added with an `img` field.

## Design

- Colors: Roast Red `#B5361B`, Deep Brown `#3B1F14`, Golden `#E9A23B`, Warm White `#FBF3EE`, Charcoal `#2B2B2B`
- Fonts: Playfair Display (headings) and Open Sans (body)
- Responsive for phone, tablet and desktop; the admin pages are tablet-first
- Semantic HTML, alt text, labeled forms, keyboard use and visible focus outlines

## Notes

- Menu items and prices come from the store's price list. The owner can change them in Admin > Menu. Add item photos by setting `MENU_IMAGES` in `script.js` (for example `'m-budget': 'assets/budget-meal.jpg'`).
- Reservation rules (2 days ahead, 5 whole lechon per day, 50% deposit) are sample values. Change them in Admin > Settings.
- The store phone number is empty until the owner adds it in Admin > Settings.
- Later phases: franchise page, delivery apps, a real payment gateway and server database, inventory and POS link, and loyalty rewards.
