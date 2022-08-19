import classNames from 'classnames/bind'
import { Droppable } from 'react-beautiful-dnd'
import Grid from '@mui/material/Grid'
import styles from './TaskBoard.module.scss'
import Task from '~/pages/components/Task'

const cx = classNames.bind(styles)

function TaskBoard({ board, tasks, project }) {
    return (
        <Grid item md={4} xs={9} zeroMinWidth>
            <div className={cx('container', `col-${board.board_id}`)}>
                <h3 className={cx('board-title', 'no-select')}>{board.title}</h3>
                <Droppable droppableId={board.board_id}>
                    {(provided) => (
                        <div
                            className={cx('task-list')}
                            key={board._id}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.length === 0 ? (
                                <h3 className={cx('empty-task-list', 'no-select')}>Your task list is empty</h3>
                            ) : (
                                tasks.map((task, index) => (
                                    <Task key={task._id} task={task} index={index} project={project} />
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </Grid>
    )
}

export default TaskBoard
