import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DragDropContext } from 'react-beautiful-dnd'
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateContext } from '~/context/PrivateContext'
import { ProjectDataContext, ResponseDataContext } from '~/layouts/WorkspaceLayout'
import styles from './Workspace.module.scss'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import TaskBoard from '~/pages/components/TaskBoard'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'
import AddNewTaskDialog from '~/pages/components/AddNewTaskDialog'
import CircularLoading from '~/pages/components/CircularLoading'
import images from '~/assets/images'

const cx = classNames.bind(styles)
const defaultFunc = () => {}

function Workspace() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const privateContext = useContext(PrivateContext)
    const setResponse = useContext(ResponseDataContext)
    const projectDataContext = useContext(ProjectDataContext)
    const [currProject, setCurrProject] = useState(projectDataContext.privateProjectData.project)
    const [currTasks, setCurrTasks] = useState(projectDataContext.privateProjectData.tasks)
    const [openCongrats, setOpenCongrats] = useState(false)

    const navigate = useNavigate()

    const handleOpenCongrats = () => {
        setOpenCongrats(true)
    }

    const handleCloseCongrats = () => {
        setOpenCongrats(false)
    }

    const handleOnDragEnd = async (result) => {
        const { destination, source, draggableId } = result

        if (!destination) {
            return
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return
        }

        const start = currProject.boards[source.droppableId]
        const finish = currProject.boards[destination.droppableId]

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            }

            const newData = {
                ...currProject,
                boards: {
                    ...currProject.boards,
                    [newColumn.board_id]: newColumn,
                },
            }
            setCurrProject(newData)

            try {
                await axios.patch(`/projects/inDnd/edit/${currProject.slug}`, newData, config)
            } catch (error) {
                if (error.response.status === 401) {
                    await getCSRFToken()
                    const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                    if (data.success) {
                        try {
                            await getCSRFToken()
                            await axios.patch(`/projects/inDnd/edit/${currProject.slug}`, newData, config)
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

            return
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1)
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId)

        // Get new condition for the task
        const newCondition = finish.title
        const newTask = {
            ...currTasks.find((task) => task._id === draggableId),
            condition: newCondition,
        }

        // Get new task list in finish
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        }

        const newProjectData = {
            ...currProject,
            boards: {
                ...currProject.boards,
                [newStart.board_id]: newStart,
                [newFinish.board_id]: newFinish,
            },
        }

        const newTasksData = [...currTasks]

        newTasksData.forEach((task, index) => {
            if (task._id === newTask._id) {
                newTasksData[index].condition = newTask.condition
            }
        })

        setCurrProject(newProjectData)
        setCurrTasks(newTasksData)

        try {
            await axios.patch(`/projects/inDnd/edit/${currProject.slug}`, newProjectData, config)
            await axios.patch('/tasks/inDnd/edit', newTask, config)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        await axios.patch(`/projects/inDnd/edit/${currProject.slug}`, newProjectData, config)
                        await axios.patch('/tasks/inDnd/edit', newTask, config)
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

    const handleProjectDone = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            await axios.patch(`/projects/project_done/${currProject.slug}?id=${currProject._id}`, config)

            handleOpenCongrats()
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        await axios.patch(`/projects/project_done/${currProject.slug}?id=${currProject._id}`, config)

                        handleOpenCongrats()
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

    const projectDoneBtnClass = useMemo(() => {
        if (currProject) {
            let notStartedBoard
            let inProgressBoard
            let doneBoard
            currProject.boardOrder.forEach((boardId) => {
                const board = currProject.boards[boardId]
                switch (boardId) {
                    case 'not-started':
                        notStartedBoard = board.taskIds.length
                        break
                    case 'in-progress':
                        inProgressBoard = board.taskIds.length
                        break
                    case 'done':
                        doneBoard = board.taskIds.length
                        break
                    default:
                        break
                }
            })

            const isDone = notStartedBoard === 0 && inProgressBoard === 0 && doneBoard !== 0
            if (isDone) {
                return cx('project-done-btn', 'enabled')
            } else {
                return cx('project-done-btn', 'disabled')
            }
        }
    }, [currProject])

    const projectDoneFunc = async (e) => {
        e.preventDefault()

        if (currProject) {
            let notStartedBoard
            let inProgressBoard
            let doneBoard
            currProject.boardOrder.forEach((boardId) => {
                const board = currProject.boards[boardId]
                switch (boardId) {
                    case 'not-started':
                        notStartedBoard = board.taskIds.length
                        break
                    case 'in-progress':
                        inProgressBoard = board.taskIds.length
                        break
                    case 'done':
                        doneBoard = board.taskIds.length
                        break
                    default:
                        break
                }
            })

            const isDone = notStartedBoard === 0 && inProgressBoard === 0 && doneBoard !== 0
            if (isDone) {
                await handleProjectDone()
            } else {
                defaultFunc()
            }
        }
    }

    const handlerDeleteProject = async (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.delete(`/projects/delete/${currProject.slug}?id=${currProject._id}`, config)

            handleCloseCongrats()
            setResponse(data)
            setTimeout(() => {
                setResponse({})
            }, 5000)
            navigate(`/workspace/${localStorage.getItem('userSlug')}`)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        const { data } = await axios.delete(
                            `/projects/delete/${currProject.slug}?id=${currProject._id}`,
                            config,
                        )

                        handleCloseCongrats()
                        setResponse(data)
                        setTimeout(() => {
                            setResponse({})
                        }, 5000)
                        navigate(`/workspace/${localStorage.getItem('userSlug')}`)
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

    const handlerArchiveProject = (e) => {
        e.preventDefault()

        handleCloseCongrats()
        navigate(`/workspace/${localStorage.getItem('userSlug')}`)
    }

    useEffect(() => {
        setCurrProject(projectDataContext.privateProjectData.project)
        setCurrTasks(projectDataContext.privateProjectData.tasks)
    }, [projectDataContext.privateProjectData.project, projectDataContext.privateProjectData.tasks])

    return privateContext.error || projectDataContext.error ? (
        <span className="error-message">{privateContext.error || projectDataContext.error}</span>
    ) : !privateContext.privateData ? (
        <CircularLoading />
    ) : !currProject || !currTasks ? (
        <CircularLoading />
    ) : (
        <div>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header-space')}>
                        <Grid container>
                            <Grid item md={4} xs={6}>
                                <div className={cx('project-info')}>
                                    <h2 className={cx('project-title')}>{currProject.name}</h2>
                                    <AddNewTaskDialog />
                                </div>
                            </Grid>
                            <Grid item md={4} xs={0}>
                                <div className={cx('profile-noti-wrapper', 'responsive-md')}>
                                    <NotificationAndProfile />
                                </div>
                            </Grid>
                            <Grid item md={4} xs={6}>
                                <div className={cx('project-done')}>
                                    <button className={projectDoneBtnClass} onClick={projectDoneFunc}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span>Project done</span>
                                    </button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={cx('workflow-space')}>
                        <Grid item xs={12}>
                            <div className={cx('workflow-wrapper')}>
                                <Grid container justifyContent="center" spacing={3}>
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                        {currProject.boardOrder.map((boardId) => {
                                            const board = currProject.boards[boardId]
                                            const tasks = board.taskIds.map((taskId) => {
                                                return currTasks.find((task) => task._id === taskId)
                                            })

                                            return (
                                                <TaskBoard
                                                    key={board.board_id}
                                                    board={board}
                                                    tasks={tasks}
                                                    project={currProject}
                                                />
                                            )
                                        })}
                                    </DragDropContext>
                                </Grid>
                            </div>
                        </Grid>
                    </div>
                </div>

                <StyledEngineProvider injectFirst>
                    <Dialog
                        open={openCongrats}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'This action will delete the project!'}</DialogTitle>
                        <DialogContent>
                            <div className={cx('modal-project-done')}>
                                <h3 className={cx('modal-project-done__title')}>Congrats</h3>
                                <img
                                    src={images.projectDone}
                                    alt="project done"
                                    className={cx('modal-project-done__illustration')}
                                />
                                <h5 className={cx('modal-project-done__content')}>You have done your project</h5>
                                <h5 className={cx('modal-project-done__content')}>Keep on your journey</h5>
                            </div>
                            <Divider />
                            <p className={cx('modal-project-option__content')}>
                                Do you want to archive this project or delete it?
                            </p>
                        </DialogContent>
                        <DialogActions>
                            <button onClick={handlerArchiveProject} className={cx('archive-btn')}>
                                Archive
                            </button>
                            <button onClick={handlerDeleteProject} className={cx('delete-btn')}>
                                Delete
                            </button>
                        </DialogActions>
                    </Dialog>
                </StyledEngineProvider>
            </div>
        </div>
    )
}

export default Workspace
