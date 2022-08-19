import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { parseISO, format } from 'date-fns'
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateContext } from '~/context/PrivateContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'
import styles from './RecycleBinPage.module.scss'
import images from '~/assets/images'
import './GlobalCssRecycleBin.css'

const cx = classNames.bind(styles)

function RecycleBinPage() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const privateContext = useContext(PrivateContext)
    const setResponse = useContext(ResponseDataContext)
    const [projects, setProjects] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

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
                    `/api/private/workspace/deletedProjectsList/${localStorage.getItem('userSlug')}?id=${
                        privateContext.privateData.user_id
                    }`,
                    config,
                )

                setProjects(data.projects)
            } catch (error) {
                if (error.response.status === 401) {
                    await getCSRFToken()
                    const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                    if (data.success) {
                        try {
                            await getCSRFToken()
                            const { data } = await axios.get(
                                `/api/private/workspace/deletedProjectsList/${localStorage.getItem('userSlug')}?id=${
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
            navigate(`/workspace/deletedProjectList/${localStorage.getItem('userSlug')}`)
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
                        navigate(`/workspace/deletedProjectList/${localStorage.getItem('userSlug')}`)
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

    const forceDestroyHandler = async (e, project) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        await getCSRFToken()

        try {
            const { data } = await axios.delete(`/projects/forceDelete/${project.slug}?id=${project._id}`, config)

            setOpenDeleteDialog(false)

            navigate(`/workspace/${localStorage.getItem('userSlug')}`)
            navigate(`/workspace/deletedProjectList/${localStorage.getItem('userSlug')}`)
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
                        const { data } = await axios.delete(
                            `/projects/forceDelete/${project.slug}?id=${project._id}`,
                            config,
                        )

                        setOpenDeleteDialog(false)

                        navigate(`/workspace/${localStorage.getItem('userSlug')}`)
                        navigate(`/workspace/deletedProjectList/${localStorage.getItem('userSlug')}`)
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

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleClickCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    return !privateContext.privateData ? (
        <></>
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <StyledEngineProvider injectFirst>
                    <Grid container>
                        <Grid item xs={12}>
                            <div className={cx('header-space')}>
                                <div className={cx('user-info')}>
                                    <h2 className={cx('user-title')}>Recycle bin</h2>
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
                                                            You haven't deleted any projects yet.
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
                                                                        {` was deleted at ${format(
                                                                            parseISO(project.deletedAt),
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
                                                                    <button
                                                                        className={cx('delete-btn')}
                                                                        onClick={handleClickOpenDeleteDialog}
                                                                    >
                                                                        Delete permanently
                                                                    </button>
                                                                </CardActions>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                    <StyledEngineProvider injectFirst>
                                                        <Dialog
                                                            open={openDeleteDialog}
                                                            onClose={handleClickCloseDeleteDialog}
                                                            aria-labelledby="alert-dialog-title"
                                                            aria-describedby="alert-dialog-description"
                                                        >
                                                            <DialogTitle id="alert-dialog-title">
                                                                {'This action will delete the task permanently!'}
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="alert-dialog-description">
                                                                    This action can't undo.
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <button
                                                                    onClick={(e) => forceDestroyHandler(e, project)}
                                                                    className={cx('submit-btn')}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    onClick={handleClickCloseDeleteDialog}
                                                                    className={cx('cancel-btn')}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </StyledEngineProvider>
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

export default RecycleBinPage
