/* eslint-env jest */

import { mount } from 'enzyme'
import React, { ChangeEvent, Component } from 'react'
import { act } from 'react-dom/test-utils'
import { useMiniSearch, withMiniSearch, WithMiniSearch, UseMiniSearch } from './react-minisearch'
import MiniSearch from 'minisearch'

const documents = [
  { uid: 1, title: 'De Rerum Natura' },
  { uid: 2, title: 'The Selfish Gene' },
]

const options = { fields: ['title'], idField: 'uid' }

const props = { documents, options, documentToAdd: null, documentsToAdd: null, documentToRemove: null }

const documentToAdd = { uid: 3, title: 'Pista Nera' }

const documentsToAdd = [{ uid: 3, title: 'Six Easy Pieces' }, { uid: 4, title: 'Six Not So Easy Pieces' }]

const documentToRemove = documents[0]

let promise = Promise.resolve()

const ChildComponent = ({
  search,
  searchResults,
  autoSuggest,
  suggestions,
  add,
  addAll,
  addAllAsync,
  remove,
  removeById,
  clearSearch,
  clearSuggestions,
}: UseMiniSearch) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    autoSuggest(query)
    search(query)
  }

  return (
    <div>
      <input className='search' type='text' onChange={handleChange} />
      <ul className='suggestions'>
        { suggestions && suggestions.map(({ suggestion }) => <li key={suggestion}>{ suggestion }</li>)}
      </ul>
      <ul className='results'>
        { searchResults && searchResults.map((result) => <li key={result.id}>{ result.title }</li>) }
      </ul>
      <button className='add' onClick={() => add(documentToAdd)}>
        Add One
      </button>
      <button className='add-all' onClick={() => addAll(documentsToAdd) }>
        Add All
      </button>
      <button className='add-all-async' onClick={() => { promise = addAllAsync(documentsToAdd) } }>
        Add All Async
      </button>
      <button className='remove' onClick={() => remove(documentToRemove)}>
        Remove
      </button>
      <button className='remove-by-id' onClick={() => removeById(documentToRemove.uid)}>
        Remove by Id
      </button>
      <button className='clear' onClick={() => { clearSearch(); clearSuggestions() }}>
        Clear
      </button>
    </div>
  )
}

const testComponent = (Component: any) => {
  it('gets a miniSearch prop with the MiniSearch instance', () => {
    const wrap = mount(<Component {...props} />)
    expect(wrap.find('ChildComponent')).toHaveProp('miniSearch', expect.any(MiniSearch))
  })

  it('performs search', () => {
    const wrap = mount(<Component {...props} />)
    expect(wrap.find('.results li')).not.toExist()

    wrap.find('input.search').simulate('change', { target: { value: 'natura' } })

    const items = wrap.update().find('.results li')

    expect(items).toHaveLength(1)
    expect(items.first()).toHaveText(documents[0].title)

    wrap.find('input.search').simulate('change', { target: { value: 'xyz' } })
    expect(wrap.find('.results li')).not.toExist()
  })

  it('produces auto suggestions', () => {
    const wrap = mount(<Component {...props} />)

    expect(wrap.find('.suggestions li')).not.toExist()

    wrap.find('input.search').simulate('change', { target: { value: 'sel' } })

    const items = wrap.update().find('.suggestions li')

    expect(items).toHaveLength(1)
    expect(items.first()).toHaveText('selfish')

    wrap.find('input.search').simulate('change', { target: { value: 'xyz' } })
    expect(wrap.find('.suggestions li')).not.toExist()
  })

  it('adds a document', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('button.add').simulate('click')
    wrap.find('input.search').simulate('change', { target: { value: 'pista' } })

    const items = wrap.update().find('.results li')
    expect(items).toHaveLength(1)
    expect(items.first()).toHaveText(documentToAdd.title)
  })

  it('adds multiple documents', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('button.add-all').simulate('click')
    wrap.find('input.search').simulate('change', { target: { value: 'pieces' } })

    const items = wrap.update().find('.results li')
    expect(items).toHaveLength(2)
    expect(items.first()).toHaveText(documentsToAdd[0].title)
    expect(items.last()).toHaveText(documentsToAdd[1].title)
  })

  it('adds multiple documents asyncronously', async () => {
    const wrap = mount(<Component {...props} />)

    expect(wrap.find('ChildComponent')).toHaveProp('isIndexing', false)

    const acting = act(async () => {
      wrap.find('button.add-all-async').simulate('click')
    })
    expect(wrap.update().find('ChildComponent')).toHaveProp('isIndexing', true)

    await acting
    await promise

    expect(wrap.update().find('ChildComponent')).toHaveProp('isIndexing', false)

    wrap.find('input.search').simulate('change', { target: { value: 'pieces' } })

    const items = wrap.update().find('.results li')
    expect(items).toHaveLength(2)
    expect(items.first()).toHaveText(documentsToAdd[0].title)
    expect(items.last()).toHaveText(documentsToAdd[1].title)
  })

  it('removes a document', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('button.remove').simulate('click')
    wrap.find('input.search').simulate('change', { target: { value: 'natura' } })

    const items = wrap.update().find('.results li')
    expect(items).not.toExist()
  })

  it('removes a document by id', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('button.remove-by-id').simulate('click')
    wrap.find('input.search').simulate('change', { target: { value: 'natura' } })

    const items = wrap.update().find('.results li')
    expect(items).not.toExist()
  })

  it('clears search and auto suggestions', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('input.search').simulate('change', { target: { value: 'natura' } })
    wrap.update()

    expect(wrap.find('ChildComponent').prop('searchResults')).not.toBeNull()
    expect(wrap.find('ChildComponent').prop('suggestions')).not.toBeNull()

    wrap.find('button.clear').simulate('click')
    wrap.update()

    expect(wrap.find('ChildComponent').prop('searchResults')).toBeNull()
    expect(wrap.find('ChildComponent').prop('suggestions')).toBeNull()
  })
}

describe('useMiniSearch', () => {
  const MyComponent = ({ documents, options }) => {
    const props = useMiniSearch(documents, options)
    const { search, autoSuggest } = props

    const handleChange = (event) => {
      const query = event.target.value
      autoSuggest(query)
      search(query)
    }

    return <ChildComponent {...props} />
  }

  testComponent(MyComponent)
})

describe('withMiniSearch', () => {
  const MyComponent = withMiniSearch<{ otherProp: string }>(documents, options, ChildComponent)

  testComponent(MyComponent)

  it('accepts other props', () => {
    const wrap = mount(<MyComponent {...props} otherProp='foo' />)

    expect(wrap.find('ChildComponent')).toHaveProp('otherProp', 'foo')
  })

  it('sets the display name of the wrapped component', () => {
    const wrap = mount(<MyComponent {...props} otherProp='foo' />)

    expect(wrap.find('WithMiniSearch(ChildComponent)')).toExist()
  })
})

describe('WithMiniSearch', () => {
  const MyComponent = ({ documents, options }) => (
    <WithMiniSearch documents={documents} options={options}>
      {
        (props) => <ChildComponent {...props} />
      }
    </WithMiniSearch>
  )

  testComponent(MyComponent)
})
