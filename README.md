# React MiniSearch

React integration for the [MiniSearch](https://github.com/lucaong/minisearch) client side full-text search library.

## Getting Started

### Installation:

First, make sure you have a compatible version of
[React](https://github.com/facebook/react) and of
[MiniSearch](https://github.com/lucaong/minisearch) installed.

Then, install via **NPM** or **Yarn**:

```bash
# With NPM:
npm install react-minisearch

# Or with Yarn:
yarn add react-minisearch
```

### Usage:

There are three main ways to use `react-minisearch`: the `useMiniSearch` hook, the `withMiniSearch` higher-order component, or the `WithMiniSearch` wrapper component.

#### Using the useMiniSearch hook:

```javascript
import { useMiniSearch } from 'react-minisearch'

const MyComponent = ({ documents, miniSearchOptions }) => {
  const { search, searchResults } = useMiniSearch(documents, miniSearchOptions)

  const handleSearchChange = (event) => {
    search(event.target.value)
  }

  return (
    <div>
      <input type='text' onChange={handleSearchChange} placeholder='Search...' />

      <ol>
        <h3>Results:</h3>
        {
          searchResults && searchResults.map((result, i) => {
            return <li key={i}>{ result.name }</li>
          })
        }
      </ol>
    </div>
  )
}
```

#### Using the withMiniSearch higher-order component:

```javascript
import { withMiniSearch } from 'react-minisearch'

const MyComponent = ({ search, searchResults }) => {

  const handleSearchChange = (event) => {
    search(event.target.value)
  }

  return (
    <div>
      <input type='text' onChange={handleSearchChange} placeholder='Search...' />

      <ol>
        <h3>Results:</h3>
        {
          searchResults && searchResults.map((result, i) => {
            return <li key={i}>{ result.name }</li>
          })
        }
      </ol>
    </div>
  )
}

const MyComponentWithSearch = withSearch(documents, miniSearchOptions, MyComponent)
```

#### Using the WithMiniSearch wrapper component:

```javascript
import { WithMiniSearch } from 'react-minisearch'

const MyComponent = ({ documents, miniSearchOptions }) => (
  <WithMiniSearch documents={documents} options={miniSearchOptions}>
    {
      ({ search, searchResults }) => {
        const handleSearchChange = (event) => {
          search(event.target.value)
        }

        return (
          <div>
            <input type='text' onChange={handleSearchChange} placeholder='Search...' />

            <ol>
              <h3>Results:</h3>
              {
                searchResults && searchResults.map((result, i) => {
                  return <li key={i}>{ result.name }</li>
                })
              }
            </ol>
          </div>
        )
      }
    }
  </WithMiniSearch>
)
```

### Provided props:

No matter which method you use (`useMiniSearch`, `withMiniSearch`, or
`WithMiniSearch`), the complete set of props that are provided by
`react-minisearch` are:

  - `search`: function to be called in order to perform the search

  - `searchResults`: array of search results, or `null` when no search was performed or search was cleared

  - `clearSearch`: function to be called in order to clear the search (setting `searchResults` to `null`)

  - `autoSuggest`: function to be called in order to obtain auto suggestions

  - `suggestions`: array of auto suggestions, or `null` when auto suggestions are not used or cleared

  - `clearSuggestions`: function to be called in order to clear the suggestions (setting `suggestions` to `null`)

  - `add`: function to add a new document to the index

  - `addAll`: function to add several new documents to the index in bulk

  - `addAllAsync`: same as `addAll`, but works asynchronously and in batches to avoid blocking the UI

  - `remove`: function to remove a document from the index

  - `isIndexing`: boolean, set to `true` when indexing via `addAllAsync` is in progress, `false` otherwise

Many of these props correspond to methods on the `MiniSearch` class, as
documented in the [MiniSearch library](https://github.com/lucaong/minisearch)