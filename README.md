# Setup Railway CLI in GitHub Actions

[![https://img.shields.io/liberapay/receives/ThePinsTeam.svg?logo=liberapay]](https://liberapay.com/thepinsteam/donate)

Setup Railway CLI for GitHub Actions, without reading the install script file for configuring installs.

Note that this Railway CLI stuff in GitHub Actions is under work-in-progress and only the default mode will only work on `v0.1.0` for now. Contributors are always welcome!

## Legal Disclaimer

> That's too long, but to summarize: Neither Andrei Jiroh or The Pins Team is not
affliated with Railway Corp. This is just an community project we made to make
setting up Railway CLI not only more easier, but with more customizations, like
building from source and using NPM to install it.

We're not affliated with Railway Corporation, and Andrei Jiroh isn't their
employee nor The Pins Team is an independent business branch of Railway Corp.
We're just their users of the service, and we're not an company by the way.

As most open-source projects do, the team is currently only have one team
member working on this project, among maintaining the team handbook and others
(and most of the community members that are publicly mentioned on our GitHub org's
members list are probably busy with other stuff and we don't usually bother them unless we
call an meeting).

## Using the Action

It's easy as plugging the action to your workflow files painlessly, if you only use project tokens.

```yml
# Since this is shiny new project, proceed at your own risk!
# Also we need contributors for make these config below in the
# README to work.
- name: Setup Railway CLI
  uses: MadeByThePinsHub/setup-railway-cli-action@main
```

The default will install the latest version of the CLI using the install script.

## Config / Customizations

* `repo-url` - URL of custom Railway CLI repo (we'll build the CLI manually)
  * `repo-branch` - Requires `repo-url` if filled out, Git branch for reproducible builds (used on cloning an specific branch).

```yml
- name: Setup Railway CLI (base on railwayapp/cli#126)
  uses: MadeByThePinsHub/setup-railway-cli-action@main
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
# because we need to support both Linux/macOS and Windows users
- name: Install Railway with NPM
  uses: MadeByThePinsHub/setup-railway-cli-action@main
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
