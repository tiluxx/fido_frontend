import { useState, useContext, useEffect } from 'react'
import classNames from 'classnames/bind'
import {
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
} from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import { PrivateContext } from '~/context/PrivateContext'
import styles from './ProgressTable.module.scss'
import ProgressRow from '~/pages/components/ProgressRow'
import CircularLoading from '~/pages/components/CircularLoading'
import './GlobalCssProgressTable.css'

const cx = classNames.bind(styles)

function ProgressTable() {
    const privateContext = useContext(PrivateContext)
    const [projectList, setProjectList] = useState(privateContext.privateData.projects)

    useEffect(() => {
        setProjectList(privateContext.privateData.projects)
    }, [privateContext.privateData.projects])

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projectList.length) : 0

    return !privateContext.privateData.projects || !projectList ? (
        <CircularLoading />
    ) : (
        <div className={cx('project-item')}>
            <StyledEngineProvider injectFirst>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table sx={{ minWidth: 750 }} aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell>Project's&nbsp;name</TableCell>
                                                <TableCell align="right">Progress</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {projectList.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        sx={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        You haven't created any projects yet
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {projectList
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((project, index) => (
                                                    <ProgressRow key={index} row={project} />
                                                ))}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12}>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={projectList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </StyledEngineProvider>
        </div>
    )
}

export default ProgressTable
