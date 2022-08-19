import { useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import styles from './ResetPassword.module.scss'
import images from '~/assets/images'
import config from '~/config'

const cx = classNames.bind(styles)

const ResetPasswordScreen = () => {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { resetToken } = useParams()

    const resetPasswordHandler = async (e) => {
        e.preventDefault()

        const config = {
            header: {
                'Content-Type': 'application/json',
            },
        }
        await getCSRFToken()

        if (password !== confirmPassword) {
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setError('')
            }, 5000)
            return setError("Passwords don't match")
        }

        try {
            const { data } = await axios.put(
                `/api/auth/resetpassword/${resetToken}`,
                {
                    password,
                },
                config,
            )

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
                    <div className={cx('reset-password-screen')}>
                        <form onSubmit={(e) => resetPasswordHandler(e)} className={cx('reset-password__form')}>
                            <h3 className={cx('reset-password__title')}>Reset Password</h3>
                            {error && <span className={cx('error-message')}>{error} </span>}
                            {success && (
                                <div className={cx('success-message')}>
                                    <span>{`${success}. `}</span>
                                    <Link to="/login" className={cx('success-message__login')}>
                                        Login
                                        <FontAwesomeIcon icon={faCaretRight} />
                                    </Link>
                                </div>
                            )}
                            <div className={cx('form-group')}>
                                <label htmlFor="password">New Password:</label>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    placeholder="Enter new password"
                                    autoComplete="true"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="confirmpassword">Confirm New Password:</label>
                                <input
                                    type="password"
                                    required
                                    id="confirmpassword"
                                    placeholder="Confirm new password"
                                    autoComplete="true"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={cx('submit-btn')}>
                                Reset Password
                            </button>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ResetPasswordScreen
