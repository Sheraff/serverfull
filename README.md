# serverfull

```shell
pnpm dev
```

starts 
- `$ pnpm dev:client`: a `vite` server on port `3000` for the frontend
- `$ pnpm dev:server`: a `fastify` server on port `3001` for the backend, reachable from port `3000` via `/api`
- `$ pnpm dev:inngest`: an `inngest` admin client on port `8288` for observability