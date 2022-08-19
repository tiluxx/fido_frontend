import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import { CSRFTokenProvider } from '~/context/CSRFTokenContext'
import GlobalStyles from '~/components/GlobalStyles'

ReactDOM.render(
    <React.StrictMode>
        <CSRFTokenProvider>
            <GlobalStyles>
                <Router>
                    <App />
                </Router>
            </GlobalStyles>
        </CSRFTokenProvider>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
