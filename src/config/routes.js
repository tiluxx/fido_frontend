const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgotpassword',
    userProgress: '/workspace/userProgress/:username',
    upcomingPage: '/workspace/upComingTask/:username',
    recycleBin: '/workspace/deletedProjectList/:username',
    archive: '/workspace/archiveProject/:username',
    workspace: '/workspace/:username',
    workspaceProject: '/projects/:slug',
    resetPassword: '/resetpassword/:resetToken',
    verifyEmail: 'user/verify/:userId/:verifyToken',
    notFound: '*',
}

export default routes
