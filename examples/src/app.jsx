import React, { useState, useEffect, useRef } from 'react'
import fetch from 'unfetch'
import { useMiniSearch } from 'react-minisearch'

const App = ({ documents }) => {
  const {
    search,
    searchResults,
    clearSearch,
    autoSuggest,
    suggestions,
    clearSuggestions,
    isIndexing
  } = useMiniSearch(documents, miniSearchOptions)

  const [query, setQuery] = useState('')
  const [selectedSuggestion, selectSuggestion] = useState(-1)
  const [fromYear, setFromYear] = useState(1965)
  const [toYear, setToYear] = useState(2015)
  const [searchOptions, setSearchOptions] = useState({
    fuzzy: 0.2,
    prefix: true,
    fields: ['title', 'artist'],
    combineWith: 'OR',
    filter: null
  })

  // Perform search when the query changes
  useEffect(() => {
    if (query.length > 1) {
      search(query, searchOptions)
    } else {
      clearSearch()
    }
  }, [query, searchOptions])

  // Manage selection of auto-suggestions
  useEffect(() => {
    if (selectedSuggestion >= 0) {
      const suggestionItem = suggestions[selectedSuggestion]
      setQuery(suggestionItem.suggestion)
    } else {
      clearSuggestions()
    }
  }, [selectedSuggestion])

  // Update the search options if the year range is changed
  useEffect(() => {
    if (fromYear <= 1965 && toYear >= 2015) {
      setSearchOptions({ ...searchOptions, filter: null })
    } else {
      const filter = ({ year }) => {
        year = parseInt(year, 10)
        return year >= fromYear && year <= toYear
      }
      setSearchOptions({ ...searchOptions, filter })
    }
  }, [fromYear, toYear])

  const searchInputRef = useRef(null)

  const deselectSuggestion = () => {
    selectSuggestion(-1)
  }

  const topSuggestions = suggestions ? suggestions.slice(0, 5) : []

  const autoSuggestOptions = {
    ...searchOptions,
    prefix: (term, i, terms) => i === terms.length - 1,
    boost: { artist: 5 }
  }

  const handleChange = ({ target: { value } }) => {
    setQuery(value)
    if (value.length > 1) {
      autoSuggest(value, autoSuggestOptions)
    } else {
      clearSuggestions()
    }
    deselectSuggestion()
  }

  const handleKeyDown = ({ which, key, keyCode }) => {
    if (key === 'ArrowDown') {
      selectSuggestion(Math.min(selectedSuggestion + 1, topSuggestions.length - 1))
    } else if (key === 'ArrowUp') {
      selectSuggestion(Math.max(-1, selectedSuggestion - 1))
    } else if (key === 'Enter' || key === 'Escape') {
      deselectSuggestion()
      clearSuggestions()
      searchInputRef.current.blur()
    }
  }

  const handleSuggestionClick = (i) => {
    setQuery(topSuggestions[i].suggestion)
    deselectSuggestion()
    clearSuggestions()
  }

  const handleSearchClear = () => {
    setQuery('')
    deselectSuggestion()
    clearSuggestions()
  }

  const handleAppClick = () => {
    deselectSuggestion()
    clearSuggestions()
  }

  const setSearchOption = (option, valueOrFn) => {
    if (typeof valueOrFn === 'function') {
      setSearchOptions({ ...searchOptions, [option]: valueOrFn(searchOptions[option]) })
    } else {
      setSearchOptions({ ...searchOptions, [option]: valueOrFn })
    }
    search(query, searchOptions)
  }

  const selectFromYear = (year) => {
    setFromYear(parseInt(year, 10))
  }

  const selectToYear = (year) => {
    setToYear(parseInt(year, 10))
  }

  return (
    <div className='App' onClick={handleAppClick}>
      <article className='main'>
        {
          <Header
            onChange={handleChange} onKeyDown={handleKeyDown}
            selectedSuggestion={selectedSuggestion} onSuggestionClick={handleSuggestionClick}
            onSearchClear={handleSearchClear} value={query} suggestions={topSuggestions}
            searchInputRef={searchInputRef} searchOptions={searchOptions} setSearchOption={setSearchOption}
            setFromYear={selectFromYear} setToYear={selectToYear} fromYear={fromYear} toYear={toYear}
          />
        }
        {
          searchResults && searchResults.length > 0
            ? <SongList songs={searchResults} />
            : (isIndexing ? <Loader text='Indexing...' /> : <Explanation />)
        }
      </article>
    </div>
  )
}

const SongList = ({ songs }) => (
  <ul className='SongList'>
    { songs.map(({ id, ...props }) => <Song {...props} key={id} />) }
  </ul>
)

const Song = ({ title, artist, year, rank }) => (
  <li className='Song'>
    <h3>{ capitalize(title) }</h3>
    <dl>
      <dt>Artist:</dt> <dd>{ capitalize(artist) }</dd>
      <dt>Year:</dt> <dd>{ year }</dd>
      <dt>Billboard Position:</dt> <dd>{ rank }</dd>
    </dl>
  </li>
)

const Header = (props) => (
  <header className='Header'>
    <h1>Song Search</h1>
    <SearchBox {...props} />
  </header>
)

const SearchBox = ({
  onChange,
  onKeyDown,
  onSuggestionClick,
  onSearchClear,
  value,
  suggestions,
  selectedSuggestion,
  searchInputRef,
  searchOptions,
  setSearchOption,
  setFromYear,
  setToYear,
  fromYear,
  toYear
}) => (
  <div className='SearchBox'>
    <div className='Search'>
      <input type='text' value={value} onChange={onChange} onKeyDown={onKeyDown} ref={searchInputRef}
        autoComplete='none' autoCorrect='none' autoCapitalize='none' spellCheck='false' />
      <button className='clear' onClick={onSearchClear}>&times;</button>
    </div>
    {
      suggestions && suggestions.length > 0 &&
      <SuggestionList items={suggestions}
        selectedSuggestion={selectedSuggestion}
        onSuggestionClick={onSuggestionClick} />
    }
    <AdvancedOptions options={searchOptions} setOption={setSearchOption}
      setFromYear={setFromYear} setToYear={setToYear} fromYear={fromYear} toYear={toYear} />
  </div>
)

const SuggestionList = ({ items, selectedSuggestion, onSuggestionClick }) => (
  <ul className='SuggestionList'>
    {
      items.map(({ suggestion }, i) =>
        <Suggestion value={suggestion} selected={selectedSuggestion === i}
          onClick={(event) => onSuggestionClick(i, event)} key={i} />)
    }
  </ul>
)

const Suggestion = ({ value, selected, onClick }) => (
  <li className={`Suggestion ${selected ? 'selected' : ''}`} onClick={onClick}>{ value }</li>
)

const AdvancedOptions = ({ options, setOption, setFromYear, setToYear, fromYear, toYear }) => {
  const setField = (field) => ({ target: { checked } }) => {
    setOption('fields', (fields) => {
      return checked ? [...fields, field] : fields.filter(f => f !== field)
    })
  }
  const setKey = (key, trueValue = true, falseValue = false) => ({ target: { checked } }) => {
    setOption(key, checked ? trueValue : falseValue)
  }
  const { fields, combineWith, fuzzy, prefix } = options
  return (
    <details className='AdvancedOptions'>
      <summary>Advanced options</summary>
      <div className='options'>
        <div>
          <b>Search in fields:</b>
          <label>
            <input type='checkbox' checked={fields.includes('title')} onChange={setField('title')} />
            Title
          </label>
          <label>
            <input type='checkbox' checked={fields.includes('artist')} onChange={setField('artist')} />
            Artist
          </label>
        </div>
        <div>
          <b>Search options:</b>
          <label><input type='checkbox' checked={!!prefix} onChange={setKey('prefix')} /> Prefix</label>
          <label><input type='checkbox' checked={!!fuzzy} onChange={setKey('fuzzy', 0.2)} /> Fuzzy</label>
        </div>
        <div>
          <b>Combine terms with:</b>
          <label>
            <input type='radio' checked={combineWith === 'OR'}
              onChange={setKey('combineWith', 'OR', 'AND')} /> OR
          </label>
          <label><input type='radio' checked={combineWith === 'AND'}
            onChange={setKey('combineWith', 'AND', 'OR')} /> AND</label>
        </div>
        <div>
          <b>Filter:</b>
          <label>
            from year:
            <select
              value={fromYear}
              onChange={({ target: { value } }) => setFromYear(value)}>
              {
                years
                  .filter((year) => year <= toYear)
                  .map((year) => <option key={year} value={year}>{year}</option>)
              }
            </select>
          </label>
          <label>
            to year:
            <select
              value={toYear}
              onChange={({ target: { value } }) => setToYear(value)}>
              {
                years
                  .filter((year) => year >= fromYear)
                  .map((year) => <option key={year} value={year}>{year}</option>)
              }
            </select>
          </label>
        </div>
      </div>
    </details>
  )
}

const Explanation = () => (
  <p>
    This is a demo of the <a
      href='https://github.com/lucaong/minisearch'>MiniSearch</a> JavaScript
    library: try searching through more than 5000 top songs and artists
    in <em>Billboard Hot 100</em> from year 1965 to 2015. This example
    demonstrates search (with prefix and fuzzy match) and auto-completion.
  </p>
)

const Loader = ({ text }) => (
  <div className='Loader'>{ text || 'loading...' }</div>
)

const capitalize = (string) => string.replace(/(\b\w)/gi, (char) => char.toUpperCase())

const stopWords = new Set(['the', 'a', 'an', 'and'])

const years = []
for (let y = 1965; y <= 2015; y++) { years.push(y) }

const miniSearchOptions = {
  fields: ['artist', 'title'],
  storeFields: ['year'],
  processTerm: (term, _fieldName) => (term.length <= 1 || stopWords.has(term)) ? null : term.toLowerCase()
}

// Fetch the JSON documents
const withDocuments = (Component) => {
  const WithDocuments = (props) => {
    const [documents, setDocuments] = useState(null)

    useEffect(() => {
      fetch('billboard_1965-2015.json')
        .then(response => response.json())
        .then((documents) => { setDocuments(documents) })
    }, [])

    if (documents == null) {
      return <Loader />
    } else {
      return <Component {...props} documents={documents} />
    }
  }

  return WithDocuments
}

export default withDocuments(App)
