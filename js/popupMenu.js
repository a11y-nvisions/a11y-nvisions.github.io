/**
* Initializes a popup menu with keyboard navigation support.
* This function sets up arrow key navigation within the menu,
* blocks the default behavior of Tab and Shift+Tab to keep focus within the menu,
* and ensures proper role and tabindex attributes for menu items.
*
* @param {HTMLElement} menuElement - The DOM element representing the menu.
* This element should be a container that includes menu items.
* The function will automatically assign 'role="menu"' to this element
* if not already set, and will look for or assign 'role="menuitem"'
* to its child elements (links or buttons).
*/
function popupMenu(menuElement) {
// Ensure the menuElement is valid
if (!menuElement) return;

// Set role="menu" if not already set
if (!menuElement.getAttribute('role') || menuElement.getAttribute('role') !== 'menu') {
menuElement.setAttribute('role', 'menu');
}

// Get all menu items
let menuItems = menuElement.querySelectorAll('[role="menuitem"]');

// If no menu items are found, find all <a href> and <button> elements and set them as menu items
        if (menuItems.length === 0) {
        const anchorsAndButtons = menuElement.querySelectorAll('a[href], button');
        anchorsAndButtons.forEach(element => {
        element.setAttribute('role', 'menuitem');
        });
        menuItems = anchorsAndButtons;
        }

        // Set tabindex="-1" for all menu items except the first
        menuItems.forEach((item, index) => {
        if (index > 0) {
        item.setAttribute('tabindex', '-1');
        }
        });

        // Check if the current focus is not inside the menu, focus the first menu item
        const activeElement = document.activeElement;
        if (!menuElement.contains(activeElement) && menuItems.length > 0) {
        menuItems[0].focus();
        }

        // Function to handle keydown events
        function handleKeyDown(event) {
        const focusedElement = document.activeElement;
        const currentIndex = Array.prototype.indexOf.call(menuItems, focusedElement);

        // Check if the focused element is a menu item
        if (currentIndex === -1) return;

        switch (event.key) {
        case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
        break;
        case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex].focus();
        break;
        case 'Tab':
        // Block Tab and Shift+Tab behavior
        event.preventDefault();
        break;
        }
        }

        // Add event listener for keydown
        menuElement.addEventListener('keydown', handleKeyDown);

        // Optional: Remove event listener when menu is closed
        // menuElement.addEventListener('close', () => {
        // menuElement.removeEventListener('keydown', handleKeyDown);
        // });
        }

        // Usage example
        // popupMenu(document.querySelector('.your-menu-selector'));