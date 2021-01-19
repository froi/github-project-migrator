# GitHub Project Board Migrator

[Español](#español) | [English](#english)

## Español

Una herramienta para ayudar move y migrar un tablero de proyecto. Las migraciónes apoyadas son:

- Repositorio a repositorio
- Repositorio a organización
- Organización a repositorio
- Entre tableros en una misma organización

### Instalación

Necesitas tener [Node.js instalado][NODEJS] junto a NPM para poder instalar esta herramienta.

Para instalar la herramienta ejecute `npm install -g gh-project-migrator`. Esto va a instalar el CLI a nivel global.

Una vez termine la instalación puede ejecutar `gh-project-migrator migrate` para migrar tableros o `gh-project-migrator auth` para autorizar la herramienta contra GitHub.

Al ejecutar la herramienta solo tienes que seguir las instrucciones para poder hacer una migración.

### Uso

Para ejecutar el CLI necesita ejecutar el comando `gh-project-migrator <command>`.

```shell
$ gh-project-migrator --help
Usage: gh-project-migrator [options] [command]

Options:
  -h, --help      display help for command

Commands:
  migrate
  auth
  help [command]  display help for command
```

#### Auth

`gh-project-migrator auth`

Autoriza el acceso a GitHub al CLI y su dispositivo. Este CLI utiliza el método de autorización GitHub Device flow y pedirá acceso a su cuento utilizando un código especial.

Una vez autorice al CLI un archivo de configuración con sus credenciales se va a crear en el directorio principal de su usuario.

#### Migrate

`gh-project-migrator migrate`

Ejecuta un migración de un tablero. El CLI despliega instrucciones que le ayudara completar la acción que quiere hacer.

Siempre puede cancelar el comando presionando `ctrl + C` en su teclado.

### Código de Conducta y como contribuir

Este proyecto de adhiere al __contributors covenant__. Pueden leer la version en español [aqui][CODIGO_DE_CONDUCTA].

Para contribuir por favor lea [nuestro documento](CONTRIBUTING.md) de como contribuir a este proyecto.

----

## English

A tool to help move and migrate GitHub project boards. The supported migrations are:

- Repository to repository
- Repository to organization
- Organization to repository
- Between to organization project boards

### Installation

Before installing you need to have [Node.js instalado][NODEJS] along with NPM installed.

To install this tool please run `npm install -g gh-project-migrator`. This will install the CLI globally on you machine.

### Usage

To call up the CLI you need to use the `gh-project-migrator <command>` command.

```shell
$ gh-project-migrator --help
Usage: gh-project-migrator [options] [command]

Options:
  -h, --help      display help for command

Commands:
  migrate
  auth
  help [command]  display help for command
```

#### Auth

`gh-project-migrator auth`

Authorize the CLI and device to access GitHub. This CLI uses the GitHub Device flow and will ask you to authorize the device using a special code.

Once you authorize the CLI a file with your credential will be save on your machine in you root directory.

#### Migrate

`gh-project-migrator migrate`

Executes a migration for a project board. The CLI prompts will guide you in selecting what you want to accomplish.

You can always hit `ctrl + C` on your keyboard to cancel your command.

### Code of Conduct and how to contribute

This project adheres to the contributors covenant. You can read the English version [here][CODE_OF_CONDUCT].

To contribute please read [our document](CONTIBUTING.MD) on how to contribute to this project.

[CODE_OF_CONDUCT]: .github/code_of_conduct.md
[CODIGO_DE_CONDUCTA]: .github/codigo_de_conducta.md
[NODEJS]: https://nodejs.org/en/download/
