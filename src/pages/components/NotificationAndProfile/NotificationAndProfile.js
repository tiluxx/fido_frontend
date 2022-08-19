import { useState, useContext, useEffect } from 'react'
import classNames from 'classnames/bind'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { PrivateContext } from '~/context/PrivateContext'
import styles from './NotificationAndProfile.module.scss'
import Profile from '~/components/Popper/Profile'
import BackgroundLetterAvatars from '~/components/BackgroundLetterAvatars'
import './GlobalCssBadge.css'

const cx = classNames.bind(styles)

const theme = createTheme({
    palette: {
        notice: {
            main: '#e63946',
            contrastText: '#fffbfe',
        },
    },
})

function NotificationAndProfile() {
    const privateContext = useContext(PrivateContext)
    const [username, setUsername] = useState('FIDO User')

    useEffect(() => {
        if (!privateContext.privateData.user_name) {
            setUsername('FIDO User')
        } else {
            setUsername(privateContext.privateData.user_name)
        }
    }, [privateContext.privateData.user_name])

    return !privateContext.privateData ? (
        <></>
    ) : (
        <div className={cx('container')}>
            <div className={cx('content')}>
                <ThemeProvider theme={theme}>
                    <div>
                        <Profile>
                            <div className={cx('profile-wrapper')}>
                                <BackgroundLetterAvatars username={username} />
                                <h3 className={cx('profile-username')}>{username}</h3>
                            </div>
                        </Profile>
                    </div>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default NotificationAndProfile
