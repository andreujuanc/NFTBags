import { Nav } from "./nav";
import { Connect } from "./connect";
import './index.css'

export function Layout({ children }: { children: any }) {
    return (
        <div className="App">
            <header>
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <Nav />
                <Connect/>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}