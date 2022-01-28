# Ta vivo - Health Check

![dashbaord](./docs/images/dashboard.png)

# Development

For install all apps dependencies use;

```bash
$ yarn
```

Now you can continue.

## UI

Set up the env vars;

```bash
$ cp ./ui/.env.example ./ui/.env
```

Run development server;

```bash
$ yarn dev:ui
```

## API

Create the `.env` file into `api` directory, use the `.env.example` file;

```bash
$ cp ./api/.env.example ./api/.env
```

:warning: The default user is on the `.env` file;

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secret
```

Run development server

```bash
$ yarn dev:api
```

---

:heart: