import MiniSearch, { Query, Options, SearchOptions, SearchResult, Suggestion } from 'minisearch'
import React, { useEffect, useState, useRef, PropsWithChildren, useMemo } from 'react'

export interface UseMiniSearch<T = any> {
  search: (query: Query, options?: SearchOptions) => void,
  searchResults: T[] | null,
  rawResults: SearchResult[] | null,
  autoSuggest: (query: string, options?: SearchOptions) => void,
  suggestions: Suggestion[] | null,
  add: (document: T) => void,
  addAll: (documents: readonly T[]) => void,
  addAllAsync: (documents: readonly T[], options?: { chunkSize?: number }) => Promise<void>,
  getById: (id: any) => T | null,
  remove: (document: T) => void,
  removeById: (id: any) => void,
  removeAll: (documents?: readonly T[]) => void,
  discard: (id: any) => void,
  discardAll: (ids: readonly any[]) => void,
  replace: (document: T) => void,
  isIndexing: boolean,
  clearSearch: () => void,
  clearSuggestions: () => void,
  miniSearch: MiniSearch<T>
}

export function useMiniSearch<T = any> (documents: readonly T[], options: Options<T>): UseMiniSearch<T> {
  const optionsRef = useRef(options)
  const miniSearchRef = useRef<MiniSearch<T>>(new MiniSearch<T>(options))
  const documentByIdRef = useRef<{ [key: string]: T }>({})

  const [rawResults, setRawResults] = useState<SearchResult[] | null>(null)
  const [searchResults, setSearchResults] = useState<T[] | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const [isIndexing, setIsIndexing] = useState<boolean>(false)

  const utils = useMemo(() => {
    const miniSearch = miniSearchRef.current
    const documentById = documentByIdRef.current
    const options = optionsRef.current

    const idField = options.idField || MiniSearch.getDefault('idField') as Options['idField']
    const extractField = options.extractField || MiniSearch.getDefault('extractField') as Options['extractField']
    const gatherById = (documents) => documents.reduce((byId, doc) => {
      const id = extractField(doc, idField)
      byId[id] = doc
      return byId
    }, {})

    const search = (query: string, searchOptions?: SearchOptions): void => {
      const results = miniSearch.search(query, searchOptions)
      const searchResults = results.map(({ id }) => getById(id))
      setSearchResults(searchResults)
      setRawResults(results)
    }

    const autoSuggest = (query: string, searchOptions?: SearchOptions): void => {
      const suggestions = miniSearch.autoSuggest(query, searchOptions)
      setSuggestions(suggestions)
    }

    const add = (document: T): void => {
      documentByIdRef.current[extractField(document, idField)] = document
      miniSearch.add(document)
    }

    const addAll = (documents: readonly T[]): void => {
      const byId = gatherById(documents)
      documentByIdRef.current = Object.assign(documentById, byId)
      miniSearch.addAll(documents)
    }

    const addAllAsync = (documents: readonly T[], options?: { chunkSize?: number }): Promise<void> => {
      const byId = gatherById(documents)
      documentByIdRef.current = Object.assign(documentById, byId)
      setIsIndexing(true)

      return miniSearch.addAllAsync(documents, options || {}).then(() => {
        setIsIndexing(false)
      })
    }

    const getById = (id: any): T | null => {
      return documentById[id]
    }

    const remove = (document: T): void => {
      miniSearch.remove(document)
      documentByIdRef.current = removeFromMap<T>(documentById, extractField(document, idField))
    }

    const removeById = (id: any): void => {
      const document = getById(id)
      if (document == null) {
        throw new Error(`react-minisearch: document with id ${id} does not exist in the index`)
      }
      miniSearch.remove(document)
      documentByIdRef.current = removeFromMap<T>(documentById, id)
    }

    const removeAll = function (documents?: readonly T[]): void {
      if (arguments.length === 0) {
        miniSearch.removeAll()
        documentByIdRef.current = {}
      } else {
        miniSearch.removeAll(documents)
        const idsToRemove = documents.map((doc) => extractField(doc, idField))
        documentByIdRef.current = removeManyFromMap<T>(documentById, idsToRemove)
      }
    }

    const discard = (id: any): void => {
      miniSearch.discard(id)
      documentByIdRef.current = removeFromMap<T>(documentById, id)
    }

    const discardAll = (ids: readonly any[]): void => {
      miniSearch.discardAll(ids)
      documentByIdRef.current = removeManyFromMap<T>(documentById, ids)
    }

    const replace = (document: T): void => {
      miniSearch.replace(document)
      documentByIdRef.current[extractField(document, idField)] = document
    }

    const clearSearch = (): void => {
      setSearchResults(null)
      setRawResults(null)
    }

    const clearSuggestions = (): void => {
      setSuggestions(null)
    }

    return {
      search,
      autoSuggest,
      add,
      addAll,
      addAllAsync,
      getById,
      remove,
      removeById,
      removeAll,
      discard,
      discardAll,
      replace,
      clearSearch,
      clearSuggestions,
      miniSearch
    }
  }, [])

  useEffect(() => {
    if (utils.miniSearch.documentCount === 0) {
      utils.addAll(documents)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchResults,
    rawResults,
    suggestions,
    isIndexing,
    ...utils,
    removeById: utils.discard
  }
}

function removeFromMap<T> (map: { [key: string]: T }, keyToRemove: any): { [key: string]: T } {
  delete map[keyToRemove]
  return map
}

function removeManyFromMap<T> (map: { [key: string]: T }, keysToRemove: readonly any[]): { [key: string]: T } {
  keysToRemove.forEach((keyToRemove) => {
    delete map[keyToRemove]
  })
  return map
}

function getDisplayName<PropsT> (Component: React.ComponentType<PropsT>): string {
  return Component.displayName || Component.name || 'Component'
}

export function withMiniSearch<OwnProps, T = any> (
  documents: T[],
  options: Options<T>,
  Component: React.ComponentType<OwnProps & UseMiniSearch<T>>
): React.FC<OwnProps> {
  const WithMiniSearch = (props: OwnProps) => {
    const miniSearchProps = useMiniSearch<T>(documents, options)
    return <Component {...miniSearchProps} {...props} />
  }

  WithMiniSearch.displayName = `WithMiniSearch(${getDisplayName(Component)})`

  return WithMiniSearch
}

export interface WithMiniSearchProps<T = any> {
  documents: T[],
  options: Options<T>,
  children: (props: UseMiniSearch<T>) => JSX.Element | null,
}

export const WithMiniSearch = <T, >({ documents, options, children }: PropsWithChildren<WithMiniSearchProps<T>>) => {
  const miniSearchProps = useMiniSearch<T>(documents, options)
  return children(miniSearchProps)
}
