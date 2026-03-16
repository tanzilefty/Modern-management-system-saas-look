const Auth = {
    checkSession() {
        const session = localStorage.getItem('sims_session');
        if (!session && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
        return JSON.parse(session);
    },

    logout() {
        localStorage.removeItem('sims_session');
        window.location.href = 'login.html';
    }
};

// Auto-run session check
Auth.checkSession();

document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
});