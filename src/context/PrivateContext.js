import { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CSRFTokenContext } from '~/context/CSRFTokenContext'

const PrivateContext = createContext()

function PrivateProvider({ children }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [privateData, setPrivateData] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchPrivateDate = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
            await getCSRFToken()

            try {
                const { data } = await axios.get(`/api/private/workspace/${localStorage.getItem('userSlug')}`, config)
                setPrivateData(data)
            } catch (error) {
                setError('You are not authorized please login')
            }
        }

        fetchPrivateDate()
    }, [getCSRFToken, navigate])

    const value = {
        privateData,
        error,
    }

    return <PrivateContext.Provider value={value}>{children}</PrivateContext.Provider>
}

export { PrivateContext, PrivateProvider }
