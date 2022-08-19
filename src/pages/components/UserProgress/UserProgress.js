import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faBarsProgress } from '@fortawesome/free-solid-svg-icons'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './UserProgress.module.scss'

const cx = classNames.bind(styles)

function UserProgress() {
    const setState = useContext(NavigateBarContext)

    return (
        <NavLink
            to={`/workspace/userProgress/${localStorage.getItem('userSlug')}`}
            className={cx('user-progress-btn')}
            onClick={() => {
                setState(false)
            }}
        >
            <div className={cx('wrapper')}>
                <FontAwesomeIcon icon={faBarsProgress} />
                <span className={cx('user-progress-title')}>Your progress</span>
            </div>
        </NavLink>
    )
}

export default UserProgress
