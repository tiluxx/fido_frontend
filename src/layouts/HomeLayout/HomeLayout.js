import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import Footer from '~/layouts/components/Footer'
import styles from './HomeLayout.module.scss'

const cx = classNames.bind(styles)

function HomeLayouts({ children }) {
    return (
        <div>
            <div className={cx('wrapper')}>{children}</div>
            <Footer />
        </div>
    )
}

HomeLayouts.propTypes = {
    children: PropTypes.node.isRequired,
}

export default HomeLayouts
