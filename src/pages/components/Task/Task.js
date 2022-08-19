import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { parseISO, format } from 'date-fns'
import classNames from 'classnames/bind'
import { Draggable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Divider, Backdrop, Box, Modal, Fade } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import styles from './Task.module.scss'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import TaskOption from '~/components/Popper/TaskOption'
import './GlobalCssTask.css'

const cx = classNames.bind(styles)

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
}

function Task({ task, index, project }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const setResponse = useContext(ResponseDataContext)
    const [currTask, setCurrTask] = useState(task)
    const [open, setOpen] = useState(false)
    const [condition, setCondition] = useState('not-started')

    const updateTaskHandler = async (taskObj) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.patch(`/tasks/edit?id=${currTask._id}`, taskObj, config)

            setCurrTask(data.task)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        const { data } = await axios.patch(`/tasks/edit?id=${currTask._id}`, taskObj, config)

                        setCurrTask(data.task)
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

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        switch (currTask.condition) {
            case 'Not started':
                setCondition('not-started')
                break
            case 'In progress':
                setCondition('in-progress')
                break
            case 'Done':
                setCondition('done')
                break
            default:
                setCondition('not-started')
                break
        }
    }, [currTask.condition])

    return (
        <Draggable key={index} draggableId={currTask._id} index={index}>
            {(provided) => (
                <div className={cx('task-wrapper')}>
                    <div
                        className={cx('task-item')}
                        key={currTask._id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <div onClick={handleOpen}>
                                    <h3 className={cx('task-title')}>{currTask.title}</h3>
                                    <h5 className={cx('task-condition')}>{`Due ${format(
                                        parseISO(currTask.dueAt),
                                        'PPp',
                                    )}`}</h5>
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <TaskOption item={currTask} project={project} updateTaskHandler={updateTaskHandler}>
                                    <div className={cx('more-icon')}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </div>
                                </TaskOption>
                            </Grid>
                        </Grid>
                    </div>

                    <StyledEngineProvider injectFirst>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <div className={cx('modal-task-header')}>
                                        <h2 className={cx('modal-task-title')}>{currTask.title}</h2>
                                        <h5 className={cx('modal-content__condition', `condition-${condition}`)}>
                                            {currTask.condition}
                                        </h5>
                                    </div>
                                    <Divider />
                                    <div className={cx('modal-task-info-wrapper')}>
                                        <Grid container>
                                            <div className={cx('modal-info-wrapper')}>
                                                <Grid item xs={4}>
                                                    <div className={cx('modal-info-wrapper__title')}>
                                                        <h5>Due</h5>
                                                        {currTask.location && <h5>Location</h5>}
                                                        {currTask.description && <h5>Description</h5>}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <div className={cx('modal-info-wrapper__content')}>
                                                        <h5 className={cx('modal-content')}>
                                                            {format(parseISO(currTask.dueAt), 'PPp')}
                                                        </h5>
                                                        {currTask.location && (
                                                            <h5 className={cx('modal-content')}>{currTask.location}</h5>
                                                        )}
                                                        {currTask.description && (
                                                            <h5 className={cx('modal-content')}>
                                                                {currTask.description}
                                                            </h5>
                                                        )}
                                                    </div>
                                                </Grid>
                                            </div>
                                        </Grid>
                                    </div>
                                </Box>
                            </Fade>
                        </Modal>
                    </StyledEngineProvider>
                </div>
            )}
        </Draggable>
    )
}

export default Task
