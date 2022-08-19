import { parseISO, format } from 'date-fns'
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import SelectCondition from '~/pages/components/SelectCondition'

function CollapseTasks({ open, currTasks }) {
    return (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
                <Typography variant="h4" gutterBottom component="div">
                    Tasks
                </Typography>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Due</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Condition</TableCell>
                        </TableRow>
                    </TableHead>
                    {currTasks.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                >
                                    This project is empty
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {currTasks.map((task, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {task.title}
                                    </TableCell>
                                    <TableCell align="right">{format(parseISO(task.dueAt), 'PPp')}</TableCell>
                                    <TableCell align="right">{task.location}</TableCell>
                                    <TableCell align="right">
                                        <SelectCondition task={task} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </Box>
        </Collapse>
    )
}

export default CollapseTasks
