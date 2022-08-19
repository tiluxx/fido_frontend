import { useContext } from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import { CSRFTokenContext } from '~/context/CSRFTokenContext'

const RequireAuth = ({ children }) => {
    const getCSRFToken = useContext(CSRFTokenContext)
    const location = useLocation()

    const isLogin = async () => {
        const config = {
            header: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.post('/api/auth/me', config)

            if (!data.isLogin) {
                return <Navigate to="/login" state={{ from: location }} replace />
            }
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        const { data } = await axios.post('/api/auth/me', config)

                        if (!data.isLogin) {
                            return <Navigate to="/login" state={{ from: location }} replace />
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                console.log(error)
            }
        }
    }

    isLogin()

    return children ? children : <Outlet />
}

export default RequireAuth
