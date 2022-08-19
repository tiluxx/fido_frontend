import { useState, useContext } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import { Select, MenuItem, FormControl } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import { ProgressRowContext } from '~/pages/components/ProgressRow'
import styles from './SelectCondition.module.scss'

const cx = classNames.bind(styles)

function SelectCondition({ task }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const setResponse = useContext(ResponseDataContext)
    const { currProject, setCurrProject } = useContext(ProgressRowContext)
    const [condition, setCondition] = useState(task.condition)

    const updateTaskHandler = async (task, newTaskCondition) => {
        const taskId = task._id

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        let source
        let destination

        switch (task.condition) {
            case 'Not started':
                source = 'not-started'
                break
            case 'In progress':
                source = 'in-progress'
                break
            case 'Done':
                source = 'done'
                break
            default:
                break
        }

        switch (newTaskCondition) {
            case 'Not started':
                destination = 'not-started'
                break
            case 'In progress':
                destination = 'in-progress'
                break
            case 'Done':
                destination = 'done'
                break
            default:
                break
        }

        const start = currProject.boards[source]
        const finish = currProject.boards[destination]

        if (start !== finish) {
            const startTaskIds = Array.from(start.taskIds)
            startTaskIds.splice(startTaskIds.indexOf(taskId), 1)
            const newStart = {
                ...start,
                taskIds: startTaskIds,
            }

            const finishTaskIds = Array.from(finish.taskIds)
            finishTaskIds.splice(0, 0, taskId)

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

            try {
                const { data } = await axios.patch(
                    `/tasks/selectCondition/edit?projectId=${currProject._id}&id=${taskId}`,
                    { newProjectData, condition: newTaskCondition },
                    config,
                )
                setCurrProject(data.project)
            } catch (error) {
                if (error.response.status === 401) {
                    await getCSRFToken()
                    const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                    if (data.success) {
                        try {
                            await getCSRFToken()
                            const { data } = await axios.patch(
                                `/tasks/selectCondition/edit?projectId=${currProject._id}&id=${taskId}`,
                                { newProjectData, condition: newTaskCondition },
                                config,
                            )
                            setCurrProject(data.project)
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
    }

    const handleChange = (e) => {
        setCondition(e.target.value)
        updateTaskHandler(task, e.target.value)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select id="demo-select-small" value={condition} onChange={handleChange}>
                <MenuItem value={'Not started'}>
                    <div className={cx('condition-wrapper')}>
                        <FontAwesomeIcon icon={faCircle} className={cx('item-condition', 'not-started')} />
                        <span>Not started</span>
                    </div>
                </MenuItem>
                <MenuItem value={'In progress'}>
                    <div className={cx('condition-wrapper')}>
                        <FontAwesomeIcon icon={faCircle} className={cx('item-condition', 'in-progress')} />
                        <span>In progress</span>
                    </div>
                </MenuItem>
                <MenuItem value={'Done'}>
                    <div className={cx('condition-wrapper')}>
                        <FontAwesomeIcon icon={faCircle} className={cx('item-condition', 'done')} />
                        <span>Done</span>
                    </div>
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectCondition
