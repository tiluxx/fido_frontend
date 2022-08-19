import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { parseISO, format } from 'date-fns'
import { Grid, Card, CardContent, CardActions } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateContext } from '~/context/PrivateContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'
import CircularLoading from '~/pages/components/CircularLoading'
import styles from './ArchivePage.module.scss'
import images from '~/assets/images'
import './GlobalCssArchive.css'

const cx = classNames.bind(styles)

function ArchivePage() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const privateContext = useContext(PrivateContext)
    const setResponse = useContext(ResponseDataContext)
    const [projects, setProjects] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchTaskData = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            await getCSRFToken()

            try {
                const { data } = await axios.get(
                    `/api/private/workspace/archiveProject/${localStorage.getItem('userSlug')}?id=${
                        privateContext.privateData.user_id
                    }`,
                    config,
                )

                setProjects(data.projects)
            } catch (error) {
                if (error.response.status === 401) {
                    const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                    if (data.success) {
                        try {
                            await getCSRFToken()
                            const { data } = await axios.get(
                                `/api/private/workspace/archiveProject/${localStorage.getItem('userSlug')}?id=${
                                    privateContext.privateData.user_id
                                }`,
                                config,
                            )

                            setProjects(data.projects)
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } else {
                    console.log(error)
                }
            }
        }
        fetchTaskData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate])

    const restoreHandler = async (e, project) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        await getCSRFToken()

        try {
            const { data } = await axios.patch(`/projects/restore/${project.slug}?id=${project._id}`, config)

            navigate(`/projects/${project.slug}`)
            navigate(`/workspace/archiveProject/${localStorage.getItem('userSlug')}`)
            setResponse(data)
            setTimeout(() => {
                setResponse({})
            }, 5000)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        const { data } = await axios.patch(
                            `/projects/restore/${project.slug}?id=${project._id}`,
                            config,
                        )

                        navigate(`/projects/${project.slug}`)
                        navigate(`/workspace/archiveProject/${localStorage.getItem('userSlug')}`)
                        setResponse(data)
                        setTimeout(() => {
                            setResponse({})
                        }, 5000)
                    } catch (error) {
                        setResponse(error.response.data.error)
                        setTimeout(() => {
                            setResponse({})
                        }, 5000)
                    }
                }
            } else {
                setResponse(error.response.data.error)
                setTimeout(() => {
                    setResponse({})
                }, 5000)
            }
        }
    }

    return !privateContext.privateData ? (
        <CircularLoading />
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <StyledEngineProvider injectFirst>
                    <Grid container>
                        <Grid item xs={12}>
                            <div className={cx('header-space')}>
                                <div className={cx('user-info')}>
                                    <h2 className={cx('user-title')}>Archive board</h2>
                                </div>
                                <div className={cx('profile-noti-wrapper', 'responsive-md')}>
                                    <NotificationAndProfile />
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className={cx('progress-board')}>
                                <div className={cx('board-container')}>
                                    <div className={cx('project-list')}>
                                        <Grid container spacing={2}>
                                            {projects.length === 0 && (
                                                <Grid item xs={12}>
                                                    <div className={cx('empty-list-wrapper')}>
                                                        <img
                                                            src={images.emptyBin}
                                                            alt="Empty Bin"
                                                            className={cx('empty-illustration')}
                                                        />
                                                        <h5 className={cx('empty-list-title')}>
                                                            You haven't archived any projects yet.
                                                        </h5>
                                                    </div>
                                                </Grid>
                                            )}
                                            {projects.map((project) => (
                                                <Grid key={project._id} item xs={12}>
                                                    <Card
                                                        sx={{
                                                            maxWidth: '100%',
                                                            border: '2px solid',
                                                            borderColor: '#E7EDF3',
                                                            borderRadius: 'var(--default-border-radius)',
                                                            transition: '0.4s',
                                                            '&:hover': {
                                                                borderColor: 'var(--majorelle-blue)',
                                                            },
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            flexDirection={{ xs: 'column', md: 'row' }}
                                                        >
                                                            <Grid item md={7} xs={12}>
                                                                <CardContent>
                                                                    <p className={cx('card-content')}>
                                                                        <span
                                                                            className={cx('card-content--highlighted')}
                                                                        >
                                                                            {`'${project.name}'`}
                                                                        </span>
                                                                        {` was archived at ${format(
                                                                            parseISO(project.updatedAt),
                                                                            'PPp',
                                                                        )}`}
                                                                    </p>
                                                                </CardContent>
                                                            </Grid>
                                                            <Grid item md={5} xs={12}>
                                                                <CardActions>
                                                                    <button
                                                                        className={cx('restore-btn')}
                                                                        onClick={(e) => restoreHandler(e, project)}
                                                                    >
                                                                        Restore
                                                                    </button>
                                                                </CardActions>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </StyledEngineProvider>
            </div>
        </div>
    )
}

export default ArchivePage
