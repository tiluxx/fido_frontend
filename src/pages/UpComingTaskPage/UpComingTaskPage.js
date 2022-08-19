import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { parseISO, formatRelative } from 'date-fns'
import { paramCase } from 'param-case'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateContext } from '~/context/PrivateContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'
import styles from './UpComingTaskPage.module.scss'
import './GlobalCssUpComingPage.css'

const cx = classNames.bind(styles)

function UpComingTaskPage() {
    const getCSRFToken = useContext(CSRFTokenContext)
    const privateContext = useContext(PrivateContext)
    const setResponse = useContext(ResponseDataContext)
    const [projects, setProjects] = useState(privateContext.privateData.projects)
    const [tasks, setTasks] = useState([])

    let navigate = useNavigate()

    useEffect(() => {
        setProjects(privateContext.privateData.projects)
    }, [privateContext.privateData.projects])

    useEffect(() => {
        if (projects) {
            const fetchTaskData = async (projectId) => {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
                await getCSRFToken()

                try {
                    const { data } = await axios.get(`/tasks/upComingDue?projectId=${projectId}`, config)

                    setTasks((prev) => [...prev, ...data.tasks])
                } catch (error) {
                    if (error.response.status === 401) {
                        await getCSRFToken()
                        const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                        if (data.success) {
                            try {
                                await getCSRFToken()
                                const { data } = await axios.get(`/tasks/upComingDue?projectId=${projectId}`, config)

                                setTasks((prev) => [...prev, ...data.tasks])
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

            projects.forEach((project) => {
                fetchTaskData(project._id)
            })
        }

        return () => {
            setTasks([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate])

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
                                    <h2 className={cx('user-title')}>Your upcoming due</h2>
                                </div>
                                <div className={cx('profile-noti-wrapper', 'responsive-md')}>
                                    <NotificationAndProfile />
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className={cx('progress-board')}>
                                <div className={cx('board-container')}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <h3 className={cx('board-title', 'no-select')}>Upcoming due</h3>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className={cx('project-list')}>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Title</TableCell>
                                                                <TableCell align="right">Due</TableCell>
                                                                <TableCell align="right">Location</TableCell>
                                                                <TableCell align="right">Condition</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {tasks.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={4}
                                                                        sx={{
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Whoa! There is no due here
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                            {tasks.map((task) => (
                                                                <TableRow
                                                                    key={task._id}
                                                                    sx={{
                                                                        '&:last-child td, &:last-child th': {
                                                                            border: 0,
                                                                        },
                                                                    }}
                                                                >
                                                                    <TableCell component="th" scope="row">
                                                                        {task.title}
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        {formatRelative(
                                                                            parseISO(task.dueAt),
                                                                            new Date(),
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell align="right">{task.location}</TableCell>
                                                                    <TableCell align="right">
                                                                        <div
                                                                            className={cx(
                                                                                'task-condition',
                                                                                `condition-${paramCase(
                                                                                    task.condition,
                                                                                )}`,
                                                                            )}
                                                                        >
                                                                            <span>{task.condition}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </StyledEngineProvider>
            </div>
        </div>
    )
}

export default UpComingTaskPage
