import { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from '~/components/Auth/RequireAuth'
import { publicRoutes, privateRoutes } from '~/routes'
import './App.css'

function App() {
    return (
        <div className="App">
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component

                    let Layout

                    if (route.layout) {
                        Layout = route.layout
                    } else {
                        Layout = Fragment
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    )
                })}

                {privateRoutes.map((route, index) => {
                    const Page = route.component

                    let Layout

                    if (route.layout) {
                        Layout = route.layout
                    } else {
                        Layout = Fragment
                    }

                    return (
                        <Route key={index} element={<RequireAuth />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    )
                })}
            </Routes>
        </div>
    )
}

export default App
