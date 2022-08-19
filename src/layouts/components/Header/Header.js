import { Fragment, useState } from 'react'
import { Grid, Box, SwipeableDrawer, List, Divider, ListItem } from '@mui/material'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Header.module.scss'
import images from '~/assets/images'
import { faCaretRight, faBars } from '@fortawesome/free-solid-svg-icons'
import config from '~/config'

const cx = classNames.bind(styles)

const defaultFunc = () => {}
function Header({ scrollToContactSection = defaultFunc, scrollToIntroductionSection = defaultFunc }) {
    const [state, setState] = useState(false)

    const toggleDrawer = (open) => (e) => {
        if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }

        setState(open)
    }

    const list = () => (
        <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List sx={{ padding: '0 16px;', marginBottom: '32px;' }}>
                <ListItem sx={{ padding: '16px 0;' }}>
                    <button className={cx('item-btn')} onClick={scrollToIntroductionSection}>
                        <h5 className={cx('item-title')}>Introduction</h5>
                    </button>
                </ListItem>
                <Divider />
                <ListItem sx={{ padding: '16px 0;' }}>
                    <button className={cx('item-btn')} onClick={scrollToContactSection}>
                        <h5 className={cx('item-title')}>Contact</h5>
                    </button>
                </ListItem>
                <Divider />
            </List>
            <List>
                <ListItem disablePadding sx={{ justifyContent: 'space-evenly;' }}>
                    <Link to={config.routes.login}>
                        <h5 className={cx('item-title')}>Sign in</h5>
                    </Link>
                    <Link to={config.routes.register}>
                        <div className={cx('register-wrapper')}>
                            <h5 className={cx('item-title')}>Sign up</h5>
                            <FontAwesomeIcon icon={faCaretRight} className={cx('item-icon')} />
                        </div>
                    </Link>
                </ListItem>
            </List>
        </Box>
    )

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

    return (
        <div className={cx('wrapper')}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={6}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}>
                            <img src={images.logoBlue} alt="FIDO" className={cx('logo-img')} />
                        </Link>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className={cx('container')}>
                        <button className={cx('item-btn')} onClick={scrollToIntroductionSection}>
                            <h5 className={cx('item-title')}>Introduction</h5>
                        </button>
                        <button className={cx('item-btn')} onClick={scrollToContactSection}>
                            <h5 className={cx('item-title')}>Contact</h5>
                        </button>
                        <Link to={config.routes.login}>
                            <h5 className={cx('item-title')}>Sign in</h5>
                        </Link>
                        <Link to={config.routes.register}>
                            <div className={cx('register-wrapper')}>
                                <h5 className={cx('item-title')}>Get started</h5>
                                <FontAwesomeIcon icon={faCaretRight} className={cx('item-icon')} />
                            </div>
                        </Link>
                    </div>
                    <div className={cx('mobile__menu')}>
                        <Fragment>
                            <button onClick={toggleDrawer(true)} className={cx('mobile__menu-btn')}>
                                <FontAwesomeIcon icon={faBars} className={cx('mobile__menu-icon')} />
                            </button>
                            <SwipeableDrawer
                                anchor={'right'}
                                open={state}
                                onClose={toggleDrawer(false)}
                                onOpen={toggleDrawer(true)}
                                disableBackdropTransition={!iOS}
                                disableDiscovery={iOS}
                            >
                                {list()}
                            </SwipeableDrawer>
                        </Fragment>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Header
