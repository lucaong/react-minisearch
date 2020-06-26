# Changelog

The major and minor version numbers of `react-minisearch` correspond to the
supported major and minor version of MiniSearch. The patch version increments
with any change.

## v2.1.8
  - Also pass the MiniSearch instance as a `miniSearch` prop

## v2.1.7

  - Fix error in TypeScript declaration file path

## v2.1.6

  - Simpler packaging with `tsc` and Rollup, also reducing bundle size

## v2.1.5

  - Set displayName in withMiniSearch

## v2.1.4

  - [bugfix] Use Babel to transpile ES6

## v2.1.3

  - [bugfix] Switch from Parcel to Webpack to fix importing issues

## v2.1.2

  - Improve TypeScript type of React component
  - [bugfix] Fix import by specifying the correct main file in `package.json`

## v2.1.1

  - Add function `removeById`, to remove a document by its id

## v2.1.0

First release, compatible with MiniSearch `^2.1.1`
