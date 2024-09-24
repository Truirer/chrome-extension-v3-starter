const readUrl = () => {
    // Save references to the original methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Override pushState
    history.pushState = function (state, title, url) {
        // Call the original pushState method
        originalPushState.apply(this, arguments);
        // Dispatch a custom event
        window.dispatchEvent(new Event('urlchange'));
    };

    // Override replaceState
    history.replaceState = function (state, title, url) {
        // Call the original replaceState method
        originalReplaceState.apply(this, arguments);
        // Dispatch a custom event
        window.dispatchEvent(new Event('urlchange'));
    };

    // Listen for both popstate and our custom urlchange event
    window.addEventListener('popstate', () => {
        console.log('URL changed (popstate)');
        // Handle the URL change
    });

    window.addEventListener('urlchange', () => {
        let currentParams = new URLSearchParams(window.location.search)
        const arr = Array.from(currentParams)
        navigator.clipboard.writeText(JSON.stringify(arr));
        document.querySelector("p").innerText = JSON.stringify(arr)
        // Handle the URL change
    });

    // Use a MutationObserver to detect changes to the URL
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                console.log('URL changed (MutationObserver)');
                // Handle the URL change
                window.dispatchEvent(new Event('urlchange'));
            }
        }
    });

    // Start observing changes to the location object
    observer.observe(document.querySelector('html'), {
        attributes: true,
        subtree: true,
        attributeFilter: ['href']
    });

    // Fallback: Polling (optional, if needed)
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('URL changed (polling)');
            // Handle the URL change
            window.dispatchEvent(new Event('urlchange'));
        }
    }, 100); // Adjust the interval as needed
}
(function () {
    if (document.readyState !== 'loading') {
        readUrl()
    } else {
        document.addEventListener('DOMContentLoaded', (event) => {
            readUrl()
        });
    }


})()

