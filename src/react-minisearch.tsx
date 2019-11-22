import MiniSearch, { Options, SearchOptions, SearchResult, Suggestion } from 'minisearch'
import React, { useEffect, useState } from 'react'

export interface UseMiniSearch {
  search: (query: string, options?: SearchOptions) => void,
  searchResults: SearchResult[] | null,
  autoSuggest: (query: string, options?: SearchOptions) => void,
  suggestions: Suggestion[] | null,
  add: (document: object) => void,
  addAll: (documents: object[]) => void,
  addAllAsync: (documents: object[], options?: { chunkSize?: number }) => Promise<void>,
  remove: (document: object) => void,
  removeById: (id: any) => void,
  isIndexing: boolean,
  clearSearch: () => void,
  clearSuggestions: () => void,
}

export function useMiniSearch (documents: object[], options: Options): UseMiniSearch {
  const [miniSearch] = useState(new MiniSearch(options))
  const [searchResults, setSearchResults] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [documentById, setDocumentById] = useState({})
  const [isIndexing, setIsIndexing] = useState(false)
  const idField = options.idField || 'id'

  useEffect(() => {
    addAll(documents)
  }, [])

  const search = (query: string, searchOptions?: SearchOptions) => {
    const results = miniSearch.search(query, searchOptions)
    const searchResults = results.map(({ id }) => documentById[id])
    setSearchResults(searchResults)
  }

  const autoSuggest = (query: string, searchOptions?: SearchOptions) => {
    const suggestions = miniSearch.autoSuggest(query, searchOptions)
    setSuggestions(suggestions)
  }

  const add = (document: object) => {
    setDocumentById({ ...documentById, [document[idField]]: document })
    miniSearch.add(document)
  }

  const addAll = (documents: object[]) => {
    const byId = documents.reduce((acc, doc) => {
      acc[doc[idField]] = doc
      return acc
    }, {})

    setDocumentById(Object.assign({}, documentById, byId))
    miniSearch.addAll(documents)
  }

  const addAllAsync = (documents: object[], options?: { chunkSize?: number }) => {
    const byId = documents.reduce((acc, doc) => {
      acc[doc[idField]] = doc
      return acc
    }, {})

    setDocumentById(Object.assign({}, documentById, byId))
    setIsIndexing(true)

    return miniSearch.addAllAsync(documents, options || {}).then(() => {
      setIsIndexing(false)
    })
  }

  const remove = (document: object) => {
    miniSearch.remove(document)
    setDocumentById(removeFromMap(documentById, document[idField]))
  }

  const removeById = (id: any) => {
    const document = documentById[id]
    if (document == null) {
      throw new Error(`react-minisearch: document with id ${id} does not exist in the index`)
    }
    miniSearch.remove(document)
    setDocumentById(removeFromMap(documentById, id))
  }

  const clearSearch = () => {
    setSearchResults(null)
  }

  const clearSuggestions = () => {
    setSuggestions(null)
  }

  return {
    search,
    searchResults,
    autoSuggest,
    suggestions,
    add,
    addAll,
    addAllAsync,
    remove,
    removeById,
    isIndexing,
    clearSearch,
    clearSuggestions,
  }
}

function removeFromMap (map: object, keyToRemove: any) {
  const newMap = Object.assign({}, map)
  delete newMap[keyToRemove]
  return newMap
}

export function withMiniSearch (
  documents: object[],
  options: Options,
  Component: any,
) {
  return (props: any) => {
    const miniSearchProps = useMiniSearch(documents, options)
    return <Component {...miniSearchProps} {...props} />
  }
}

export interface WithMiniSearchProps {
  documents: object[],
  options: Options,
  children: (props: UseMiniSearch) => JSX.Element | null,
}

export const WithMiniSearch: React.FC<WithMiniSearchProps> = ({ documents, options, children }) =>
  children(useMiniSearch(documents, options))
