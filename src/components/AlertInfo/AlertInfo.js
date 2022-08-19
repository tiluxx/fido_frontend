import { useContext } from 'react'
import classNames from 'classnames/bind'
import { Alert, IconButton } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ResponseDataContext } from '~/layouts/WorkspaceLayout'
import { faCircleExclamation, faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import styles from './AlertInfo.module.scss'
import './GlobalCssAlert.css'

const cx = classNames.bind(styles)

function AlertInfo({ success, messageError = '', messageSuccess = '' }) {
    const setResponse = useContext(ResponseDataContext)

    return (
        <div className={cx('wrapper')}>
            <StyledEngineProvider injectFirst>
                {success ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setResponse({})
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                        }
                        icon={<FontAwesomeIcon icon={faCircleCheck} />}
                        severity="success"
                        color="success"
                    >
                        <span>
                            <span className={cx('alert-title')}>Success</span> - {messageSuccess}!
                        </span>
                    </Alert>
                ) : (
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setResponse({})
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                        }
                        icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                        severity="error"
                        color="error"
                    >
                        <span>
                            <span className={cx('alert-title')}>Error</span> - {messageError}!
                        </span>
                    </Alert>
                )}
            </StyledEngineProvider>
        </div>
    )
}

export default AlertInfo
