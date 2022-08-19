import { useContext } from 'react'
import classNames from 'classnames/bind'
import { Grid } from '@mui/material'

import styles from './UserProgressPage.module.scss'
import { PrivateContext } from '~/context/PrivateContext'
import NotificationAndProfile from '~/pages/components/NotificationAndProfile'
import ProgressTable from '~/pages/components/ProgressTable'

const cx = classNames.bind(styles)

function UserProgressPage() {
    const privateContext = useContext(PrivateContext)

    return privateContext.error ? (
        <span className="error-message">{privateContext.error}</span>
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={cx('header-space')}>
                            <div className={cx('user-info')}>
                                <h2 className={cx('user-title')}>Your Progress</h2>
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
                                        <h3 className={cx('board-title', 'no-select')}>Progress board</h3>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={cx('project-list')}>
                                            <ProgressTable />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default UserProgressPage
