document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const sizeSelect = document.getElementById('size');
    const sizeChartBtn = document.getElementById('sizeChartBtn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const compareColorsBtn = document.getElementById('compareColorsBtn');
    const compareColorsModal = document.getElementById('compareColorsModal');
    const compareColorsOverlay = document.getElementById('compareColorsOverlay');
    const compareColorsClose = document.getElementById('compareColorsClose');
    const sizeChartModal = document.getElementById('sizeChartModal');
    const sizeChartClose = document.getElementById('sizeChartClose');
    const sizeChartOverlay = document.getElementById('sizeChartOverlay');
    const addToCartBtn = document.getElementById('addToCart');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const pairCards = document.querySelectorAll('.pair-well-with .product-card button');
    const bundleAddBtn = document.querySelector('.bundle-item button');
    const relatedCards = document.querySelectorAll('.related-card');
    const mainImageContainer = document.querySelector('.main-image');

    // Image data for variants (simulate)
    const colorImages = {
        red: 'https://via.placeholder.com/400/ff4d4d/fff?text=Red+Product',
        blue: 'https://via.placeholder.com/400/3869e8/fff?text=Blue+Product',
        green: 'https://via.placeholder.com/400/00a846/fff?text=Green+Product'
    };

    // Thumbnail images (for each color this example uses same thumbnails)
    const thumbnailsByColor = {
        red: [
            'https://via.placeholder.com/100/ff4d4d/fff?text=Red1',
            'https://via.placeholder.com/100/ff6666/fff?text=Red2',
            'https://via.placeholder.com/100/ff8080/fff?text=Red3',
            'https://via.placeholder.com/100/ff9999/fff?text=Red4',
            'https://via.placeholder.com/100/ffb3b3/fff?text=Red5',
        ],
        blue: [
            'https://via.placeholder.com/100/3869e8/fff?text=Blue1',
            'https://via.placeholder.com/100/517ef8/fff?text=Blue2',
            'https://via.placeholder.com/100/6a93f8/fff?text=Blue3',
            'https://via.placeholder.com/100/82a7f8/fff?text=Blue4',
            'https://via.placeholder.com/100/9cbaf8/fff?text=Blue5',
        ],
        green: [
            'https://via.placeholder.com/100/00a846/fff?text=Green1',
            'https://via.placeholder.com/100/33b564/fff?text=Green2',
            'https://via.placeholder.com/100/66c682/fff?text=Green3',
            'https://via.placeholder.com/100/99d6a1/fff?text=Green4',
            'https://via.placeholder.com/100/cce7c4/fff?text=Green5',
        ]
    };

    // LocalStorage keys
    const STORAGE_KEYS = {
        selectedColor: 'selectedColor',
        selectedSize: 'selectedSize'
    };

    // Initialize main image and thumbnails from localStorage or defaults
    let selectedColor = localStorage.getItem(STORAGE_KEYS.selectedColor) || 'red';
    let selectedSize = localStorage.getItem(STORAGE_KEYS.selectedSize) || 'S';

    // === Utility Functions ===

    // Update main image src and highlight selected thumbnail
    function updateMainImageFromThumbnails(src) {
        mainImage.src = src;
        thumbnails.forEach(tn => {
            tn.classList.toggle('selected', tn.src === src);
        });
    }

    // Update thumbnails for selected color
    function updateThumbnailsForColor(color) {
        const thumbs = thumbnailsByColor[color];
        // Update all thumbnails src
        thumbnails.forEach((tn, i) => {
            if (thumbs[i]) {
                tn.src = thumbs[i];
                tn.classList.remove('selected'); // reset selection
            }
        });
        updateMainImageFromThumbnails(thumbs[0]);
    }

    // Select color function
    function selectColor(color) {
        selectedColor = color;
        // Persist selection
        localStorage.setItem(STORAGE_KEYS.selectedColor, color);
        // Update swatches highlight
        colorSwatches.forEach(swatch => {
            // Convert swatch color to rgb string for comparison
            const swatchColor = window.getComputedStyle(swatch).backgroundColor;
            const testColor = colorToRGB(color);
            swatch.classList.toggle('selected', swatchColor === testColor);
            swatch.setAttribute('aria-checked', swatch.classList.contains('selected'));
            swatch.tabIndex = swatch.classList.contains('selected') ? 0 : -1;
        });
        // Update main image and thumbnails
        updateThumbnailsForColor(color);
    }

    // Helper to convert color names to rgb strings
    function colorToRGB(color) {
        // Create a dummy div with background color to get rgb string
        const dummy = document.createElement('div');
        dummy.style.display = 'none';
        dummy.style.color = color;
        document.body.appendChild(dummy);
        const cs = getComputedStyle(dummy);
        const val = cs.color;
        document.body.removeChild(dummy);
        return val;
    }

    // Select size function
    function selectSize(size) {
        selectedSize = size;
        localStorage.setItem(STORAGE_KEYS.selectedSize, size);
        // No special UI update needed, select reflects size
    }

    // === Updated Tab toggle function ===
    function toggleTab(event, tabName) {
        const clickedTab = event.target;
        const tabIndex = Array.from(tabs).indexOf(clickedTab);
        const isActive = clickedTab.classList.contains('active');

        if (isActive) {
            // Hide this tab content and deactivate tab
            clickedTab.classList.remove('active');
            clickedTab.setAttribute('aria-selected', 'false');
            clickedTab.tabIndex = -1;

            if (tabContents[tabIndex]) {
                tabContents[tabIndex].classList.remove('active');
                tabContents[tabIndex].setAttribute('hidden', '');
            }
        } else {
            // Hide all tabs and contents first
            tabs.forEach((tab, i) => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.tabIndex = -1;
                if (tabContents[i]) {
                    tabContents[i].classList.remove('active');
                    tabContents[i].setAttribute('hidden', '');
                }
            });

            // Show clicked tab content and activate tab
            clickedTab.classList.add('active');
            clickedTab.setAttribute('aria-selected', 'true');
            clickedTab.tabIndex = 0;
            if (tabContents[tabIndex]) {
                tabContents[tabIndex].classList.add('active');
                tabContents[tabIndex].removeAttribute('hidden');
            }
        }
    }

    // Modal open and close helpers
    function openModal(modal, overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'false');
        // Trap focus or set focus to modal close btn
        let closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal, overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-hidden', 'true');
    }

    // === Event Listeners ===

    // 1. Scrollable Product Images Gallery: Clicking thumbnail updates main image
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', e => {
            updateMainImageFromThumbnails(e.target.src);
        });
        // Keyboard accessibility: select by Enter or Space
        thumb.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                thumb.click();
            }
        });
    });

    // 2. Size Chart modal open/close
    sizeChartBtn.addEventListener('click', () => {
        openModal(sizeChartModal, sizeChartOverlay);
        sizeChartBtn.setAttribute('aria-expanded', 'true');
    });

    function sizeChartCloseHandler() {
        closeModal(sizeChartModal, sizeChartOverlay);
        sizeChartBtn.setAttribute('aria-expanded', 'false');
        sizeChartBtn.focus();
    }

    sizeChartClose.addEventListener('click', sizeChartCloseHandler);
    sizeChartOverlay.addEventListener('click', e => {
        if (e.target === sizeChartOverlay) sizeChartCloseHandler();
    });

    // 3. Variant selection: color swatches and size dropdown
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const bgColor = window.getComputedStyle(swatch).backgroundColor;
            selectColor(bgColor);
        });
        // Keyboard accessibility
        swatch.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swatch.click();
            }
        });
    });

    sizeSelect.addEventListener('change', () => {
        selectSize(sizeSelect.value);
    });

    // Initialize size select with localStorage
    sizeSelect.value = selectedSize;

    // 4. Compare Colors modal and multi-selection
    compareColorsBtn.addEventListener('click', () => {
        openModal(compareColorsModal, compareColorsOverlay);
        compareColorsBtn.setAttribute('aria-expanded', 'true');
    });

    function compareColorsCloseHandler() {
        closeModal(compareColorsModal, compareColorsOverlay);
        compareColorsBtn.setAttribute('aria-expanded', 'false');
        compareColorsBtn.focus();
        // Clear selected states in modal
        compareColorsModal.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
            swatch.setAttribute('aria-pressed', 'false');
        });
    }

    compareColorsClose.addEventListener('click', compareColorsCloseHandler);
    compareColorsOverlay.addEventListener('click', e => {
        if (e.target === compareColorsOverlay) compareColorsCloseHandler();
    });

    // Allow selecting multiple colors in compare modal
    compareColorsModal.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const selected = swatch.classList.toggle('selected');
            swatch.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        // Keyboard accessibility
        swatch.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swatch.click();
            }
        });
    });

    // 5. Pair Well With - Add to cart buttons (dummy action)
    pairCards.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Added to cart!');
        });
    });

    // 6. Product Bundle Suggestion - Add bundle to cart (dummy action)
    bundleAddBtn.addEventListener('click', () => {
        alert('Bundle added to cart!');
    });

    // 7. Tabs for product info with updated toggle behavior
    tabs.forEach(tab => {
        tab.addEventListener('click', e => {
            toggleTab(e, tab.dataset.tab);
        });

        tab.addEventListener('keydown', e => {
            let index = Array.from(tabs).indexOf(e.target);
            if (e.key === 'ArrowRight') {
                tabs[(index + 1) % tabs.length].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                tabs[(index - 1 + tabs.length) % tabs.length].focus();
                e.preventDefault();
            } else if (e.key === 'Enter' || e.key === ' ') {
                toggleTab(e, e.target.dataset.tab);
                e.preventDefault();
            }
        });
    });

    // 8. Related Products cards (dummy click)
    relatedCards.forEach(card => {
        card.addEventListener('click', () => {
            alert('Go to related product page');
        });
    });

    // Initialize page state
    selectColor(selectedColor);
});
