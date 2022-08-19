import { useState, useContext } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import './GlobalCssTaskDialog.css'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { ProjectDataContext } from '~/layouts/WorkspaceLayout'
import { FetchProjectDataContext } from '~/layouts/WorkspaceLayout'
import styles from './AddNewTaskDialog.module.scss'

const cx = classNames.bind(styles)

function AddNewTaskDialog() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const projectDataContext = useContext(ProjectDataContext)
    const handleFetchProjectData = useContext(FetchProjectDataContext)

    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [errorCreate, setErrorCreate] = useState('')

    const todayDate = new Date()
    const formatDate = todayDate.getDate() < 10 ? `0${todayDate.getDate()}` : todayDate.getDate()
    const formatMonth = todayDate.getMonth() + 1 < 10 ? `0${todayDate.getMonth() + 1}` : todayDate.getMonth() + 1
    const formattedDate = [todayDate.getFullYear(), formatMonth, formatDate].join('-')
    const [dueDate, setDueDate] = useState(formattedDate)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickClose = () => {
        setOpen(false)
    }

    const createTaskHandler = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            await axios.post(
                '/tasks/store',
                {
                    title,
                    dueAt: dueDate,
                    location,
                    description,
                    project_id: projectDataContext.privateProjectData.project._id,
                },
                config,
            )

            setTitle('')
            setLocation('')
            setDescription('')

            const todayDate = new Date()
            const formatDate = todayDate.getDate() < 10 ? `0${todayDate.getDate()}` : todayDate.getDate()
            const formatMonth =
                todayDate.getMonth() + 1 < 10 ? `0${todayDate.getMonth() + 1}` : todayDate.getMonth() + 1
            const formattedDate = [todayDate.getFullYear(), formatMonth, formatDate].join('-')
            setDueDate(formattedDate)

            setOpen(false)

            handleFetchProjectData(
                `/projects/${projectDataContext.privateProjectData.project.slug}?id=${projectDataContext.privateProjectData.project._id}`,
                `${projectDataContext.privateProjectData.project._id}`,
            )
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        await axios.post(
                            '/tasks/store',
                            {
                                title,
                                dueAt: dueDate,
                                location,
                                description,
                                project_id: projectDataContext.privateProjectData.project._id,
                            },
                            config,
                        )

                        setTitle('')
                        setLocation('')
                        setDescription('')

                        const todayDate = new Date()
                        const formatDate = todayDate.getDate() < 10 ? `0${todayDate.getDate()}` : todayDate.getDate()
                        const formatMonth =
                            todayDate.getMonth() + 1 < 10 ? `0${todayDate.getMonth() + 1}` : todayDate.getMonth() + 1
                        const formattedDate = [todayDate.getFullYear(), formatMonth, formatDate].join('-')
                        setDueDate(formattedDate)

                        setOpen(false)

                        handleFetchProjectData(
                            `/projects/${projectDataContext.privateProjectData.project.slug}?id=${projectDataContext.privateProjectData.project._id}`,
                            `${projectDataContext.privateProjectData.project._id}`,
                        )
                    } catch (error) {
                        setErrorCreate(error.response.data.error)
                        setTimeout(() => {
                            setErrorCreate('')
                        }, 5000)
                    }
                }
            } else {
                setErrorCreate(error.response.data.error)
                setTimeout(() => {
                    setErrorCreate('')
                }, 5000)
            }
        }
    }

    const cancelSubmitHandler = (e) => {
        e.preventDefault()
        handleClickClose()
    }

    return (
        <div>
            <button className={cx('add-task-btn')} onClick={handleClickOpen}>
                Add new task
            </button>
            <StyledEngineProvider injectFirst>
                <Dialog open={open} onClose={handleClickClose}>
                    <form id="add-new-task-form" onSubmit={(e) => createTaskHandler(e)}>
                        <DialogTitle>Create new task</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
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
                                    renderInput={(params) => <TextField required margin="dense" id="due" {...params} />}
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
                            <button form="add-new-task-form" onClick={cancelSubmitHandler} className={cx('cancel-btn')}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="add-new-task-form"
                                onClick={handleClickClose}
                                className={cx('submit-btn')}
                            >
                                Add
                            </button>
                        </DialogActions>
                    </form>
                </Dialog>
            </StyledEngineProvider>
        </div>
    )
}

export default AddNewTaskDialog
