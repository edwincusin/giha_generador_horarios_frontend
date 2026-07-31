import { BrowserRouter, Route, Routes } from "react-router-dom"
import Sidebar from "./components/SideBar"
import CoursesAdminPage from "./pages/PageAdministracionMaterias"
import ConfigurationPage from "./pages/PageConfiguracion"

function App() {

  return (

    <BrowserRouter>
      <Sidebar />
      <div className="app-content">
        <Routes>
          <Route path="/materias" element={<CoursesAdminPage></CoursesAdminPage>}></Route>
          <Route path="/configuracion" element={<ConfigurationPage></ConfigurationPage>}></Route>
        </Routes>
      </div>
    </BrowserRouter>


  )
}

export default App
