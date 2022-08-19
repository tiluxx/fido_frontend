import config from '~/config'

// Layouts
import { HomeLayout, WorkspaceLayout } from '~/layouts'

import Home from '~/pages/Home'
import Register from '~/pages/Register'
import Login from '~/pages/Login'
import ForgotPassword from '~/pages/ForgotPassword'
import ResetPassword from '~/pages/ResetPassword'
import VerifyEmail from '~/pages/VerifyEmail'
import UserProgressPage from '~/pages/UserProgressPage'
import UpComingTaskPage from '~/pages/UpComingTaskPage'
import RecycleBinPage from '~/pages/RecycleBinPage'
import ArchivePage from '~/pages/ArchivePage'
import Workspace from '~/pages/Workspace'
import WelcomeWorkspace from '~/pages/WelcomeWorkspace'
import NotFound from '~/pages/NotFound'

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HomeLayout },
    { path: config.routes.register, component: Register, layout: null },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: null },
    { path: config.routes.resetPassword, component: ResetPassword, layout: null },
    { path: config.routes.verifyEmail, component: VerifyEmail, layout: null },
    { path: config.routes.notFound, component: NotFound, layout: null },
]

const privateRoutes = [
    { path: config.routes.userProgress, component: UserProgressPage, layout: WorkspaceLayout },
    { path: config.routes.upcomingPage, component: UpComingTaskPage, layout: WorkspaceLayout },
    { path: config.routes.recycleBin, component: RecycleBinPage, layout: WorkspaceLayout },
    { path: config.routes.archive, component: ArchivePage, layout: WorkspaceLayout },
    { path: config.routes.workspace, component: WelcomeWorkspace, layout: WorkspaceLayout },
    { path: config.routes.workspaceProject, component: Workspace, layout: WorkspaceLayout },
]

export { publicRoutes, privateRoutes }
