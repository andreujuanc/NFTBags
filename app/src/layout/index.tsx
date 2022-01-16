import { Nav } from "./nav";
import logo from '../logo.svg'
import { Connect } from "./connect";
import './index.css'

export function Layout({ children }: { children: any }) {
    return (
        <div className="App">
            <header>
                <img src={logo} className="App-logo" alt="logo" />
                NFTBags
                <Nav />
                <Connect/>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}