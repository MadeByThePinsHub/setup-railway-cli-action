# Setup Railway CLI in GitHub Actions

[![](https://img.shields.io/liberapay/receives/ThePinsTeam.svg?logo=liberapay)](https://liberapay.com/thepinsteam/donate)
[![Test Railway CLI install](https://github.com/AndreiJirohHaliliDev2006/solid-carnival/actions/workflows/railway-cli-test.yml/badge.svg)](https://github.com/AndreiJirohHaliliDev2006/solid-carnival/actions/workflows/railway-cli-test.yml)

Setup Railway CLI for GitHub Actions, without reading the install script file for
configuring installs.

Note that this Railway CLI stuff in GitHub Actions is under work-in-progress and only
Linux runners will be fully supported  on `v0.1.0` for now. While macOS has bash, we can't
full promise about if it's works, but we'll working on it. Windows runner support will
be the on the bottom of the backlog due to User Account Control workarounds and even possiblt
not supporting the . Contributors are always welcome!

## Using the Action

It's easy as plugging the action to your workflow files painlessly, if you only use
project tokens.

```yml
# Since this is shiny new project, proceed at your own risk!
# Also we need contributors for make these config below in the
# README to work.
- name: Setup Railway CLI
  uses: MadeByThePinsHub/setup-railway-cli-action@v0.1.0
```

The default will install the latest version of the CLI using the install script.

If you need to generate your API token, copy the following into your private repo's
`.gothub/workflows/generate-railway-api-token.yml`:

```yml
name: JWT Generator for Railway CLI

on:
  workflow_dispatch:
    inputs:
      email:
        description: Email address of your Railway account
        required: true

jobs:
  authenicate-to-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # Install the CLI first
      - uses: MadeByThePinsHub/setup-railway-cli-action@v0.1.0

      # then we'll log in in browserless mode
      # remember to keep yourself on the action logs for the link
      # click on it, confirm that the passpharse matches and hit that purple button
      - name: Authenicate the CLI
        run: railway login --browserless

      # Then we'll get the token for you.
      - name: Get token
        run: echo Your token is $(cat ~/.railway/config.json | jq .user.token), keep this secret.
      # We might implement an better way for this one.
```

More examples are in the [`examples`](/examples) directory, including deploying to Railway.

## Config / Customizations

* `repo-url` - URL of custom Railway CLI repo (we'll build the CLI manually), requires Golang to be in PATH.
* `repo-branch` - Requires `repo-url` if filled out, Git branch for reproducible builds (used on cloning an specific branch), requires Golang to be in PATH.

```yml
# This feature is currently broken and will fix soon.
- name: Setup Railway CLI (base on railwayapp/cli#126)
  uses: MadeByThePinsHub/setup-railway-cli-action@v0.1.0
  with:
    # This will install Go dependencies first before doing 'make build'
    repo-url: https://github.com/railwayapp/cli
    # change this to master to try latest features first before
    # they go released on Deploy Fridays, as CDC recommends.
    repo-branch: j/allow-up-no-user
```

* `npm-mode` - Set this to `true` to install it through npm, useful
if you use Windows runners. (May need `sudo` for Linux/macOS and some
User Account Control trick for Windows.)

```yml
# We don't check where the executable path Node.js and NPM is
# because we need to support both Linux and macOS runners.
# Windows might be abit tircky because of UAC. We'll fix that
# soon, including some win32 handling stuff.
- name: Install Railway with NPM
  uses: MadeByThePinsHub/setup-railway-cli-action@v0.1.0
  with:
    npm-mode: true
```

## Backlog

See [`BACKLOGS.md`](BACKLOGS.md) for list of currently backlogged features
to implement.

## Related Actions for Railway CLI

* [Deploy to Railway](https://github.com/MadeByThePinsHub/railway-up-action) - **CURRENTLY WORKING ON**
* [Sign in to Railway](https://github.com/MadeByThePinsHub/railway-login-action) - **COMING SOON**

## Support the Development

If you love this project, consider supporting The Pins Team on these
platforms to keep Andrei Jiroh motivated to keep maintaining projects:

* [Patreon](https://patreon.com/thepinsteam) - If you use Patreon to support your favorite creators, use this path.
* [Liberapay](https://liberapay.com/thepinsteam) - You're in control on how much and when you fund your donation to us
In Liberapay, donations through our team page will divide equally and go straight to team members.

### Contributing Docs

See [CONTRIBUTING.md](/COTRIBUTING.md) file for details.

We also accept one-time donations in [cryptocurrency](https://donate.madebythepins.tk/crypto)
and in [PayPal](https://donate.madebythepins.tk/paypal).

## License

The action workflow source files is licensed under MIT License.

By contributing to this project, you agree to [Contributor Convenant 2.0](/CODE_OF_CONDUCT.md)
and [Developers' Certificate of Origin](https://developerscertificate.org).
You may optionally sign our CLA [here](https://github.com/MadeByThePinsHub/contributor-agreement)
to skip the pocess of agreeing to a new license if we ever need to change to
(You may still be notified though, just in case. Old licenses will be cross-licensed
as legally possible, if both licenses are compartible.).
