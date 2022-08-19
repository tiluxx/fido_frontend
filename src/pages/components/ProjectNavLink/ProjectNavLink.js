import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FetchProjectDataContext } from '~/layouts/WorkspaceLayout'
import styles from './ProjectNavLink.module.scss'
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

function ProjectNavLink({ currProject }) {
    const handleFetchProjectData = useContext(FetchProjectDataContext)

    return (
        <NavLink
            to={`/projects/${currProject.slug}`}
            onClick={() =>
                handleFetchProjectData(`/projects/${currProject.slug}?id=${currProject._id}`, `${currProject._id}`)
            }
            className={({ isActive }) =>
                isActive ? cx('project-item-link', 'active') : cx('project-item-link', 'in-active')
            }
        >
            <FontAwesomeIcon icon={faFolderOpen} className={cx('project-icon__open')} />
            <FontAwesomeIcon icon={faFolder} className={cx('project-icon__close')} />
            <span className={cx('project-title')}>{currProject.name}</span>
        </NavLink>
    )
}

export default ProjectNavLink
