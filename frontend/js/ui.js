export function initUI() {

    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    const openBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('menuClose');

    if (!menu || !overlay || !openBtn || !closeBtn) return;

    // open
    openBtn.addEventListener('click', () => {
        menu.classList.add('active');
        overlay.classList.add('active');
    });

    // close button
    closeBtn.addEventListener('click', () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // click overlay
    overlay.addEventListener('click', () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    });
}