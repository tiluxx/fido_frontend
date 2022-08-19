import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import styles from './ProjectOption.module.scss'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons'
import './GlobalCssProjectDialog.css'

const cx = classNames.bind(styles)

function ProjectOption({ children, item, username }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const setResponse = useContext(ResponseDataContext)
    const [openRenameDialog, setOpenRenameDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [name, setName] = useState(item.name)
    const [errorCreate, setErrorCreate] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setName(item.name)
    }, [item.name])

    const handleClickOpenRenameDialog = () => {
        setOpenRenameDialog(true)
    }

    const handleClickCloseRenameDialog = () => {
        setOpenRenameDialog(false)
    }

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleClickCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const updateProjectHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.patch(`/projects/edit/${item.slug}`, { name, project_id: item._id }, config)

            setOpenRenameDialog(false)

            navigate(`/projects/${data.slug}`)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        const { data } = await axios.patch(
                            `/projects/edit/${item.slug}`,
                            { name, project_id: item._id },
                            config,
                        )

                        setOpenRenameDialog(false)

                        navigate(`/projects/${data.slug}`)
                    } catch (error) {
                        setErrorCreate(error.response.data.error)
                        setTimeout(() => {
                            setErrorCreate('')
                        }, 10000)
                    }
                }
            } else {
                setErrorCreate(error.response.data.error)
                setTimeout(() => {
                    setErrorCreate('')
                }, 10000)
            }
        }
    }

    const deleteProjectHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.delete(`/projects/delete/${item.slug}?id=${item._id}`, config)

            setOpenDeleteDialog(false)
            navigate(`/workspace/${username}`)
            setResponse(data)
            setTimeout(() => {
                setResponse({})
            }, 5000)
        } catch (error) {
            if (error.response.status === 401) {
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        const { data } = await axios.delete(`/projects/delete/${item.slug}?id=${item._id}`, config)

                        setOpenDeleteDialog(false)
                        navigate(`/workspace/${username}`)
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

    const cancelRenameHandler = (e) => {
        e.preventDefault()
        handleClickCloseRenameDialog()
    }

    const cancelDeleteHandler = (e) => {
        e.preventDefault()
        handleClickCloseDeleteDialog()
    }

    const renderProjectOptions = (attrs) => (
        <div className={cx('option-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('option-popper')}>
                <div className={cx('option-body')}>
                    <button className={cx('option-btn')} onClick={handleClickOpenRenameDialog}>
                        <FontAwesomeIcon icon={faPen} />
                        <h5 className={cx('option-title')}>Rename Project</h5>
                    </button>
                    <button className={cx('option-btn')} onClick={handleClickOpenDeleteDialog}>
                        <FontAwesomeIcon icon={faTrashCan} />
                        <h5 className={cx('option-title')}>Delete Project</h5>
                    </button>

                    <StyledEngineProvider injectFirst>
                        <Dialog open={openRenameDialog}>
                            <form id="rename-form" onSubmit={(e) => updateProjectHandler(e)}>
                                <DialogTitle>Rename project</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Project's name"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={!name}
                                        helperText={!name && errorCreate}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <button
                                        form="rename-form"
                                        onClick={cancelRenameHandler}
                                        className={cx('cancel-btn')}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" form="rename-form" className={cx('submit-btn')}>
                                        Rename
                                    </button>
                                </DialogActions>
                            </form>
                        </Dialog>
                    </StyledEngineProvider>

                    <StyledEngineProvider injectFirst>
                        <Dialog
                            open={openDeleteDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <form id="delete-project-form" onSubmit={(e) => deleteProjectHandler(e)}>
                                <DialogTitle id="alert-dialog-title">
                                    {'This action will delete the project!'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        This action can't undo.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <button type="submit" form="delete-project-form" className={cx('submit-btn')}>
                                        Delete
                                    </button>
                                    <button
                                        form="delete-project-form"
                                        onClick={cancelDeleteHandler}
                                        className={cx('cancel-btn')}
                                    >
                                        Cancel
                                    </button>
                                </DialogActions>
                            </form>
                        </Dialog>
                    </StyledEngineProvider>
                </div>
            </PopperWrapper>
        </div>
    )
    return (
        <Tippy interactive offset={[12, 8]} placement="bottom-end" render={renderProjectOptions}>
            {children}
        </Tippy>
    )
}

export default ProjectOption
