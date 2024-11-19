<div align="center">
  <h3 align="center"> <b>Movie AI Explorer - Backend</b> </h3>
  <h3 align="center">Movie Explorer with AI Enhancements</h3> 
</div>

# Technologies ⚙️

Core technologies used..

Core technologies used:

- [Nest.js](https://nestjs.com) version ^10.0.0
- [TypeORM](https://typeorm.io) version ^0.3.20
- [Passport](http://www.passportjs.org) with [JWT](https://jwt.io) version ^4.0.1 - Authentication
- [class-validator](https://github.com/typestack/class-validator) version ^0.14.1 - Validation
- [class-transformer](https://github.com/typestack/class-transformer) version ^0.5.1 - Object transformation
- [OpenAI](https://openai.com/blog/openai-api) - AI integration for movie recommendations
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Swagger](https://swagger.io/) - API documentation

# Project Structure 📐

The project structure is based on the [Nest Modules](https://docs.nestjs.com/modules) folder structure.
Most relevant files and directories are:

```v
   ├── src                              // Source files
      ├── auth                              // Auth module
      ├── common                            // Common module
      └── entities                          // All entities separated by modules
         └── example                            // Example module (all modules follow the same)
              ├── dto                               // Data transfer object
              ├── entities                          // Entity definition
              ├── example.controller.ts             // Controller definition
              ├── example.module.ts                 // Module definition
              └── example.service.ts                // Service definition
      ├── open-ai                         // Open AI module
      ├── app.module.ts                  // Main module
      └── main.ts                        // Server config 
   ├── .env                             // Enviroments variables for local
   ├── docker-compose.yml               // Docker compose file
   ├── package.json                     // Node.js dependencies
   ├── README.md                        // Project documentation
   └── yarn.lock                        // Yarn lock file
```

# Deploy 🚀

### Git flow

Push to **main** branch deploy to `PROD`

- Deploy to [PROD](https://movie-ai-explorer-backend.vercel.app/api)

# Getting started 💥

How to install and running the app.

- Clone this repo by running:

```bash
   git clone https://github.com/jgtavarez/movie-ai-explorer-backend.git

   # or via SSH

   git clone git@github.com:jgtavarez/movie-ai-explorer-backend.git
```

- Move to develop branch:

```bash
   git checkout develop
```

- Install dependencies:

```bash
  yarn install
```

- Start docker container:

```bash
  docker compose up
```

- Start development mode

```bash
  yarn run start:dev #(make sure to set your env values first)
```

> Navigate to `http://localhost:{PORT}/api` for swagger documentation

# Development Pattern 📝

The application is built using a [modular](https://docs.nestjs.com/modules) design pattern also with controllers, services and repositories to ensure a clean and maintainable architecture. Each module is in charge of group related functionalities, controllers to handle incoming requests and responses, services to encapsulate business logic, repositories/services with typeorm to handle database methods.

This design allows me to scale by allowing features to be added or modified independently, while also improving reuse and separation of concerns as functionality can be easily exported from one module to another.

# Other Useful Commands 💥

How to install and running the app.

- Build production `/dist`:

```bash
   yarn run build
```

- Start production mode:

```bash
   yarn run start:prod
```

- Run tests:

```bash
  npm test
```