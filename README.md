# Web Object Renderer ( WOR ) Monorepo

## About
WOR is a full-stack application that enables the visualization and manipulation of 3D object models in `.obj` format. 
The application is also wrapped with user registration, login, authentication, and profile data modification.


A **demo version** of the application is publicly available at [this link](https://web-object-renderer.onrender.com/), and it can also be run locally ( see instructions below ).

The **main motivation** behind this repository is to play with and showcase the possible use of various modern and relevant technologies in the software engineering industry. The repository should be viewed as an experimental playground where different technologies are intentionally used to achieve similar functionalities, often without strict (technical) consistency, but in the same time consistent in coding as much as possible.

This is still a **work in progress** project.

---

## Repository Structure
This project is built using an **Nx Monorepo**, which facilitates efficient parallel development of the frontend and backend applications within a single codebase.

### Why Nx?
Nx is a powerful build system that optimizes project development by providing tools for managing multiple applications and libraries efficiently. It allows for **incremental builds, caching, dependency graph analysis**, and **parallel execution** of tasks, making it an ideal choice for full-stack applications that involve frontend and backend development.

### Package Manager: PNPM
This project uses **PNPM** as the package manager instead of NPM or Yarn. PNPM offers several advantages, including:
- **Faster installs** due to content-addressable storage.
- **Efficient disk usage** by avoiding redundant dependencies.
- **Better monorepo support**, making it ideal for an Nx workspace.

To install dependencies, run:
```sh
pnpm install
```

---

## Frontend
The frontend is built with:
- **React** + **TypeScript** 
- **Vite** as the bundler and development server for fast builds and efficient hot module replacement (HMR)
- **Emotion** for styling and custom UI elements
- **Material UI (MUI)** as an external UI component library
- **Apollo Client** for state management, alongside **React Context API**
- **Three.js** + **Tweakpane** for rendering and manipulating 3D object models

The frontend application explores different approaches to styling and state management, illustrating the flexibility of modern React development.

---

## Backend
The backend is implemented using:
- **Node.js** + **Fastify** (with Apollo Server plugin for GQL testing playground)
- **MongoDB** + **AWS S3** cloud storage
- **TypeGraphQL** and **Typegoose** for interacting with MongoDB
- Support for both **GraphQL API** and **REST API** endpoints
- **JWT middleware** for authentication and verification via HTTP cookies

The backend showcases various techniques in API development, authentication, and data storage while leveraging TypeScript for type safety.

---

## Start Locally

### Prerequisites
After installing project dependencies with `pnpm` (or similar) and before running the project locally, set up an **AWS S3 bucket** account and retrieve the necessary **access keys**.

1. Create an AWS S3 bucket.
2. Generate **AWS access keys** for programmatic access.
3. Define these keys in the backend application's `.env` file
4. Configure S3 bucket permission policies ( cors, read/write access etc. )
```sh
CORS configuration json example: 

[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "your-frontend-url"
        ],
        "ExposeHeaders": []
    }
]

BUCKET policy json example:

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::your-bucket-name/uploads/*",
            "Condition": {
                "StringEquals": {
                    "s3:x-amz-acl": "public-read"
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/uploads/*"
        }
    ]
}
```

### Running the Frontend
Define .env.development like this
```sh
VITE_SERVER_API_URL=your-vite-server-url
```
To start the frontend application locally, use the following Nx command:
```sh
pnpx nx serve frontend
```

To build a production-ready bundle:
```sh
pnpx nx build frontend
```

### Running the Backend
Define .env with variables
```sh
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-secret-cookie
BACKEND_SERVER_PORT=1234
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name
MONGO_URI=your-mongodb-uri
NODE_ENV=development
```
To start the backend application locally, use:
```sh
pnpx nx serve backend
```

### Running Frontend & Backend Simultaneously
To run both frontend and backend applications in parallel:
```sh
pnpx nx run-many --target=serve --all
```
or
```sh
pnpx nx run-many --target=serve --projects=frontend,backend 
```

### Additional Useful Nx Commands
- **List all available projects in the monorepo:**
  ```sh
  pnpx nx show projects
  ```
- **Explore dependency graph:**
  ```sh
  pnpx nx graph
  ```
- **Add new projects:**

    While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

    Use the plugin's generator to create new projects.

    To generate a new application, use:

    ```sh
    npx nx g @nx/react:app demo
    ```

    To generate a new library, use:

    ```sh
    npx nx g @nx/react:lib mylib
    ```

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Hot Reloading
The project supports hot reloading (watch mode) for both frontend and backend, ensuring fast development iterations allowing automatic application updates when file changes during local development.

- Frontend: **Vite** provides hot module replacement (HMR) out of the box, allowing instant updates without a full page reload.
- Backend: **ts-node-dev** watches for file changes and automatically restarts the server. 

For production, backend is built with **esbuild** and run using **Node.js** .

### Testing
Jest is used for unit backend tests and Playwright for E2E frontend and backend tests.
- **Run all tests:**
  ```sh
  pnpx nx run-many --target=test --all
  ```
- **Run specific tests (example):**
  ```sh
  pnpm exec nx run frontend-e2e:e2e-ci--src/login.spec.ts 
  ```
  or
  ```sh
  pnpm playwright test -g "Login page has title"
  ```
- **Run in headed mode:**
  ```sh
  pnpm playwright test --headed
  ```
- **Run in slow motion:**
  ```sh
  pnpm playwright test --slow-mo 500
  ```

### Coding style
This project follows a strict ESLint coding style defined in `eslint.config.cjs`. To check and automatically fix linting issues, run:
```sh
npx eslint . --fix
```

---

## TO-DO Tasks
### Frontend (FE)
- Ensure only **unique** files (by name, etc.) are selected and uploaded to the cloud and MongoDB.

### Backend (BE)
- Implement **worker processes** for key Three.js-related operations.
- Deploy the application on **Vercel** or a similar hosting platform for public access.
- Implement **CI/CD pipeline** for automated testing and deployment.

### Fullstack (General)
- Implement **E2E and unit tests** using **Playwright** or a similar framework.
- Ensure **data validation** and unique data storage.
- Improve **clean code practices**, error handling, and **TypeScript typing** for a real production environment.

- **Finish CI setup:**
  [Click here to finish setting up your workspace!](https://cloud.nx.app/connect/tnc3qxhvqg)

---

### Technology Documentation & Additional Resources
- [Nx Documentation](https://nx.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Three.js](https://threejs.org/docs/)
- [Fastify](https://www.fastify.io/docs/latest/)
- [GraphQL](https://graphql.org/learn/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Material UI](https://mui.com/)
- [PNPM](https://pnpm.io/)

This README will be updated as the project progresses!

