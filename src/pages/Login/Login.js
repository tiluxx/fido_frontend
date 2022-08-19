import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import styles from './Login.module.scss'
import images from '~/assets/images'
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import config from '~/config'

const cx = classNames.bind(styles)

function Login() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
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

                if (data.isLogin) {
                    navigate(`/workspace/${data.slug}`)
                }
            } catch (error) {
                setError(error.response.data.error)
                setTimeout(() => {
                    setError('')
                }, 5000)
            }
        }

        isLogin()

        return () => {
            setEmail('')
            setPassword('')
        }
    }, [getCSRFToken, navigate])

    const loginHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.post('/api/auth/login', { email, password }, config)

            const userSlug = data.slug
            if (userSlug) {
                localStorage.setItem('userSlug', userSlug)
                setEmail('')
                setPassword('')

                navigate(`/workspace/${userSlug}`)
            } else {
                setPending(data.message)
                setTimeout(() => {
                    setPending('')
                }, 5000)
            }
        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError('')
            }, 5000)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <Grid container justifyContent="center">
                <Grid item md={3} xs={12}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}>
                            <img src={images.logoBlue} alt="FIDO" />
                        </Link>
                    </div>
                </Grid>
                <Grid item md={6} xs={12}>
                    <div className={cx('login-screen')}>
                        <form onSubmit={(e) => loginHandler(e)} className={cx('login-form')}>
                            <h3 className={cx('login-title')}>Sign in to enter your home</h3>
                            {error && (
                                <span className={cx('error-message')}>
                                    <FontAwesomeIcon className={cx('error-icon')} icon={faTriangleExclamation} />
                                    {error}
                                </span>
                            )}
                            {pending && (
                                <span className={cx('success-message')}>
                                    <FontAwesomeIcon className={cx('success-icon')} icon={faCircleCheck} />
                                    {pending}
                                </span>
                            )}
                            <div className={cx('form-group')}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    required
                                    id="email"
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    tabIndex={1}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="password">
                                    Password
                                    <Link to={config.routes.forgotPassword} className={cx('login-forgotpassword')}>
                                        Forgot Password?
                                    </Link>
                                </label>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    autoComplete="true"
                                    placeholder="Enter password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    tabIndex={2}
                                />
                            </div>
                            <button type="submit" className={cx('submit-btn')}>
                                Sign in
                            </button>

                            <span className={cx('login-subtext')}>
                                Don't have an account?{' '}
                                <Link to={config.routes.register} className={cx('login-subtext-link')}>
                                    Sign up
                                </Link>
                            </span>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login
