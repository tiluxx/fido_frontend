import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './DeletedProject.module.scss'

const cx = classNames.bind(styles)

function DeletedProject() {
    const setState = useContext(NavigateBarContext)

    return (
        <NavLink
            to={`/workspace/deletedProjectList/${localStorage.getItem('userSlug')}`}
            className={cx('user-progress-btn')}
            onClick={() => {
                setState(false)
            }}
        >
            <div className={cx('wrapper')}>
                <FontAwesomeIcon icon={faTrashCan} />
                <span className={cx('user-progress-title')}>Recycle Bin</span>
            </div>
        </NavLink>
    )
}

export default DeletedProject
