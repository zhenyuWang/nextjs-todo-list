'use client'

import { MdSearch } from 'react-icons/md'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@nextui-org/react'

const Search = ({ placeholder = 'Type to search...' }) => {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleSearch = useDebouncedCallback((value) => {
    const params = new URLSearchParams(searchParams)

    params.set('pageNum', 1)

    if (value?.length > 1) {
      params.set('keyword', value)
    } else {
      params.delete('keyword')
    }
    replace(`${pathname}?${params}`)
  }, 300)

  return (
    <Input
      className='w-50 mr-2'
      size='small'
      placeholder={placeholder}
      startContent={<MdSearch size={20} />}
      onValueChange={handleSearch}
    />
  )
}

export default Search
