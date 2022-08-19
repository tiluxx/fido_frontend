import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './NotFound.module.scss'
import images from '~/assets/images'
import config from '~/config'
import Footer from '~/layouts/components/Footer'

const cx = classNames.bind(styles)

function NotFound() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <img src={images.pageNotFound} alt="Page Not Found" className={cx('not-found__illustration')} />
                <div className={cx('content-wrapper')}>
                    <div className={cx('text-section')}>
                        <h3 className={cx('title')}>Oops! Page not found</h3>
                        <h5 className={cx('content')}>
                            The page you are looking for might have been removed, had its name changed or is temporarily
                            unavailable.
                        </h5>
                    </div>
                    <Link to={config.routes.home} className={cx('come-home-btn')}>
                        Come back home
                    </Link>
                </div>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    )
}

export default NotFound
