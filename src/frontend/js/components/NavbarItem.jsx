import React from "react";
import { Link } from "react-router-dom"

export default class NavbarItem extends React.Component {
    render() {
        const link = this.props.link
        const title = this.props.title
        const isActive = window.location.pathname === link;

        const isDisabled = this.props.disabled;

        return <li className={isDisabled ? "disabled" : isActive ? "active" : " "}>
            <Link to={link}> {title} </Link>
        </li>
    }
}