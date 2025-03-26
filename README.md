
<!-- badges: start -->

[![NSF-1948926](https://img.shields.io/badge/NSF-1948926-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1948926)

[![lifecycle](https://img.shields.io/badge/lifecycle-active-orange.svg)](https://www.tidyverse.org/lifecycle/#active)


<!-- badges: end -->

# Neotoma Paleoecology Database Landing Pages (Vue3)

This project is used to update the prior `Vue.js` landing page application to serve [Neotoma Paleoecology Database](http://neotomadb.org/) datasets as landing pages using Vue3, to be served as a cloud application.

The page leverages the [Neotoma v2 API](http://github.com/NeotomaDB/api_nodetest) and existing database structure to provide a consistently styled landing page for all Neotoma Datasets, as well as exposing properly formatted JSON-LD metadata for consumption.

## Contributors

This project is an open project, and contributions are welcome from any individual.  All contributors to this project are bound by a [code of conduct](CODE_OF_CONDUCT.md).  Please review and follow this code of conduct as part of your contribution.

* [![orcid](https://img.shields.io/badge/orcid-0000--0002--2700--4605-brightgreen.svg)](https://orcid.org/0000-0002-2700-4605) [Simon Goring](http://goring.org)
* Michael Stryker
* [The Neotoma Paleoecology Database](http://neotomadb.org)

## Project Setup

This project is developed with `node.js` and Vue (v3). To run the project locally first ensure you have [node installed](https://nodejs.org/en/download). Once node is installed either download or clone this repository to a local folder and run the following command inside the folder:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

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

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
