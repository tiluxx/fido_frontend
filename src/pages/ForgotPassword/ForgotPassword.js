import { useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import styles from './ForgotPassword.module.scss'
import images from '~/assets/images'
import { faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import config from '~/config'

const cx = classNames.bind(styles)

function ForgotPassword() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const forgotPasswordHandler = async (e) => {
        e.preventDefault()

        const config = {
            header: {
                'Content-Type': 'application/json',
            },
        }
        await getCSRFToken()

        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email }, config)

            setSuccess(data.message)
        } catch (error) {
            setError(error.response.data.error)
            setEmail('')
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
                    <div className={cx('forgot-password-screen')}>
                        <form onSubmit={(e) => forgotPasswordHandler(e)} className={cx('forgot-password-form')}>
                            <h3 className={cx('forgot-password-title')}>Forgot Password</h3>
                            {error && (
                                <span className={cx('error-message')}>
                                    <FontAwesomeIcon className={cx('condition-icon')} icon={faTriangleExclamation} />
                                    {error}
                                </span>
                            )}
                            {success && (
                                <span className={cx('success-message')}>
                                    <FontAwesomeIcon className={cx('condition-icon')} icon={faCircleCheck} />
                                    {success}
                                </span>
                            )}
                            <div className={cx('form-group')}>
                                <p className={cx('forgot-password-subtext')}>
                                    Please enter the email address you register your account with. We will send you
                                    reset password confirmation to this email
                                </p>
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
                            <button type="submit" className={cx('submit-btn')}>
                                Send Email
                            </button>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ForgotPassword
