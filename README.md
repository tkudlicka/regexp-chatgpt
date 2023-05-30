# RegExp generator

This website, powered by ChatGPT, is specifically designed to generate regular expressions, which are powerful tools for pattern matching and text manipulation.

## Table of Contents

<!-- TOC -->
* [RegExp generator](#regexp-generator)
  * [Table of Contents](#table-of-contents)
  * [Overview](#overview)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Author Information](#author-information)
  * [Commands](#commands)
<!-- TOC -->

## Overview

![RegExp generator]("RegExp generator: Website")

## Requirements

* Nodejs `16.x` or newer.
* OpenAI API token

## Installation
Crete .env file in the root of your project:
```
OPENAI_API_KEY=<yourtoken>
```
And install dependencies
```
npm install && npm dev
```
## Author Information

This module is maintained by the contributors listed on [GitHub](https://github.com/tkudlicka/regexp-chatgpt/graphs/contributors).

## TBD
- [ ] Highlighting regexp input
- [ ] Highlighting matches
- [ ] Setup github actions
- [ ] Dockerfile

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |