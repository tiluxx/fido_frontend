import { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Grid } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'

import { FetchProjectDataContext } from '~/layouts/WorkspaceLayout'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './ProjectItem.module.scss'
import { faFolder, faFolderOpen, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import ProjectOption from '~/components/Popper/ProjectOption'

const cx = classNames.bind(styles)

function ProjectItem({ project, username }) {
    const handleFetchProjectData = useContext(FetchProjectDataContext)
    const setState = useContext(NavigateBarContext)

    const [currProject, setCurrProject] = useState(project)

    useEffect(() => {
        setCurrProject(project)
    }, [project, project.name])

    return (
        <div className={cx('project-item')}>
            <Grid container wrap="nowrap">
                <Grid item xs={10} zeroMinWidth>
                    <NavLink
                        to={`/projects/${currProject.slug}`}
                        onClick={() => {
                            setState(false)
                            handleFetchProjectData(
                                `/projects/${currProject.slug}?id=${currProject._id}`,
                                `${currProject._id}`,
                            )
                        }}
                        className={({ isActive }) =>
                            isActive ? cx('project-item-link', 'active') : cx('project-item-link', 'in-active')
                        }
                    >
                        <FontAwesomeIcon icon={faFolderOpen} className={cx('project-icon__open')} />
                        <FontAwesomeIcon icon={faFolder} className={cx('project-icon__close')} />
                        <span className={cx('project-title')}>{currProject.name}</span>
                    </NavLink>
                </Grid>
                <Grid item xs={2} zeroMinWidth>
                    <ProjectOption item={currProject} username={username}>
                        <div className={cx('more-icon')}>
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </ProjectOption>
                </Grid>
            </Grid>
        </div>
    )
}

export default ProjectItem
