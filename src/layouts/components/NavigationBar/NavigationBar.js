import { Fragment, useState, useContext, createContext } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { Grid, Box, SwipeableDrawer, List, Divider, ListItem } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PrivateContext } from '~/context/PrivateContext'
import { faBars, faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import styles from './NavigationBar.module.scss'
import images from '~/assets/images'
import config from '~/config'
import Profile from '~/components/Popper/Profile'
import BackgroundLetterAvatars from '~/components/BackgroundLetterAvatars'
import AddNewProjectDialog from '~/pages/components/AddNewProjectDialog'
import UserProgress from '~/pages/components/UserProgress'
import UpComingTask from '~/pages/components/UpComingTask'
import DeletedProject from '~/pages/components/DeletedProject'
import ArchivedProject from '~/pages/components/ArchivedProject'
import ProjectItem from '~/layouts/components/ProjectItem'
import './GlobalCssDrawer.css'

const cx = classNames.bind(styles)
const NavigateBarContext = createContext()

function NavigationBar() {
    const privateContext = useContext(PrivateContext)
    const projectList = privateContext.privateData.projects
    const currUserName = privateContext.privateData.user_name

    const [state, setState] = useState(false)

    const toggleDrawer = (open) => (e) => {
        if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }

        setState(open)
    }

    const list = () => (
        <Box sx={{ width: 300, backgroundColor: 'var(--majorelle-blue)' }} role="presentation">
            <List disablePadding sx={{ marginBottom: '32px;' }}>
                <ListItem disablePadding>
                    <div className={cx('mobile__back-btn-wrapper')}>
                        <button onClick={toggleDrawer(false)} className={cx('mobile__back-btn')}>
                            <FontAwesomeIcon icon={faAnglesRight} className={cx('mobile__back-icon')} />
                        </button>
                    </div>
                </ListItem>
                <Divider
                    variant="middle"
                    sx={{
                        borderColor: 'rgb(255 251 254 / 55%)',
                    }}
                />
                <ListItem disablePadding>
                    {currUserName && (
                        <div className={cx('func-btn-wrapper', 'responsive-md')}>
                            <Profile>
                                <div className={cx('profile-wrapper')}>
                                    <BackgroundLetterAvatars username={currUserName} />
                                    <h3 className={cx('profile-username')}>{currUserName}</h3>
                                </div>
                            </Profile>
                        </div>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    <div className={cx('func-btn-wrapper')}>
                        <AddNewProjectDialog />
                    </div>
                </ListItem>
                <ListItem disablePadding>
                    <div className={cx('func-btn-wrapper')}>
                        <UserProgress />
                    </div>
                </ListItem>
                <ListItem disablePadding>
                    <div className={cx('func-btn-wrapper')}>
                        <UpComingTask />
                    </div>
                </ListItem>
                <ListItem disablePadding>
                    <div className={cx('func-btn-wrapper')}>
                        <DeletedProject />
                    </div>
                </ListItem>
                <ListItem disablePadding>
                    <div className={cx('func-btn-wrapper')}>
                        <ArchivedProject />
                    </div>
                </ListItem>
            </List>
            <Divider
                variant="middle"
                sx={{
                    borderColor: 'rgb(255 251 254 / 55%)',
                }}
            />
            <List disablePadding>
                {projectList &&
                    projectList.map((project, index) => (
                        <ListItem disablePadding key={index}>
                            <div className={cx('project-wrapper')}>
                                <ProjectItem project={project} username={currUserName} />
                            </div>
                        </ListItem>
                    ))}
            </List>
        </Box>
    )

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

    return privateContext.error ? (
        <></>
    ) : (
        <NavigateBarContext.Provider value={setState}>
            <nav className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home} className={cx('logo-link')}>
                            <img src={images.logoWhite} alt="FIDO" className={cx('logo-img')} />
                        </Link>
                    </div>
                    {currUserName && (
                        <div className={cx('func-btn-wrapper', 'responsive-md')}>
                            <Profile>
                                <div className={cx('profile-wrapper')}>
                                    <BackgroundLetterAvatars username={currUserName} />
                                    <h3 className={cx('profile-username')}>{currUserName}</h3>
                                </div>
                            </Profile>
                        </div>
                    )}
                    <div className={cx('func-btn-wrapper')}>
                        <AddNewProjectDialog />
                    </div>
                    <div className={cx('func-btn-wrapper')}>
                        <UserProgress />
                    </div>
                    <div className={cx('func-btn-wrapper')}>
                        <UpComingTask />
                    </div>
                    <div className={cx('func-btn-wrapper')}>
                        <DeletedProject />
                    </div>
                    <div className={cx('func-btn-wrapper')}>
                        <ArchivedProject />
                    </div>

                    <Divider
                        variant="middle"
                        sx={{
                            borderColor: 'rgb(255 251 254 / 55%)',
                        }}
                    />

                    {projectList &&
                        projectList.map((project, index) => (
                            <div key={index} className={cx('project-wrapper')}>
                                <ProjectItem project={project} username={currUserName} />
                            </div>
                        ))}
                </div>
                <div className={cx('mobile__container')}>
                    <Fragment>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={6}>
                                <div className={cx('mobile__logo')}>
                                    <Link to={config.routes.home} className={cx('logo-link')}>
                                        <img src={images.logoBlue} alt="FIDO" className={cx('mobile__logo-img')} />
                                    </Link>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className={cx('mobile__nav-btn-wrapper')}>
                                    <button onClick={toggleDrawer(true)} className={cx('mobile__nav-btn')}>
                                        <FontAwesomeIcon icon={faBars} className={cx('mobile__nav-icon')} />
                                    </button>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider
                                    sx={{
                                        borderColor: 'rgb(38 24 27 / 65%);',
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <StyledEngineProvider injectFirst>
                            <SwipeableDrawer
                                anchor={'right'}
                                open={state}
                                onClose={toggleDrawer(false)}
                                onOpen={toggleDrawer(true)}
                                disableBackdropTransition={!iOS}
                                disableDiscovery={iOS}
                            >
                                {list()}
                            </SwipeableDrawer>
                        </StyledEngineProvider>
                    </Fragment>
                </div>
            </nav>
        </NavigateBarContext.Provider>
    )
}

export default NavigationBar
export { NavigateBarContext }
