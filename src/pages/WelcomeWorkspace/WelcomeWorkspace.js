import { useContext } from 'react'
import classNames from 'classnames/bind'
import { Grid } from '@mui/material'

import { PrivateContext } from '~/context/PrivateContext'
import styles from './WelcomeWorkspace.module.scss'
import images from '~/assets/images'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'

const cx = classNames.bind(styles)

function WelcomeWorkspace() {
    const privateContext = useContext(PrivateContext)

    return privateContext.error ? (
        <span className="error-message">{privateContext.error}</span>
    ) : (
        <div className={cx('wrapper')}>
            <Grid container>
                <Grid item xs={12}>
                    <div className={cx('header')}>
                        <h2
                            className={cx('header__title')}
                        >{`Welcome home, ${privateContext.privateData.user_name}`}</h2>
                        <div className={cx('responsive-md')}>
                            <NotificationAndProfile />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={cx('content')}>
                        <img src={images.launching} alt="Fishing" className={cx('content__illustration')} />
                        <h5 className={cx('content__text')}>Let's go!</h5>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default WelcomeWorkspace
