# Changelog

The major and minor version numbers of `react-minisearch` correspond to the
supported major and minor version of MiniSearch. The patch version increments
with any change.

## v6.0.4

  - [fix] Avoid errors in React 18 development mode, when useEffect(…, []) is called twice

## v6.0.3

  - [performance fix] Avoid expensive `removeAll` on unmount

## v6.0.2

  - [fix] Return stable reference from useMiniSearch

## v6.0.1

  - Relax React peer dependency to allow React 18

## v6.0.0

  - Support for MiniSearch `v6.0.0`

## v5.0.2

  - Relax peer dependency to MiniSearch `5.x`

## v5.0.1

  - Fix peer dependency to MiniSearch

## v5.0.0

  - Support for MiniSearch `5.0.0`

## v4.0.1

  - Fix issue with package dependencies, and use MiniSearch `4.0.1`

## v4.0.0

  - Support for MiniSearch `4.0.0`

## v3.1.0

  - Allow passing a query expression to the `search` function, as introduced in
    MiniSearch v3.1.0

## v3.0.2

  - [fix] Avoid unnecessary re-renders (and associated bugs) by using `useRef`
    instead of `useState` where appropriate.

## v3.0.1

  - [fix] Clean up internal map of documents by ID when calling `removeAll`

## v3.0.0

  - Support for MiniSearch `3.0.0`

## v2.6.5

  - [fix] Fix bug with ID field extraction

## v2.6.4

  - Add `rawResults` prop, to give access to the raw search results including
    score and match information

## v2.6.3

  - Improve TypeScript types: generic document type now defaults to `any`
    instead of `object`

## v2.6.2

  - [fix] Fix type of `searchResults`

## v2.6.1

  - Better types using generics
  - Require MiniSearch `^2.6.0`

## v2.6.0

  - UNPUBLISHED due to publishing mistake

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
