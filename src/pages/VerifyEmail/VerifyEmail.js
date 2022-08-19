import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import styles from './VerifyEmail.module.scss'
import images from '~/assets/images'
import config from '~/config'

const cx = classNames.bind(styles)

function VerifyEmail() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { userId, verifyToken } = useParams()

    useEffect(() => {
        const verifyEmail = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
            await getCSRFToken()

            try {
                const { data } = await axios.post(`/api/auth/user/verify/${userId}/${verifyToken}`, config)

                setSuccess(data.message)
            } catch (error) {
                setError(error.response.data.error)
                setTimeout(() => {
                    setError('')
                }, 5000)
            }
        }

        verifyEmail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCSRFToken])

    return (
        <div className={cx('wrapper')}>
            <Grid container direction="row" justifyContent="center" alignItems="center" textAlign="center">
                <Grid item xs={12}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}>
                            <img src={images.logoBlue} alt="FIDO" />
                        </Link>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={cx('verify-email-screen')}>
                        {error && (
                            <div className={cx('error-screen')}>
                                <h3 className={cx('title')}>{error}</h3>
                            </div>
                        )}
                        {success && (
                            <div className={cx('success-screen')}>
                                <img src={images.verified} alt="Verified" className={cx('success-img')} />
                                <h3 className={cx('title')}>{success}</h3>
                                <p className={cx('content')}>
                                    Congrats and welcome to FIDO. Now you can draw your flow and reach your goal. Hoping
                                    you have a pleasant experience with us.
                                </p>
                                <Link to={config.routes.login} className={cx('login-btn')}>
                                    <div className={cx('login-wrapper')}>
                                        <h5 className={cx('item-title')}>Sign in</h5>
                                        <FontAwesomeIcon icon={faCaretRight} className={cx('item-icon')} />
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default VerifyEmail
