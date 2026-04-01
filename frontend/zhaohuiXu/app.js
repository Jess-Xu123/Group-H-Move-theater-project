fetch('http://localhost:3000/api/movies')
    .then(response => response.json())
    .then(data => console.log("movie data: ", data));



    document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Open MENU
    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    // Close MENU
    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    // User can click open menu
    if(menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    
    if(menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Click elsewhere to close the menu
    menuOverlay.addEventListener('click', closeMenu);
});