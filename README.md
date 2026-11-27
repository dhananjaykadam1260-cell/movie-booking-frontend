# Movie Booking: Frontend

React 19 + Vite single-page app for the movie booking system. Users browse movies, pick seats, pay (demo), and manage their bookings. Admins manage movies, theatres, screens, shows, bookings and users.

## Stack

- React 19, React Router 7
- Vite 8
- Bootstrap 5, axios

## Setup

1. Start the backend first (see `movie-booking-backend/README.md`), which runs on `http://localhost:8080`.
2. Install dependencies and configure the API URL:

   ```bash
   npm install
   cp .env.example .env   # edit VITE_API_BASE_URL if the backend is elsewhere
   ```

3. Run the dev server:

   ```bash
   npm run dev            # http://localhost:5173
   ```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API base URL |

Backend CORS must allow the frontend origin. The backend default is `http://localhost:5173`.

## Authentication

- Login stores the JWT and user details in `localStorage`.
- Every API request sends `Authorization: Bearer <token>` (`src/services/api.js`).
- A `401` response from a non-auth endpoint clears the session and redirects to the login page.
- Route guards for `/admin/*` are a UX convenience only. The backend enforces admin access.

## Project layout

```
src/
  services/api.js      Axios instance, auth header, 401 handling
  pages/               User pages (Home, MovieDetails, Seats, Payment, MyBookings, ...)
  admin/               Admin pages and the admin route guard
  components/          Shared components (Navbar)
```

## Known limits

- Payment is a demo. Card and UPI details are not sent anywhere, and no money is charged.
- Ticket PDFs are downloaded through the API with the token attached.
