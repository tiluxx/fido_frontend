import Avatar from '@mui/material/Avatar'
import { StyledEngineProvider } from '@mui/material/styles'
import './GlobalCssAvatar.css'

function stringAvatar(username) {
    if (!username.includes(' ')) {
        return {
            children: `${username.charAt(0)}`,
        }
    }
    return {
        children: `${username.split(' ')[0][0]}${username.split(' ')[1][0]}`,
    }
}

function BackgroundLetterAvatars({ username }) {
    return (
        <StyledEngineProvider injectFirst>
            <Avatar {...stringAvatar(username)} sx={{ width: 20, height: 20 }} />
        </StyledEngineProvider>
    )
}

export default BackgroundLetterAvatars
