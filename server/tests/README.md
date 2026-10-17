# Test suite layout

| Path | Purpose |
|------|---------|
| `unit/` | Pure-logic tests, no database (overdue rule, JWT, role middleware, response helpers) |
| `integration/` | HTTP tests against the real Express app + real MongoDB (auth, complaints, feedback, dashboard) |
| `setup/env.js` | Test-only environment variables (no real secrets) |
| `setup/db.js` | Starts/stops the test database (mongodb-memory-server, or `MONGO_URI_TEST`) |
| `helpers/factory.js` | Creates users, complaints (with any age) and JWTs |
| `helpers/recorder.js` | Records the actual result of each test for the report |
| `run_with_evidence.js` | `npm run test:evidence` - runs everything and saves evidence |

Every test title starts with its Test ID (`TC-xx`) from `05_Testing/Test_Cases.pdf`.
