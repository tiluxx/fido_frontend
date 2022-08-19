import { useState, useContext, createContext } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import Grid from '@mui/material/Grid'

import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateProvider } from '~/context/PrivateContext'
import styles from './WorkspaceLayout.module.scss'
import NavigationBar from '~/layouts/components/NavigationBar'
import AlertInfo from '~/components/AlertInfo'

const cx = classNames.bind(styles)

const FetchProjectDataContext = createContext()
const ProjectDataContext = createContext()
const ResponseDataContext = createContext()

function WorkspaceLayout({ children }) {
    const getCSRFToken = useContext(CSRFTokenContext)
    const [privateProjectData, setPrivateProjectData] = useState({})
    const [response, setResponse] = useState({})
    const [error, setError] = useState('')

    const handleFetchProjectData = async (projectPathname, reqId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const projectData = await axios.get(projectPathname, config)
            const taskData = await axios.get(`/tasks/get?projectId=${reqId}`, config)

            setPrivateProjectData({ project: projectData.data.project, tasks: taskData.data.tasks })
        } catch (error) {
            if (error.response.status === 401) {
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        const projectData = await axios.get(projectPathname, config)
                        const taskData = await axios.get(`/tasks/get?projectId=${reqId}`, config)

                        setPrivateProjectData({ project: projectData.data.project, tasks: taskData.data.tasks })
                    } catch (error) {
                        setError('Project is not defined')
                    }
                }
            } else {
                setError('Project is not defined')
            }
        }
    }

    const value = {
        privateProjectData,
        error,
    }

    return (
        <div className={cx('wrapper')}>
            <PrivateProvider>
                <FetchProjectDataContext.Provider value={handleFetchProjectData}>
                    <Grid container wrap="nowrap" spacing={{ md: 2 }} direction={{ xs: 'column', md: 'row' }}>
                        <Grid item lg={2} md={3} xs={1}>
                            <NavigationBar />
                        </Grid>
                        <Grid item lg={10} md={9} xs={11}>
                            <ProjectDataContext.Provider value={value}>
                                <ResponseDataContext.Provider value={setResponse}>
                                    <div className={cx('container')}>
                                        <div className={cx('content')}>{children}</div>
                                    </div>
                                    {Object.keys(response).length !== 0 && (
                                        <AlertInfo
                                            success={response.success}
                                            messageError={response.error}
                                            messageSuccess={response.message}
                                        />
                                    )}
                                </ResponseDataContext.Provider>
                            </ProjectDataContext.Provider>
                        </Grid>
                    </Grid>
                </FetchProjectDataContext.Provider>
            </PrivateProvider>
        </div>
    )
}

WorkspaceLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default WorkspaceLayout
export { FetchProjectDataContext, ProjectDataContext, ResponseDataContext }
