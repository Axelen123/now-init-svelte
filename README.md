# Now Init Svelte

<p>
  <a href="https://www.npmjs.com/package/now-init-svelte">
    <img src="https://img.shields.io/npm/v/now-init-svelte.svg" alt="npm version">
  </a>

  <a href="https://david-dm.org/Axelen123/now-init-svelte">
    <img src="https://david-dm.org/Axelen123/now-init-svelte.svg" alt="dependencies">
  </a>

  <a href="https://travis-ci.org/Axelen123/now-init-svelte">
    <img src="https://api.travis-ci.org/Axelen123/now-init-svelte.svg?branch=master"
         alt="build status">
  </a>

  <a href="https://github.com/Axelen123/now-init-svelte/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/now-init-svelte.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com" alt="license">
  </a>
</p>


## What is now-init-svelte?

now-init-svelte is a tool that allows you to generate files that are needed to use svelte/sapper with [now.sh](https://now.sh).

## Installation

To install now-init-svelte, use npm:
```sh
npm install --global now-init-svelte
```

## Usage

### Svelte

To generate the files:
```sh
now-init-svelte svelte

# Serve locally
now dev

# Deploy to now.sh
now
```

### Sapper

To generate files for sapper projects:
```sh
now-init-svelte sapper
npm run build

# Serve locally
now dev

# Deploy to now.sh
now
```

## Development

Pull requests are encouraged and always welcome. [Pick an issue](https://github.com/Axelen123/now-init-svelte/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) and help us out!

To install and work on now-init-svelte locally:

```bash
git clone https://github.com/Axelen123/now-init-svelte.git
cd now-init-svelte
npm install
```

To build the project, and all the other modules included in the package:

```bash
npm run build
```

It's written in [TypeScript](https://www.typescriptlang.org/), but don't let that put you off — it's basically just JavaScript with type annotations. You'll pick it up in no time. If you're using an editor other than [Visual Studio Code](https://code.visualstudio.com/) you may need to install a plugin in order to get syntax highlighting and code hints etc.


### Running Tests

```bash
npm run test
```

## License

[MIT](LICENSE)