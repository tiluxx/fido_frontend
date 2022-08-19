import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faBox } from '@fortawesome/free-solid-svg-icons'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './ArchivedProject.module.scss'

const cx = classNames.bind(styles)

function ArchivedProject() {
    const setState = useContext(NavigateBarContext)

    return (
        <NavLink
            to={`/workspace/archiveProject/${localStorage.getItem('userSlug')}`}
            className={cx('user-progress-btn')}
            onClick={() => {
                setState(false)
            }}
        >
            <div className={cx('wrapper')}>
                <FontAwesomeIcon icon={faBox} />
                <span className={cx('user-progress-title')}>Archive</span>
            </div>
        </NavLink>
    )
}

export default ArchivedProject
