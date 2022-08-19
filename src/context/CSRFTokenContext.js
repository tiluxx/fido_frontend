import { createContext } from 'react'
import axios from 'axios'

const CSRFTokenContext = createContext()

function CSRFTokenProvider({ children }) {
    const getCSRFToken = async () => {
        try {
            const { data } = await axios.get('/getCSRFToken', { withCredentials: true })
            axios.defaults.headers.common['X-CSRF-Token'] = data.CSRFToken
            axios.defaults.withCredentials = true
        } catch (error) {}
    }

    return <CSRFTokenContext.Provider value={getCSRFToken}>{children}</CSRFTokenContext.Provider>
}

export { CSRFTokenContext, CSRFTokenProvider }
