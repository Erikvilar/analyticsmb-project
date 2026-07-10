import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./AppLayout.css";


type NavItem = {
    to: string;
    label: string;
    icon: string;
    end?: boolean;
    disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
    { to: "/", label: "Dashboard", icon: "dashboard", end: true },
    { to: "/memory", label: "Memory", icon: "memory" },
    { to: "/debug", label: "Device Debug", icon: "bug_report", disabled: true },
    { to: "/jank", label: "UI/Jank", icon: "speed", disabled: true },
];

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();



 

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);


    
    const activeItem = NAV_ITEMS.find((item) =>
        item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );

    return (
        <div className="app-layout">
            {/* Skip link — acessibilidade via teclado */}
            <a href="#main-content" className="skip-link">
                Pular para o conteúdo
            </a>

            {/* Overlay mobile — fecha o menu ao clicar fora */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="sidebar-logo">
                            <span className="material-symbols-outlined">monitoring</span>
                        </div>
                        <div>
                            <h1 className="sidebar-title">Analytics MB</h1>
                            <p className="sidebar-version">v2.4.0</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-close-btn"
                        aria-label="Fechar menu"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="sidebar-nav" aria-label="Navegação principal">
                    <ul className="nav-list">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                {item.disabled ? (
                                    <span className="nav-link nav-link--disabled" aria-disabled="true" title="Em breve">
                    <span className="material-symbols-outlined">{item.icon}</span>
                                        {item.label}
                  </span>
                                ) : (
                                    <NavLink
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "nav-link--active" : ""}`
                                        }
                                    >
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <ul className="nav-list">
                        <li>
                            <a href="#" className="nav-link">
                                <span className="material-symbols-outlined">settings</span>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link">
                                <span className="material-symbols-outlined">help</span>
                                Support
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Área principal */}
            <div className="main-wrapper">
                {/* Top bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="mobile-menu-btn"
                            aria-label="Abrir menu"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        {/* Breadcrumb — dá contexto imediato de onde o usuário está */}
                        <nav aria-label="breadcrumb" className="breadcrumb-nav">
                            <ol className="breadcrumb">
                                <li>Analytics MB</li>
                                <li aria-hidden="true">/</li>
                                <li className="breadcrumb-current">
                                    {activeItem?.label ?? "Página não encontrada"}
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="topbar-right">
                        <button type="button" className="time-range-btn">
                            <span className="material-symbols-outlined">schedule</span>
                            Last 15 minutes
                        </button>
                        <button type="button" aria-label="Atualizar" className="icon-btn">
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </div>
                </header>

                {/* Conteúdo da rota ativa */}
                <main id="main-content" tabIndex={-1} className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;