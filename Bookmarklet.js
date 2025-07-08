(function() {
    const panelId = 'my-template-side-panel';
    if (document.getElementById(panelId)) {
        document.getElementById(panelId).remove();
        return;
    }

    // THAY THẾ URL NÀY BẰNG URL CỦA BẠN
    const appUrl = 'https://tuandnguyen97.github.io/saveScript/';

    // Create the panel container
    const panel = document.createElement('div');
    panel.id = panelId;
    
    // --- NEW STYLES FOR SIDE PANEL ---
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.right = '0'; // Dock to the right side
    panel.style.width = '400px'; // Set a fixed width for the panel
    panel.style.height = '100vh'; // Full page height
    panel.style.backgroundColor = '#f8f9fa'; // Give it a solid background
    panel.style.zIndex = '999999';
    panel.style.boxShadow = '-5px 0 15px rgba(0,0,0,0.15)'; // Add shadow for depth
    panel.style.transition = 'transform 0.3s ease-in-out'; // Smooth transition
    panel.style.transform = 'translateX(100%)'; // Start off-screen

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = appUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    panel.appendChild(iframe);
    document.body.appendChild(panel);

    // --- SLIDE-IN ANIMATION ---
    // Use a tiny delay to ensure the transition effect works
    setTimeout(() => {
        panel.style.transform = 'translateX(0)';
    }, 10);

    // Lắng nghe thông điệp để đóng panel
    window.addEventListener('message', function(event) {
        if (event.data === 'close-template-overlay') { // The message name is still the same
            const el = document.getElementById(panelId);
            if (el) {
                // Animate out
                el.style.transform = 'translateX(100%)';
                // Remove from DOM after animation
                setTimeout(() => { el.remove(); }, 300);
            }
        }
    }, { once: true });

})();