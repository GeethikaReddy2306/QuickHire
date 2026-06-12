import {Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div>
      <h1>Quick<span>Hire</span></h1>
      <ul>
        <li><Link>Home</Link></li>
        <li><Link>Jobs</Link></li>
        <li><Link>Browse</Link></li>
      </ul>

    </div>
  )
}
