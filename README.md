# Pomodoro - (Single Page Application)

![Vue](https://img.shields.io/badge/Vue-%234FC08D.svg?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-%23007ACC.svg?style=for-the-badge&logo=vite&logoColor=white)

A customizable time management app that helps you focus on any task you're working on.

Check out the live demo [here](https://pomodoro.rjon.tech).

See [Pomodoro - Backend](https://github.com/sangenshoku/pomodoroapi).

## About Pomodoro Technique

> Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.

## Features

- [x] Timer for Pomodoro Session (25 minutes).
- [x] Break timer (5 minutes and 15 minutes).
- [x] Customizable session and break durations.
- [x] Pause, resume, and stop functionality.
- [x] Add tasks to the session.
- [x] Mark tasks as completed.
- [x] Login and register.
- [ ] Sound notification when the session ends.
- [ ] Customizable Theme.
- [ ] Graphs and statistics.

## How to Use

- Click the `Start` button to start the session.
- Work during the Pomodoro session.
- Take a short break when the session ends.
- After four sessions, take a longer break.
- Repeat the process as needed.
- Optionally, you can add tasks to the session.
- Mark the tasks as completed when done.

## Technologies Used

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [DaisyUI](https://daisyui.com/)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Docker](https://www.docker.com/)

## Project Setup

### Install Dependencies

```sh
npm install
```

### Run in development mode

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests

```sh
npm run test:unit
```

### Run End-to-End Tests

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint

```sh
npm run lint
```

## Docker Setup

### Build the Docker Image

Configure the `compose.yaml` and locate the `expose` property.

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    expose:
      - 5173:3000 # Change the port if needed
```

Then, run the following command to build the Docker image and start the container.

```sh
docker compose up -d
```

### Access the Application

Open your browser and navigate to `http://localhost:5173`.

## Credits

This project is inspired by [Pomofocus.io](https://pomofocus.io/).

## License

This project is licensed under the [MIT License](LICENSE).
