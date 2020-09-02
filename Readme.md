# NNS-BOT

A discord bot to raise Jira support tickets.

[![codecov](https://codecov.io/gh/Keith3895/NNS-BOT/branch/master/graph/badge.svg)](https://codecov.io/gh/Keith3895/NNS-BOT) ![Build](https://github.com/Keith3895/NNS-BOT/workflows/Build/badge.svg) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/85d987a4058744239a272bb3086fa6f3)](https://www.codacy.com/manual/keith30895/NNS-BOT?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Keith3895/NNS-BOT&amp;utm_campaign=Badge_Grade)
[![Requirements Status](https://requires.io/github/Keith3895/NNS-BOT/requirements.svg?branch=master)](https://requires.io/github/Keith3895/NNS-BOT/requirements/?branch=master) ![Discord](https://img.shields.io/discord/749160588663324672)
![GitHub](https://img.shields.io/github/license/Keith3895/NNS-BOT?style=plastic) ![GitHub issues by-label](https://img.shields.io/github/issues/Keith3895/NNS-BOT/bug?style=plastic) ![GitHub commit activity](https://img.shields.io/github/commit-activity/w/Keith3895/NNS-BOT?style=plastic)

## Table of content
1) [Introduction](#Introduction)
2) [Installation](#Installation)
3) [Usage Guide](#Usage)
4) [License](#License)
5) [Road Map](#RoadMap)

### Introduction

The purpose of this program is to create a Bot on discord that will respond to the text messages sent to the bot and raise relevant tickets on Jira. The ticket can be support requests, bugs or even feature requests. The bot will be able to take images, audio and video attachments. The bot can also be used to check the updates and the status of existing tickets.

The Plan is to build the bot on TypeScript using discord's dependencies. The bot would receive messages and trigger various flows based on the commands/chats it receives.

### Installation
- have NodeJS (lts) installed.
- run ``npm install`` or ``yarn`` to install all the dependencies.
- create a ``.env`` file on the apps root directory. [.env template](./docs/.env_template)
### Usage
- for development run ``npm run watch`` or ``yarn watch`` followed by ``npm start`` or ``yarn start``

### License
GNU General Public License v3.0 or later

See [COPYING](./LICENSE) file to see the full text.

### RoadMap

The Road Map of this project is to:
- [x] build the bot on TypeScript.
- [ ] Follow TDD.
- [ ] have a complete and a functional CI/CD.
- [ ] Integrate a NLP to improve the conversational capacity of the bot.