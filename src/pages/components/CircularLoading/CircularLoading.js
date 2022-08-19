import classNames from 'classnames/bind'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import styles from './CircularLoading.module.scss'
import images from '~/assets/images'

const cx = classNames.bind(styles)

function CircularLoading() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <img src={images.logoBlue} alt="FIDO" className={cx('logo-img')} />
                <span className={cx('sub-title')}>Let's FIDO</span>
                <Box>
                    <CircularProgress
                        sx={{
                            color: 'var(--majorelle-blue)',
                        }}
                    />
                </Box>
            </div>
        </div>
    )
}

export default CircularLoading
