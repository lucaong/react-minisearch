/* eslint-env jest */

import { mount } from 'enzyme'
import React, { ChangeEvent } from 'react'
import { act } from 'react-dom/test-utils'
import { useMiniSearch, withMiniSearch, WithMiniSearch, UseMiniSearch } from './react-minisearch'
import MiniSearch, { Options } from 'minisearch'

type DocumentType = {
  uid: number,
  title: string
}

const documents: DocumentType[] = [
  { uid: 1, title: 'De Rerum Natura' },
  { uid: 2, title: 'The Selfish Gene' }
]

const options: Options<DocumentType> = { fields: ['title'], idField: 'uid' }

type Props = {
  documents: DocumentType[],
  options: Options<DocumentType>,
  documentToAdd: DocumentType | null,
  documentsToAdd: DocumentType[] | null,
  documentToRemove: DocumentType | null
}

const props: Props = { documents, options, documentToAdd: null, documentsToAdd: null, documentToRemove: null }

const documentToAdd = { uid: 3, title: 'Pista Nera' }

const documentsToAdd = [{ uid: 3, title: 'Six Easy Pieces' }, { uid: 4, title: 'Six Not So Easy Pieces' }]

const documentToRemove = documents[0]

let promise = Promise.resolve()

const ChildComponent: React.FC<UseMiniSearch<DocumentType>> = ({
  search,
  searchResults,
  rawResults,
  autoSuggest,
  suggestions,
  add,
  addAll,
  addAllAsync,
  remove,
  removeById,
  removeAll,
  clearSearch,
  clearSuggestions
}) => {
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
        { searchResults && searchResults.map((result) => <li key={result.uid}>{ result.title }</li>) }
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
      <button className='remove-all' onClick={() => removeAll()}>
        Remove All
      </button>
      <button className='clear' onClick={() => { clearSearch(); clearSuggestions() }}>
        Clear
      </button>
    </div>
  )
}

const testComponent = (Component: React.FC<Props>) => {
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
    expect(wrap.find('ChildComponent').prop('rawResults')).toHaveLength(1)
    expect(wrap.find('ChildComponent').prop('rawResults')[0]).toMatchObject({ id: documents[0].uid, terms: ['natura'] })

    wrap.find('input.search').simulate('change', { target: { value: 'xyz' } })
    expect(wrap.find('.results li')).not.toExist()
    expect(wrap.find('ChildComponent').prop('rawResults')).toHaveLength(0)
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

  it('removes all documents', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('button.remove-all').simulate('click')

    ;['natura', 'selfish'].forEach((query) => {
      wrap.find('input.search').simulate('change', { target: { value: query } })
      const items = wrap.update().find('.results li')
      expect(items).not.toExist()
    })
  })

  it('clears search and auto suggestions', () => {
    const wrap = mount(<Component {...props} />)

    wrap.find('input.search').simulate('change', { target: { value: 'natura' } })
    wrap.update()

    expect(wrap.find('ChildComponent').prop('searchResults')).not.toBeNull()
    expect(wrap.find('ChildComponent').prop('rawResults')).not.toBeNull()
    expect(wrap.find('ChildComponent').prop('suggestions')).not.toBeNull()

    wrap.find('button.clear').simulate('click')
    wrap.update()

    expect(wrap.find('ChildComponent').prop('searchResults')).toBeNull()
    expect(wrap.find('ChildComponent').prop('rawResults')).toBeNull()
    expect(wrap.find('ChildComponent').prop('suggestions')).toBeNull()
  })
}

describe('useMiniSearch', () => {
  const MyComponent = ({ documents, options }) => {
    const props = useMiniSearch<DocumentType>(documents, options)

    return <ChildComponent {...props} />
  }

  testComponent(MyComponent)
})

describe('withMiniSearch', () => {
  const MyComponent = withMiniSearch<Props, DocumentType>(documents, options, ChildComponent)
  const MyComponentWithAdditionalProp = withMiniSearch<Props & { otherProp: string }, DocumentType>(documents, options, ChildComponent)

  testComponent(MyComponent)

  it('accepts other props', () => {
    const wrap = mount(<MyComponentWithAdditionalProp {...props} otherProp='foo' />)

    expect(wrap.find('ChildComponent')).toHaveProp('otherProp', 'foo')
  })

  it('sets the display name of the wrapped component', () => {
    const wrap = mount(<MyComponent {...props} />)

    expect(wrap.find('WithMiniSearch(ChildComponent)')).toExist()
  })
})

describe('WithMiniSearch', () => {
  const MyComponent = ({ documents, options }: Props) => (
    <WithMiniSearch documents={documents} options={options}>
      {
        (props) => <ChildComponent {...props} />
      }
    </WithMiniSearch>
  )

  testComponent(MyComponent)
})
