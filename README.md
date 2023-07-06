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

All three way take the following arguments (or props for the wrapper component):

  - The initial collection of documents to add to the index. Note: this is just
    the initial collection, and mutating this argument won't cause reindexing.
    To add or remove documents after initialization, use the functions
    `add`/`addAll`/`remove`/`removeAll`/`discard`, etc.
  - The `MiniSearch` configuration options

#### Using the useMiniSearch hook:

```jsx
import { useMiniSearch } from 'react-minisearch'

// Documents to search amongst
const documents = [
  { id: 1, name: 'Agata' },
  { id: 2, name: 'Finn' },
  // …etc
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
      <input type='text' onChange={handleSearchChange} placeholder='Search…' />

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
      <input type='text' onChange={handleSearchChange} placeholder='Search…' />

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
  // …etc
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
  // …etc
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
            <input type='text' onChange={handleSearchChange} placeholder='Search…' />

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

  - `search(query: string, searchOptions?: SearchOptions) => void`: function to
    be called in order to perform the search

  - `searchResults: T[] | null`: array of search results, or `null` when no
    search was performed or search was cleared

  - `rawResults: SearchResult[] | null`: array of raw search results from
    MiniSearch, including scores and match information, or `null` when no search
    was performed or search was cleared

  - `clearSearch() => void`: function to be called in order to clear the search
    (setting `searchResults` to `null`)

  - `autoSuggest(query: string, searchOptions?: SearchOptions) => void`:
    function to be called in order to obtain auto suggestions

  - `suggestions: Suggestion[] | null`: array of auto suggestions, or `null`
    when auto suggestions are not used or cleared

  - `clearSuggestions() => void`: function to be called in order to clear the
    suggestions (setting `suggestions` to `null`)

  - `add(document: T) => void`: function to add a new document to the index

  - `addAll(documents: T[]) => void`: function to add several new documents to
    the index in bulk

  - `addAllAsync(documents: T[], options?: object) => Promise<void>`: same as
    `addAll`, but works asynchronously and in batches to avoid blocking the UI

  - `remove(document: T) => void`: function to remove a document from the index

  - `removeById(id: any) => void`: function to remove a document from the index
    by its ID

  - `removeAll(documents?: T[]) => void`: function to remove several documents,
    or all documents, from the index

  - `discard(id: any) => void`: discard a document by its ID (same as
    `removeById`)

  - `discardAll(ids: readonly any[]) => void`: discard several documents at
    once, by their ID

  - `replace(document: T) => void`: replace an existing document with a new
    version of it

  - `isIndexing: boolean`: set to `true` when indexing via `addAllAsync` is in
    progress, `false` otherwise

  - `miniSearch: MiniSearch`: the `MiniSearch` instance, for the (rare) cases
    when it is necessary to use it directly

In this list, the type `T` is a generic type that refers to the type of the document being indexed.

Many of these props correspond to methods on the `MiniSearch` class, as
documented in the [MiniSearch
library](https://github.com/lucaong/minisearch).


## Examples

Check out the `examples` directory for a complete usage example. To run the
example app locally:

  - `cd` to the `examples` directory
  - Install dependencies with `yarn install` (or `npm install`)
  - Run the example application with `yarn start` (or `npm run start`)
