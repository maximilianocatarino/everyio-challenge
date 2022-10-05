<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Every.io](https://every.io/) backend challenge.

The application was built using NestJS, Mongoose, and tests were created using Jest.

The challenge was developed under a Windows 10 environment using Docker containers (WSL2 + Ubuntu 20.04). Unfortunately, my Linux system is gone with my dead SSD.

In my current job position, I moved to another project. There are a lot of new things to learn: three different CI/CD solutions, 2 new programming languages for me (Kotlin and Python), Terraform, JBoss legacy system, among other things. For that reason, My free time is limited, and a chose to not implement some features I consider important to improve scaling and maintainability capabilities. Instead, I'll describe than.

#### Configuration system
A better approach to environment variables directly in the operating system or container is a configuration system that allows one to create or change configurations without requiring deploys. An application using Redis or a solution like Hashi Corp Consul is a good fit for that purpose.

#### Cache system
To avoid database overhead is desirable to cache data that do not change too often, such as permissions. Again, an application using Redis can be a good fit for that scenario.

#### Tests
The tests do not cover all the code, but I believe that the ones I create are enough to check my unit testing skills.

## Installation

```bash
$ npm install

# seed the database
$ npx nestjs-command db:seed

```

## Running the app

```bash
# docker container
$ docker-compose up

# without docker container
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

```

## Stay in touch

- Author - [Maximiliano Catarino](https://www.linkedin.com/in/maximiliano-catarino-1a26109/)
- E-mail - maximiliano.catarino@gmail.com

## License

Nest is [MIT licensed](LICENSE).
