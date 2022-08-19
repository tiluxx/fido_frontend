import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function useNav() {
    const navigate = useNavigate()
    const navigateRef = useRef({ navigate })
    useEffect(() => {
        navigateRef.current.navigate = navigate
    }, [navigate])
    return useCallback((location) => {
        navigateRef.current.navigate(location)
    }, [])
}

export default useNav
