import React from 'react'

export const PageFooter = () => {
    let an = new Date().getFullYear()
    return (
    <footer className="footer" data-background-color="black">
        <div className=" container ">
            <nav>
            <ul>
                <li>
                <a href="http://www.ssorion.ro" target="_blank">
                    Societatea Stiintifica Orion
                </a>
                </li>
            </ul>
            </nav>
            <div className="copyright" id="copyright">
            &copy;
            {an} River Wolves
            </div>
        </div>
    </footer>
    )
}

export default PageFooter