# GitHub Project Board Migrator

[Español](#español) | [English](#english)

## Español

Una herramienta para ayudar move y migrar un tablero de proyecto de un repositorio a una organización.

### Código de Conducta

Este projecto de adhiere al contributors covenant. Pueden leer la version en español [aqui][CODIGO_DE_CONDUCTA].

### Como contribuir

Por favor lea [nuestro documento](CONTRIBUTING.md) de como contribuir a este proyecto.

Tambien puedes seguir [este tablero](https://github.com/froi/github-project-migrator/projects/1) para ver en que se esta trabajando.
### Como correr este proyecto

#### Pre requisitos

Para trabajar o correr este proyecto necesita [instalar Node.js][NODEJS] en su maquina/computadora.

#### Pasos

1. Utilizando su terminal clone el repositorio `> git clone https://github.com/froi/github-project-migrator.git`
1. Muevase a directorio creado `> cd github-project-migrator`
1. Instale las dependencias del proyecto `> npm install`
1. Renombre el archivo `.env.example` a `.env`
    1. Agregue o reemplace los valores necesarios en este archivo
1. Ejecute el comando de __build__ `> npm run build`
1. Ejecute el comando de __start__ `> npm start`

:rotating_light: __Nota__ :rotating_light:

El proyecto tambien incluye el commando __build-start__ que ejecuta los commandos de __build__ y __start__ `> npm run build-start` :eyes:

## English

A tool to help move and migrate GitHub project boards from a repository to an organization.

### Code of Conduct

This project adheres to the contributors covenant. You can read the English version [here][CODE_OF_CONDUCT].

### How to contribute

Please read [our document](CONTIBUTING.MD) on how to contribute to this project.

You can also take a look at [our project board](https://github.com/froi/github-project-migrator/projects/1) to see what's being worked on and what isn't.
### How to run this project

#### Prerequisites

To work with or run this project you need to have [Node.js installed][NODEJS] on your machine/computer.

#### Steps

1. Using your terminal clone the repository `> git clone https://github.com/froi/github-project-migrator.git`
1. Move into the directory that was created `> cd github-project-migrator`
1. Install project dependencies `> npm install`
1. Rename the the `.env.example` file to `.env`
    1. Add or replace the necessary values in this file
1. Run the __build__ command `> npm run build`
1. Run the __start__ command `> npm start`

:rotating_light: __Note__ :rotating_light:

The project also includes the __build-start__ command, which runs __build__ and __start__ `> npm run build-start` :eyes:

[CODE_OF_CONDUCT]: .github/code_of_conduct.md
[CODIGO_DE_CONDUCTA]: .github/codigo_de_conducta.md
[NODEJS]: https://nodejs.org/en/download/
