import { Outlet } from "react-router-dom"
import { SidebarNavigationSection } from "../Components/Global/Sidebar/Sidebar"

const Main = () => {
      return (
            <div
                  className="bg-bgPrimary min-h-screen flex py-5"
            >
                  <div
                        className="w-80 border-r border-gray-200 border-borderPrimary"
                  >
                        <SidebarNavigationSection />
                  </div>
                  <div className="flex-1 p-6">
                        <Outlet />
                  </div>
            </div >
      )
}

export default Main