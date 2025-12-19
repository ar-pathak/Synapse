import { useRef, useCallback } from 'react'

const useInfiniteScroll = (callback, hasMore) => {
    const observer = useRef()
    
    const lastElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                callback()
            }
        })
        if (node) observer.current.observe(node)
    }, [callback, hasMore])

    return lastElementRef
}

export default useInfiniteScroll 