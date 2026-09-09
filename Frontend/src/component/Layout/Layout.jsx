import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import '../../css/Dashboard.css'

const Layout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  return (
    <div className="dashbord-layout">
      <aside className='sideBar'>
        <div className='sidebar-brand'>
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="product" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Products
          </NavLink>
        </nav>
        <div className='sidebar-footer'>
          <button onClick={handleLogout} className='logout-btn'>
            Logout
          </button>
        </div>
      </aside>
      <div className='main-content'>
        <main className='outlet-content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
