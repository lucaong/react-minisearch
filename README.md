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

```jsx
import { useMiniSearch } from 'react-minisearch'

// Documents to search amongst
const documents = [
  { id: 1, name: 'Agata' },
  { id: 2, name: 'Finn' },
  // ...etc
]

// See MiniSearch for documentation on options
const miniSearchOptions = { fields: ['name'] }

const MyComponent = () => {
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

```jsx
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

// Documents to search amongst
const documents = [
  { id: 1, name: 'Agata' },
  { id: 2, name: 'Finn' },
  // ...etc
]

// See MiniSearch for documentation on options
const miniSearchOptions = { fields: ['name'] }

const MyComponentWithSearch = withSearch(documents, miniSearchOptions, MyComponent)
```

#### Using the WithMiniSearch wrapper component:

```jsx
import { WithMiniSearch } from 'react-minisearch'

// Documents to search amongst
const documents = [
  { id: 1, name: 'Agata' },
  { id: 2, name: 'Finn' },
  // ...etc
]

// See MiniSearch for documentation on options
const miniSearchOptions = { fields: ['name'] }

const MyComponent = () => (
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

The complete set of props that are provided by `react-minisearch` is the same
for all three ways (`useMiniSearch`, `withMiniSearch`, or `WithMiniSearch`):

  - `search(query: string, searchOptions?: SearchOptions) => void`: function to be called in order to perform the search

  - `searchResults: SearchResult[] | null`: array of search results, or `null` when no search was performed or search was cleared

  - `clearSearch() => void`: function to be called in order to clear the search (setting `searchResults` to `null`)

  - `autoSuggest(query: string, searchOptions?: SearchOptions) => void`: function to be called in order to obtain auto suggestions

  - `suggestions: Suggestion[] | null`: array of auto suggestions, or `null` when auto suggestions are not used or cleared

  - `clearSuggestions() => void`: function to be called in order to clear the suggestions (setting `suggestions` to `null`)

  - `add(document: object) => void`: function to add a new document to the index

  - `addAll(documents: object[]) => void`: function to add several new documents to the index in bulk

  - `addAllAsync(documents: object[], options?: object[]) => Promise<void>`: same as `addAll`, but works asynchronously and in batches to avoid blocking the UI

  - `remove(document: object) => void`: function to remove a document from the index

  - `removeById(id: any) => void`: function to remove a document from the index by ID

  - `isIndexing: boolean`: set to `true` when indexing via `addAllAsync` is in progress, `false` otherwise

Many of these props correspond to methods on the `MiniSearch` class, as
documented in the [MiniSearch
library](https://github.com/lucaong/minisearch).