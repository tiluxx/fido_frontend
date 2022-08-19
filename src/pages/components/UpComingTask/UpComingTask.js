import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './UpComingTask.module.scss'

const cx = classNames.bind(styles)

function UpComingTask() {
    const setState = useContext(NavigateBarContext)

    return (
        <NavLink
            to={`/workspace/upComingTask/${localStorage.getItem('userSlug')}`}
            className={cx('user-progress-btn')}
            onClick={() => {
                setState(false)
            }}
        >
            <div className={cx('wrapper')}>
                <FontAwesomeIcon icon={faCalendarDays} />
                <span className={cx('user-progress-title')}>Upcoming tasks</span>
            </div>
        </NavLink>
    )
}

export default UpComingTask
