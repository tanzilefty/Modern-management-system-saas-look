const UI = {
    /**
     * Shows a modern toast notification
     * @param {string} message - The text to display
     * @param {string} type - 'success', 'danger', or 'warning'
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} slide-in`;
        
        // Icon mapping
        const icons = { success: '✅', danger: '❌', warning: '⚠️' };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Remove after animation
        setTimeout(() => {
            toast.classList.replace('slide-in', 'slide-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    /**
     * Formats currency or numbers to locale strings
     */
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    },

    /**
     * Formats ISO dates to readable strings
     */
    formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }
};

const Helpers = {
    /**
     * Generates a unique ID
     */
    generateId: () => Math.random().toString(36).substr(2, 9),

    /**
     * Exports data to JSON file
     */
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};