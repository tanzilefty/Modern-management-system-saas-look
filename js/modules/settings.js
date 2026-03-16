const SettingsModule = {
    init() {
        this.loadCurrentSettings();
        this.setupListeners();
    },

    loadCurrentSettings() {
        const session = Auth.checkSession();
        if (session) {
            document.getElementById('setUserName').value = session.name;
            document.getElementById('setUserEmail').value = session.email;
            document.getElementById('profileDisplay').innerText = session.name.charAt(0);
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.getElementById('darkModeToggle').checked = isDark;
    },

    setupListeners() {
        // Profile Form
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('setUserName').value;
            const email = document.getElementById('setUserEmail').value;
            
            // Update Session
            const session = JSON.parse(localStorage.getItem('sims_session'));
            session.name = name;
            session.email = email;
            localStorage.setItem('sims_session', JSON.stringify(session));
            
            // Update UI
            document.getElementById('displayUserName').innerText = name;
            document.getElementById('profileDisplay').innerText = name.charAt(0);
            
            UI.showToast("Profile updated successfully!");
            Storage.addLog("User updated profile settings");
        });

        // Theme Toggle in Settings
        document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            UI.showToast(`Switched to ${theme} mode`);
        });

        // Avatar Preview Simulation
        document.getElementById('avatarInput')?.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                UI.showToast("Avatar uploaded (Simulation)");
            }
        });
    }
};