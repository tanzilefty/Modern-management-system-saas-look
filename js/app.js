document.addEventListener('DOMContentLoaded', () => {
    const user = Auth.checkSession();
    if (user) {
        document.getElementById('displayUserName').innerText = user.name;
    }

    // Theme Toggle Logic
    const themeBtn = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeBtn?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Navigation Logic (SPA Simulation)
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            // Update Active UI
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // In a real modular app, we'd fetch the HTML or use a template
            console.log(`Loading page: ${page}`);
            // StudentModule.init() will be called here in Step 7
        });
    });
});