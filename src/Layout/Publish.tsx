import { Outlet } from "react-router-dom"
import Navbar from "../Components/Global/Navbar/Navbar"

const Publish = () => {
      return (
            <div
                  className="bg-bgPrimary min-h-screen red-hat-display"
            >
                  <Navbar />
                  <div
                        className=""
                  >
                        <Outlet />
                  </div>
            </div>
      )
}

export default Publish