import { useRef } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from '@mui/material/Grid'

import styles from './Home.module.scss'
import { faCaretRight, faAnglesDown, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import images from '~/assets/images'
import config from '~/config'
import Header from '~/layouts/components/Header'

const cx = classNames.bind(styles)

function Home() {
    const introductionSection = useRef()

    const scrollToIntroductionSection = () =>
        window.scrollTo({
            top: introductionSection.current.offsetTop,
            behavior: 'smooth',
        })

    const scrollToContactSection = () =>
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        })

    return (
        <div className={cx('container')}>
            <Header
                scrollToIntroductionSection={scrollToIntroductionSection}
                scrollToContactSection={scrollToContactSection}
            />
            <div className={cx('content')}>
                <div className={cx('content-wrapper')}>
                    <div className={cx('initial-home-part')}>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                '@media (min-width: 0) and (max-width: 599px)': {
                                    alignItems: 'center',
                                },
                            }}
                        >
                            <Grid item lg={6} xs={12}>
                                <div className={cx('home__text-wrapper')}>
                                    <h1 className={cx('home__main-title')}>Where you hang out with your deadlines</h1>
                                    <h4 className={cx('home__sub-title')}>
                                        Your tasks look a mess, don't they? Let's FIDO and chill
                                    </h4>
                                    <Link to={config.routes.register}>
                                        <div className={cx('register-wrapper')}>
                                            <h5 className={cx('item-title')}>Get started</h5>
                                            <FontAwesomeIcon icon={faCaretRight} className={cx('item-icon')} />
                                        </div>
                                    </Link>
                                </div>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <div className={cx('home__illustration-wrapper')}>
                                    <img
                                        src={images.multitasking}
                                        alt="multitasking"
                                        className={cx('home__illustration-img')}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={cx('home__part-final')}>
                                    <h5 className={cx('home__part-title')}>Explore what we can help</h5>
                                    <button
                                        className={cx('home__part-explore-btn')}
                                        onClick={scrollToIntroductionSection}
                                    >
                                        <FontAwesomeIcon icon={faAnglesDown} bounce className={cx('home__part-icon')} />
                                    </button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    <div ref={introductionSection} className={cx('introduction-part__usage')}>
                        <Grid container spacing={{ xs: 8, lg: 3 }}>
                            <Grid item xs={12}>
                                <div className={cx('intro__title-wrapper')}>
                                    <h2 className={cx('intro__main-title')}>
                                        Our <span className={cx('highlight-text')}>usage</span>
                                    </h2>
                                    <h4 className={cx('intro__sub-title')}>
                                        An application let you shape your work on your way
                                    </h4>
                                </div>
                            </Grid>
                            <Grid item lg={3} sm={6} xs={12}>
                                <div className={cx('intro__func-content')}>
                                    <div className={cx('intro__func-icon-part')}>
                                        <div className={cx('intro__func-circle-wrap-icon')}>
                                            <FontAwesomeIcon icon={faCircleCheck} className={cx('intro__func-icon')} />
                                        </div>
                                    </div>
                                    <div className={cx('intro__func-title-part')}>
                                        <h2 className={cx('intro__func-title')}>Clean workflow management</h2>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={3} sm={6} xs={12}>
                                <div className={cx('intro__func-content')}>
                                    <div className={cx('intro__func-icon-part')}>
                                        <div className={cx('intro__func-circle-wrap-icon')}></div>
                                        <FontAwesomeIcon icon={faCircleCheck} className={cx('intro__func-icon')} />
                                    </div>
                                    <div className={cx('intro__func-title-part')}>
                                        <h2 className={cx('intro__func-title')}>Easily divide your tasks</h2>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={3} sm={6} xs={12}>
                                <div className={cx('intro__func-content')}>
                                    <div className={cx('intro__func-icon-part')}>
                                        <div className={cx('intro__func-circle-wrap-icon')}>
                                            <FontAwesomeIcon icon={faCircleCheck} className={cx('intro__func-icon')} />
                                        </div>
                                    </div>
                                    <div className={cx('intro__func-title-part')}>
                                        <h2 className={cx('intro__func-title')}>Accelerate your productivity</h2>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={3} sm={6} xs={12}>
                                <div className={cx('intro__func-content')}>
                                    <div className={cx('intro__func-icon-part')}>
                                        <div className={cx('intro__func-circle-wrap-icon')}></div>
                                        <FontAwesomeIcon icon={faCircleCheck} className={cx('intro__func-icon')} />
                                    </div>
                                    <div className={cx('intro__func-title-part')}>
                                        <h2 className={cx('intro__func-title')}>Reach your goal</h2>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    <div className={cx('introduction-part__aim')}>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                '@media (min-width: 0) and (max-width: 599px)': {
                                    textAlign: 'center',
                                },
                            }}
                            alignItems="center"
                        >
                            <Grid item sm={6} xs={12}>
                                <div className={cx('aim__illustration-wrapper')}>
                                    <img
                                        src={images.workingPage}
                                        alt="Working page"
                                        className={cx('aim__func-illus')}
                                    />
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <div className={cx('aim__text-wrapper')}>
                                    <h2 className={cx('aim__main-title')}>
                                        <span className={cx('highlight-text')}>Draw the flow</span> to reach the goal
                                    </h2>
                                    <p className={cx('aim__sub-title')}>
                                        Break your project into tiny pieces. Manage the task in that project. Drag and
                                        drop it to keep track of what you're doing. And whoah, Done! Follow simple steps
                                        by step to deal with your tedious deadlines.
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    <div className={cx('introduction-part__final')}>
                        <Grid
                            container
                            spacing={5}
                            sx={{
                                '@media (min-width: 0) and (max-width: 599px)': {
                                    textAlign: 'center',
                                },
                            }}
                            alignItems="center"
                        >
                            <Grid item sm={6} xs={12}>
                                <div className={cx('intro-final__text-wrapper')}>
                                    <h2 className={cx('intro-final__main-title')}>
                                        <span className={cx('highlight-text')}>Let's enhance</span> your workflow to the
                                        next level
                                    </h2>
                                    <p className={cx('intro-final__sub-title')}>
                                        Create your projects with FIDO and play with your deadlines
                                    </p>
                                    <Link to={config.routes.register}>
                                        <div className={cx('register-wrapper')}>
                                            <h5 className={cx('item-title')}>Get started</h5>
                                            <FontAwesomeIcon icon={faCaretRight} className={cx('item-icon')} />
                                        </div>
                                    </Link>
                                </div>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <div className={cx('intro-final__illustration-wrapper')}>
                                    <img src={images.toTheMoon} alt="Workspace" className={cx('intro-final__illus')} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
