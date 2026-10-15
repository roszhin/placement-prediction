document.addEventListener("DOMContentLoaded", () => {
    const transitionStorageKey = "premiumLoaderPendingNavigation";
    let isIncomingTransition = false;
    try {
        isIncomingTransition = sessionStorage.getItem(transitionStorageKey) === "true";
        if (isIncomingTransition) sessionStorage.removeItem(transitionStorageKey);
    } catch (error) {
        console.warn("Could not restore the page transition loader", error);
    }

    // Ensure Global Dialog & Toast system is loaded
    if (!window.AppDialog && !document.querySelector('script[src*="app-dialog.js"]')) {
        const s = document.createElement('script');
        s.src = '/js/app-dialog.js';
        document.head.appendChild(s);
    }

    // Inject the center loader HTML safely
    if (!document.getElementById("global-loader")) {
        const loaderHTML = `
        <div id="global-loader" class="hidden">
            <div class="loader-card">
                
                <div class="runner-track-area">
                    <img src="/images/runner.gif" class="runner-gif" id="runnerGif" alt="Loading Runner">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" id="loaderProgressBar"></div>
                    </div>
                </div>

                <div class="loader-text-wrapper" id="loaderTextWrapper">
                    <div class="loader-text active">Analyzing Resume...</div>
                    <div class="loader-text">Reading Profile...</div>
                    <div class="loader-text">Comparing Skills...</div>
                    <div class="loader-text">Evaluating Eligibility...</div>
                    <div class="loader-text">Generating AI Report...</div>
                    <div class="loader-text">Preparing Dashboard...</div>
                    <div class="loader-text">Finding Best Match...</div>
                </div>
                
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    }

    const loader = document.getElementById("global-loader");
    const runnerGif = document.getElementById("runnerGif");
    const progressBar = document.getElementById("loaderProgressBar");
    let textNodes = document.querySelectorAll("#loaderTextWrapper .loader-text");
    
    let currentTextIndex = 0;
    let progress = 0;
    
    // Rotate text messages every 2 seconds
    let textInterval = null;
    let progressInterval = null;
    let isCompleting = false;

    function startLoaderSystem(customTexts) {
        if (!loader) return;
        
        if (customTexts && customTexts.length > 0) {
            const wrapper = document.getElementById("loaderTextWrapper");
            if (wrapper) {
                wrapper.innerHTML = customTexts.map((text, index) => 
                    `<div class="loader-text ${index === 0 ? 'active' : ''}">${text}</div>`
                ).join('');
                textNodes = document.querySelectorAll("#loaderTextWrapper .loader-text");
            }
        }
        
        isCompleting = false;
        progress = 0;
        currentTextIndex = 0;
        if(progressBar) progressBar.style.width = "0%";
        if(runnerGif) runnerGif.style.left = "0%";
        
        loader.classList.remove("hidden");

        // Start text rotation
        if (textInterval) clearInterval(textInterval);
        textInterval = setInterval(() => {
            if (!textNodes || textNodes.length === 0) return;
            textNodes[currentTextIndex].classList.remove('active');
            currentTextIndex = (currentTextIndex + 1) % textNodes.length;
            textNodes[currentTextIndex].classList.add('active');
        }, 1500);

        // Simulate progress synchronization (up to 90% while waiting for server)
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (isCompleting) return;
            
            progress += Math.random() * 3 + 1; // Increment by 1-4%
            
            if (progress > 90) {
                progress = 90; // Hold at 90% until server responds
            }

            if (progressBar) progressBar.style.width = `${progress}%`;
            if (runnerGif) runnerGif.style.left = `${progress}%`;
        }, 100);
    }

    window.hidePremiumLoader = function() {
        if (loader) {
            clearInterval(progressInterval);
            clearInterval(textInterval);
            loader.classList.add("hidden");
        }
    };

    window.showPremiumLoader = function(customTexts) {
        startLoaderSystem(customTexts);
    };

    if (isIncomingTransition) {
        window.showPremiumLoader(["Loading your page...", "Preparing your account...", "Almost ready..."]);
        window.addEventListener("load", () => window.completePremiumLoader(), { once: true });
    }
    
    // Graceful 100% completion
    window.completePremiumLoader = function(callback) {
        if (!loader) {
            if (callback) callback();
            return;
        }
        
        isCompleting = true;
        progress = 100;
        if (progressBar) progressBar.style.width = "100%";
        if (runnerGif) runnerGif.style.left = "100%";
        
        clearInterval(progressInterval);
        clearInterval(textInterval);
        
        // Wait for the 100% animation to visually finish (approx 400ms)
        setTimeout(() => {
            loader.classList.add("hidden");
            
            // Wait for fade out transition to finish (approx 300ms)
            setTimeout(() => {
                if (callback) callback();
            }, 300);
        }, 400);
    };

    // Keep the loader visible during native auth form navigation.
    document.addEventListener("submit", function(e) {
        const form = e.target;
        
        let actionStr = "";
        const actionAttr = form.getAttribute('action');
        if (actionAttr) {
            actionStr = actionAttr.toLowerCase();
        } else {
            actionStr = window.location.pathname.toLowerCase();
        }
        
        // Check if it's an auth-related form
        const isAuthAction = actionStr.includes('login') || actionStr.includes('register') || actionStr.includes('logout');

        if (isAuthAction) {
            let loaderTexts = null;
            if (actionStr.includes('login')) {
                loaderTexts = ["Authenticating User...", "Verifying Credentials...", "Preparing Dashboard..."];
            } else if (actionStr.includes('logout')) {
                loaderTexts = ["Logging out...", "Clearing Session...", "See you soon!"];
            } else if (actionStr.includes('register')) {
                loaderTexts = ["Creating Account...", "Securing Profile...", "Setting up Workspace..."];
            }
            window.showPremiumLoader(loaderTexts);
            try {
                sessionStorage.setItem(transitionStorageKey, "true");
            } catch (error) {
                console.warn("Could not persist the page transition loader", error);
            }
        }
    });
});
