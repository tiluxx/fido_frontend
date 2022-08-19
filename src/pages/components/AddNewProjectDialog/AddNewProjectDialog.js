import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { StyledEngineProvider } from '@mui/material/styles'

import { FetchProjectDataContext } from '~/layouts/WorkspaceLayout'
import { CSRFTokenContext } from '~/context/CSRFTokenContext'
import { PrivateContext } from '~/context/PrivateContext'
import { NavigateBarContext } from '~/layouts/components/NavigationBar'
import styles from './AddNewProjectDialog.module.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './GlobalCssProjectDialog.css'

const cx = classNames.bind(styles)

function AddNewProjectDialog() {
    const handleFetchProjectData = useContext(FetchProjectDataContext)
    const getCSRFToken = useContext(CSRFTokenContext)
    const privateContext = useContext(PrivateContext)
    const setState = useContext(NavigateBarContext)
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [errorCreate, setErrorCreate] = useState('')

    const navigate = useNavigate()

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickClose = () => {
        setOpen(false)
    }

    const createProjectHandler = async (e) => {
        e.preventDefault()

        const config = {
            header: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await getCSRFToken()

        try {
            const { data } = await axios.post(
                '/projects/store',
                { name, user_id: privateContext.privateData.user_id },
                config,
            )

            setName('')
            setOpen(false)

            handleFetchProjectData(`/projects/${data.slug}?id=${data.projectId}`, `${data.projectId}`)
            setState(false)
            navigate(`/projects/${data.slug}`)
        } catch (error) {
            if (error.response.status === 401) {
                const { data } = await axios.post('/api/refreshToken/user/getNewAccessToken', config)
                if (data.success) {
                    try {
                        const { data } = await axios.post(
                            '/projects/store',
                            { name, user_id: privateContext.privateData.user_id },
                            config,
                        )

                        setName('')
                        setOpen(false)

                        handleFetchProjectData(`/projects/${data.slug}?id=${data.projectId}`, `${data.projectId}`)
                        navigate(`/projects/${data.slug}`)
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
            <button className={cx('add-project-btn')} onClick={handleClickOpen}>
                <FontAwesomeIcon icon={faPlus} />
                <span className={cx('add-project-title')}>Add project</span>
            </button>
            <StyledEngineProvider injectFirst>
                <Dialog open={open} onClose={handleClickClose}>
                    <form id="add-new-project-form" onSubmit={(e) => createProjectHandler(e)}>
                        <DialogTitle>Create new project</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Project's name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!name}
                                helperText={!name && errorCreate}
                            />
                        </DialogContent>
                        <DialogActions>
                            <button
                                form="add-new-project-form"
                                onClick={cancelSubmitHandler}
                                className={cx('cancel-btn')}
                            >
                                Cancel
                            </button>
                            <button type="submit" form="add-new-project-form" className={cx('submit-btn')}>
                                Add
                            </button>
                        </DialogActions>
                    </form>
                </Dialog>
            </StyledEngineProvider>
        </div>
    )
}

export default AddNewProjectDialog
