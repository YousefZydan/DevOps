# Scaling

This stack is **not** load-tested to millions of users. It is structured so you can grow without rewriting the product.

| Users (order of magnitude) | Typical next step |
|---|---|
| 100 | One VPS, compose as documented |
| 1,000 | Managed SQL (Azure SQL), 2 backend replicas, keep Redis |
| 10,000 | Separate DB SKU, CDN for frontend, APM (App Insights / Grafana) |
| 100,000 | Kubernetes or App Service + Azure SQL elastic, autoscale, cache hot doctor lists |
| 1,000,000+ | Dedicated DBA work, read replicas, queue for notifications, shard or CQRS if measurements show need |

## What is already in the code for scale

- JWT (no sticky in-memory sessions)
- Redis optional for distributed cache
- SQL indexes on appointments
- `AsNoTracking` on doctor list queries
- Reverse proxy can load-balance multiple backend containers later
- Health checks for orchestrators

## What is not done

- Horizontal replica count in compose (still 1)
- Query pagination on `GET /api/Doctor/All` (frontend currently expects a full list)
- Load test evidence beyond the sample `scripts/load-test.js`

Run a first load check after deploy:

```bash
k6 run -e BASE_URL=https://yourdomain.com scripts/load-test.js
```
