import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import styles from './Profile.module.scss'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

function Profile({ children }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const navigate = useNavigate()

    const logoutHandler = async () => {
        const config = {
            header: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            await axios.post('/api/auth/logout', config)
            localStorage.removeItem('userSlug')
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    const renderProfile = (attrs) => (
        <div className={cx('profile-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('profile-popper')}>
                <header className={cx('profile-header')}>
                    <h5 className={cx('profile-header-title')}>Profile</h5>
                </header>
                <div className={cx('profile-body')}>
                    <button className={cx('sign-out-btn')} onClick={logoutHandler}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <h5 className={cx('sign-out-title')}>Sign out</h5>
                    </button>
                </div>
            </PopperWrapper>
        </div>
    )
    return (
        <Tippy interactive offset={[12, 8]} placement="bottom-end" render={renderProfile}>
            {children}
        </Tippy>
    )
}

export default Profile
