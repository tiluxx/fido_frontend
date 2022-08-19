import { useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import styles from './Register.module.scss'
import images from '~/assets/images'
import { faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import config from '~/config'

const cx = classNames.bind(styles)

function Register() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const registerHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        if (password !== confirmPassword) {
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setError('')
            }, 5000)
            return setError('Passwords do not match')
        }

        try {
            const { data } = await axios.post(
                '/api/auth/register',
                {
                    username,
                    email,
                    password,
                },
                config,
            )

            const userSlug = data.slug
            localStorage.setItem('userSlug', userSlug)

            setUsername('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')

            setSuccess(data.message)
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
                    <div className={cx('register-screen')}>
                        <form onSubmit={(e) => registerHandler(e)} className={cx('register-form')}>
                            <h3 className={cx('register-title')}>Sign up to start your journey</h3>
                            {error && (
                                <span className={cx('error-message')}>
                                    <FontAwesomeIcon className={cx('error-icon')} icon={faTriangleExclamation} />
                                    {error}
                                </span>
                            )}
                            {success && (
                                <span className={cx('success-message')}>
                                    <FontAwesomeIcon className={cx('success-icon')} icon={faCircleCheck} />
                                    {success}
                                </span>
                            )}
                            <div className={cx('form-group')}>
                                <label htmlFor="name">Username</label>
                                <input
                                    type="text"
                                    required
                                    id="name"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    required
                                    id="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="password">Password</label>
                                <p className={cx('form-subtext')}>
                                    At least one upper case English letter, at least one lower case English letter, at
                                    least one digit, at least one special character, minimum eight in length.
                                </p>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    autoComplete="true"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    id="confirmPassword"
                                    autoComplete="true"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={cx('submit-btn')}>
                                Sign up
                            </button>

                            <span className={cx('register-subtext')}>
                                Already have an account?{' '}
                                <Link to={config.routes.login} className={cx('register-subtext-link')}>
                                    Sign in
                                </Link>
                            </span>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Register
