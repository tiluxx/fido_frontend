import { useState, useContext } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless'
import { format, parseISO } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { FetchProjectDataContext, ResponseDataContext } from '~/layouts/WorkspaceLayout'
import styles from './TaskOption.module.scss'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons'
import './GlobalCssProjectDialog.css'

const cx = classNames.bind(styles)

function TaskOption({ children, item, project, updateTaskHandler }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const handleFetchProjectData = useContext(FetchProjectDataContext)
    const setResponse = useContext(ResponseDataContext)

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    const [title, setTitle] = useState(item.title)
    const [location, setLocation] = useState(item.location)
    const [description, setDescription] = useState(item.description)
    const [dueDate, setDueDate] = useState(format(parseISO(item.dueAt), 'yyyy-MM-dd p'))

    const [errorCreate, setErrorCreate] = useState('')

    const handleClickOpenEditDialog = () => {
        setOpenEditDialog(true)
    }

    const handleClickCloseEditDialog = () => {
        setOpenEditDialog(false)
    }

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleClickCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const preUpdateTaskHandler = (e) => {
        e.preventDefault()

        if (!title || !dueDate) {
            setErrorCreate('Please provide field required')
            setTimeout(() => {
                setErrorCreate('')
            }, 5000)
        } else {
            const newDate = new Date(dueDate).toISOString()
            updateTaskHandler({ title, location, description, dueAt: format(parseISO(newDate), 'yyyy-MM-dd p') })
            setOpenEditDialog(false)
        }
    }

    const deleteTaskHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.delete(
                `/tasks/delete?id=${item._id}&condition=${item.condition}&projectId=${item.project_id}`,
                config,
            )

            setResponse(data)
            setTimeout(() => {
                setResponse({})
            }, 5000)
            if (data.success) {
                handleFetchProjectData(`/projects/${project.slug}?id=${project._id}`, `${project._id}`)
            }
            setOpenDeleteDialog(false)
        } catch (error) {
            if (error.response.status === 401) {
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        const { data } = await axios.delete(
                            `/tasks/delete?id=${item._id}&condition=${item.condition}&projectId=${item.project_id}`,
                            config,
                        )

                        setResponse(data)
                        setTimeout(() => {
                            setResponse({})
                        }, 5000)
                        if (data.success) {
                            handleFetchProjectData(`/projects/${project.slug}?id=${project._id}`, `${project._id}`)
                        }
                        setOpenDeleteDialog(false)
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

    const cancelEditHandler = (e) => {
        e.preventDefault()
        handleClickCloseEditDialog()
    }

    const cancelDeleteHandler = (e) => {
        e.preventDefault()
        handleClickCloseDeleteDialog()
    }

    const renderTaskOptions = (attrs) => (
        <div className={cx('option-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('option-popper')}>
                <div className={cx('option-body')}>
                    <button className={cx('option-btn')} onClick={handleClickOpenEditDialog}>
                        <FontAwesomeIcon icon={faPen} />
                        <h5 className={cx('option-title')}>Update task</h5>
                    </button>
                    <button className={cx('option-btn')} onClick={handleClickOpenDeleteDialog}>
                        <FontAwesomeIcon icon={faTrashCan} />
                        <h5 className={cx('option-title')}>Delete task</h5>
                    </button>

                    <StyledEngineProvider injectFirst>
                        <Dialog open={openEditDialog}>
                            <form id="update-task-form" onSubmit={(e) => preUpdateTaskHandler(e)}>
                                <DialogTitle>Update task</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="title"
                                        label="Task's title"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        error={!title}
                                        helperText={!title && errorCreate}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            label="Due"
                                            renderInput={(params) => <TextField margin="dense" id="due" {...params} />}
                                            value={dueDate}
                                            onChange={(newValue) => {
                                                setDueDate(newValue)
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <TextField
                                        margin="dense"
                                        id="location"
                                        label="Location"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="description"
                                        label="Description"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <button
                                        form="update-task-form"
                                        onClick={cancelEditHandler}
                                        className={cx('cancel-btn')}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" form="update-task-form" className={cx('submit-btn')}>
                                        Update
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
                            <form id="delete-task-form" onSubmit={(e) => deleteTaskHandler(e)}>
                                <DialogTitle id="alert-dialog-title">{'This action will delete the task!'}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        This action can't undo.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <button type="submit" form="delete-task-form" className={cx('submit-btn')}>
                                        Delete
                                    </button>
                                    <button
                                        form="delete-task-form"
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
        <Tippy interactive offset={[12, 8]} placement="bottom-end" render={renderTaskOptions}>
            {children}
        </Tippy>
    )
}

export default TaskOption
