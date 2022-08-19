import { Fragment, useState, useEffect, useMemo, createContext, useContext } from 'react'
import axios from 'axios'
import { IconButton, TableCell, TableRow } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CircularProgressWithLabel from '~/components/CircularProgressWithLabel'
import CollapseTasks from '~/pages/components/CollapseTasks'

const ProgressRowContext = createContext()

function ProgressRow({ row }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const setResponse = useContext(ResponseDataContext)
    const [currProject, setCurrProject] = useState(row)
    const [currTasks, setCurrTasks] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setCurrProject(row)
    }, [row])

    const handleFetchTasksData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        await getCSRFToken()

        try {
            const { data } = await axios.get(`/tasks/get?projectId=${currProject._id}`, config)

            setCurrTasks(data.tasks)
        } catch (error) {
            if (error.response.status === 401) {
                await getCSRFToken()
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        await getCSRFToken()
                        const { data } = await axios.get(`/tasks/get?projectId=${currProject._id}`, config)

                        setCurrTasks(data.tasks)
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

    useEffect(() => {
        const fetchTasksData = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            await getCSRFToken()

            try {
                const { data } = await axios.get(`/tasks/get?projectId=${currProject._id}`, config)

                setCurrTasks(data.tasks)
            } catch (error) {
                if (error.response.status === 401) {
                    await getCSRFToken()
                    const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                    if (data.success) {
                        try {
                            await getCSRFToken()
                            const { data } = await axios.get(`/tasks/get?projectId=${currProject._id}`, config)

                            setCurrTasks(data.tasks)
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
        fetchTasksData(currProject)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currProject])

    const openCollapseTask = () => {
        if (!open) {
            handleFetchTasksData()
        }
        setOpen(!open)
    }

    const countPercentProgress = useMemo(() => {
        let countDone = 0
        let countNotDone = 0
        currProject.boardOrder.forEach((boardId) => {
            if (boardId !== 'done') {
                countNotDone += currProject.boards[boardId].taskIds.length
            } else {
                countDone += currProject.boards[boardId].taskIds.length
            }
        })

        let percent = 0

        if (countDone === 0 && countNotDone === 0) {
            percent = 0
        } else {
            percent = (countDone / (countDone + countNotDone)) * 100
        }

        return percent
    }, [currProject.boardOrder, currProject.boards])

    return (
        <Fragment>
            <ProgressRowContext.Provider value={{ currProject, setCurrProject }}>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={openCollapseTask}>
                            {open ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {currProject.name}
                    </TableCell>
                    <TableCell align="right">
                        <CircularProgressWithLabel value={countPercentProgress} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <CollapseTasks open={open} currTasks={currTasks} />
                    </TableCell>
                </TableRow>
            </ProgressRowContext.Provider>
        </Fragment>
    )
}

export default ProgressRow
export { ProgressRowContext }
