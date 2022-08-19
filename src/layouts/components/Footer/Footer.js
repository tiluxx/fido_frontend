import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from '@mui/material/Grid'

import styles from './Footer.module.scss'
import images from '~/assets/images'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import MailTo from '~/layouts/components/MailTo'

const cx = classNames.bind(styles)

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <Grid
                container
                spacing={{ xs: 3, md: 0 }}
                sx={{
                    '@media (min-width: 0) and (max-width: 599px)': {
                        alignItems: 'center',
                        textAlign: 'center',
                    },
                }}
            >
                <Grid item sm={6} xs={12}>
                    <div className={cx('logo')}>
                        <img src={images.logoWhite} alt="FIDO" className={cx('logo-img')} />
                    </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <div className={cx('info-wrapper')}>
                        <div className={cx('info-contact')}>
                            <h3 className={cx('contact-title')}>Contact</h3>
                            <MailTo className={cx('contact-detail')}>Email: work.lethanhtien@gmail.com</MailTo>
                            <h5 className={cx('contact-detail')}>Phone: 090xxxxxxx</h5>
                        </div>
                        <div className={cx('info-social')}>
                            <a href="https://www.facebook.com/your.lethanhtien169/">
                                <FontAwesomeIcon icon={faFacebook} className={cx('social-icon')} />
                            </a>
                            <a href="/">
                                <FontAwesomeIcon icon={faInstagram} className={cx('social-icon')} />
                            </a>
                            <a href="https://twitter.com/tiluxx_">
                                <FontAwesomeIcon icon={faTwitter} className={cx('social-icon')} />
                            </a>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={cx('copyright')}>
                        <span className={cx('copyright-text')}>© 2022 FIDO. Made by TiLux</span>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Footer
