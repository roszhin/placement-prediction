/**
 * ============================================================================
 * GLOBAL CONFIRMATION DIALOG & TOAST SYSTEM
 * Roshin AI - Enterprise SaaS UI/UX Architecture
 * ============================================================================
 * Features:
 * - 100% replacement for native window.alert(), window.confirm(), window.prompt()
 * - Accessible (ARIA, ESC key, focus trapping, focus restoration)
 * - Brand-aligned animations (200-300ms cubic-bezier transitions)
 * - Dynamic Action Types: Danger (Red), Warning (Amber), Success (Green), Primary (Orange)
 * - Declarative HTML integration: data-confirm="..."
 * - Automatic conversion of Spring Boot flash message alerts to interactive toasts
 */

(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. DOM CONTAINER INITIALIZATION
    // ------------------------------------------------------------------------
    let dialogOverlay = null;
    let toastContainer = null;
    let lastFocusedElement = null;

    function ensureDialogDOM() {
        if (dialogOverlay) return;

        dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'app-dialog-overlay';
        dialogOverlay.className = 'app-dialog-overlay';
        dialogOverlay.setAttribute('role', 'dialog');
        dialogOverlay.setAttribute('aria-modal', 'true');
        dialogOverlay.setAttribute('aria-labelledby', 'app-dialog-title');

        dialogOverlay.innerHTML = `
            <div class="app-dialog-card" id="app-dialog-card" tabindex="-1">
                <div class="app-dialog-icon-wrapper" id="app-dialog-icon"></div>
                <h3 class="app-dialog-title" id="app-dialog-title"></h3>
                <p class="app-dialog-message" id="app-dialog-message"></p>
                <div class="app-dialog-details" id="app-dialog-details"></div>
                <div id="app-dialog-input-container"></div>
                <div class="app-dialog-actions" id="app-dialog-actions"></div>
            </div>
        `;

        document.body.appendChild(dialogOverlay);
    }

    function ensureToastDOM() {
        if (toastContainer) return;

        toastContainer = document.createElement('div');
        toastContainer.id = 'app-toast-container';
        document.body.appendChild(toastContainer);
    }

    // ------------------------------------------------------------------------
    // 2. TOAST NOTIFICATION SERVICE (AppToast)
    // ------------------------------------------------------------------------
    const AppToast = {
        show: function (options) {
            ensureToastDOM();

            const config = typeof options === 'string' ? { message: options } : (options || {});
            const message = config.message || '';
            const type = config.type || 'info'; // 'success', 'error', 'warning', 'info'
            const title = config.title || '';
            const duration = config.duration !== undefined ? config.duration : 4000;

            const iconMap = {
                success: '<i class="fa-solid fa-circle-check"></i>',
                error: '<i class="fa-solid fa-circle-xmark"></i>',
                warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
                info: '<i class="fa-solid fa-circle-info"></i>'
            };

            const toast = document.createElement('div');
            toast.className = `app-toast app-toast-${type}`;
            toast.innerHTML = `
                <div class="app-toast-icon">${iconMap[type] || iconMap.info}</div>
                <div class="app-toast-body">
                    <div class="app-toast-title">${title}</div>
                    <p class="app-toast-message">${message}</p>
                </div>
                <button type="button" class="app-toast-close" aria-label="Close notification">&times;</button>
                <div class="app-toast-progress"></div>
            `;

            toastContainer.appendChild(toast);

            const progressBar = toast.querySelector('.app-toast-progress');
            const closeBtn = toast.querySelector('.app-toast-close');

            let remainingTime = duration;
            let startTime = Date.now();
            let timerId = null;

            function dismiss() {
                if (toast.classList.contains('app-toast-dismissing')) return;
                toast.classList.add('app-toast-dismissing');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 250);
            }

            closeBtn.addEventListener('click', () => {
                clearTimeout(timerId);
                dismiss();
            });

            function startTimer() {
                if (duration <= 0) return;
                startTime = Date.now();
                progressBar.style.transition = `transform ${remainingTime}ms linear`;
                progressBar.style.transform = 'scaleX(0)';

                timerId = setTimeout(dismiss, remainingTime);
            }

            function pauseTimer() {
                if (duration <= 0) return;
                clearTimeout(timerId);
                const elapsed = Date.now() - startTime;
                remainingTime = Math.max(0, remainingTime - elapsed);
                const computedScale = remainingTime / duration;
                progressBar.style.transition = 'none';
                progressBar.style.transform = `scaleX(${computedScale})`;
            }

            toast.addEventListener('mouseenter', pauseTimer);
            toast.addEventListener('mouseleave', startTimer);

            // Initial animation start
            requestAnimationFrame(() => {
                startTimer();
            });

            return toast;
        },

        success: function (message, title, duration) {
            return this.show({ message, type: 'success', title, duration });
        },

        error: function (message, title, duration) {
            return this.show({ message, type: 'error', title, duration });
        },

        warning: function (message, title, duration) {
            return this.show({ message, type: 'warning', title, duration });
        },

        info: function (message, title, duration) {
            return this.show({ message, type: 'info', title, duration });
        }
    };

    // ------------------------------------------------------------------------
    // 3. CONFIRMATION MODAL SERVICE (AppDialog)
    // ------------------------------------------------------------------------
    let currentDialogResolve = null;

    const AppDialog = {
        /**
         * Open an asynchronous confirmation dialog.
         * @param {Object} options
         * @returns {Promise<boolean>}
         */
        confirm: function (options) {
            return new Promise((resolve) => {
                ensureDialogDOM();
                lastFocusedElement = document.activeElement;

                const config = options || {};
                const type = config.type || 'danger'; // danger, warning, info, success, primary
                const title = config.title || 'Are you sure?';
                const message = config.message || 'Do you want to proceed with this action?';
                const details = config.details || (type === 'danger' ? 'This action cannot be undone.' : '');
                const confirmText = config.confirmText || (type === 'danger' ? 'Delete' : 'Confirm');
                const cancelText = config.cancelText || 'Cancel';
                const closeOnBackdrop = config.closeOnBackdrop !== undefined ? config.closeOnBackdrop : (type !== 'danger');

                // Set container class for styling colors
                dialogOverlay.className = `app-dialog-overlay app-dialog-${type}`;

                // Set Icon
                const iconEl = document.getElementById('app-dialog-icon');
                if (config.icon) {
                    if (typeof config.icon === 'string' && config.icon.startsWith('<')) {
                        iconEl.innerHTML = config.icon;
                    } else {
                        iconEl.innerHTML = `<i class="fa-solid fa-${config.icon}"></i>`;
                    }
                } else if (type === 'danger') {
                    iconEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                } else if (type === 'warning') {
                    iconEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                } else if (type === 'success') {
                    iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                } else {
                    iconEl.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
                }

                // Set Texts
                document.getElementById('app-dialog-title').textContent = title;
                document.getElementById('app-dialog-message').innerHTML = message;
                
                const detailsEl = document.getElementById('app-dialog-details');
                detailsEl.textContent = details;
                detailsEl.style.display = details ? 'block' : 'none';

                // Clear prompt input
                document.getElementById('app-dialog-input-container').innerHTML = '';

                // Buttons
                const actionsEl = document.getElementById('app-dialog-actions');
                actionsEl.innerHTML = `
                    <button type="button" class="app-dialog-btn app-dialog-btn-cancel" id="app-dialog-btn-cancel">${cancelText}</button>
                    <button type="button" class="app-dialog-btn app-dialog-btn-${type}" id="app-dialog-btn-confirm">${confirmText}</button>
                `;

                const cancelBtn = document.getElementById('app-dialog-btn-cancel');
                const confirmBtn = document.getElementById('app-dialog-btn-confirm');

                function cleanup(confirmedValue) {
                    document.removeEventListener('keydown', handleKeydown);
                    dialogOverlay.removeEventListener('click', handleBackdropClick);

                    dialogOverlay.classList.remove('app-dialog-visible');
                    document.body.classList.remove('app-dialog-open');

                    setTimeout(() => {
                        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                            lastFocusedElement.focus();
                        }
                    }, 200);

                    if (currentDialogResolve) {
                        currentDialogResolve(confirmedValue);
                        currentDialogResolve = null;
                    }
                }

                cancelBtn.onclick = () => cleanup(false);
                confirmBtn.onclick = () => cleanup(true);

                function handleBackdropClick(e) {
                    if (e.target === dialogOverlay) {
                        if (closeOnBackdrop) {
                            cleanup(false);
                        } else {
                            // Gentle alert shake on backdrop click for dangerous actions
                            const card = document.getElementById('app-dialog-card');
                            card.style.transform = 'translateY(0) scale(1.02)';
                            setTimeout(() => { card.style.transform = 'translateY(0) scale(1)'; }, 100);
                        }
                    }
                }
                dialogOverlay.addEventListener('click', handleBackdropClick);

                function handleKeydown(e) {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        cleanup(false);
                    } else if (e.key === 'Enter') {
                        if (document.activeElement === cancelBtn) {
                            cleanup(false);
                        } else {
                            e.preventDefault();
                            cleanup(true);
                        }
                    } else if (e.key === 'Tab') {
                        // Trap focus between Cancel and Confirm
                        const focusable = [cancelBtn, confirmBtn];
                        const first = focusable[0];
                        const last = focusable[focusable.length - 1];

                        if (e.shiftKey && document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        } else if (!e.shiftKey && document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
                document.addEventListener('keydown', handleKeydown);

                currentDialogResolve = resolve;

                // Show modal
                document.body.classList.add('app-dialog-open');
                dialogOverlay.classList.add('app-dialog-visible');

                // For destructive actions, focus Cancel by default to prevent accidental Enter-deletions
                requestAnimationFrame(() => {
                    if (type === 'danger') {
                        cancelBtn.focus();
                    } else {
                        confirmBtn.focus();
                    }
                });
            });
        },

        /**
         * Open an unsaved changes confirmation dialog with Save, Leave, and Stay options.
         * @param {Object} options
         * @returns {Promise<'save'|'leave'|'stay'>}
         */
        unsavedChanges: function (options) {
            return new Promise((resolve) => {
                ensureDialogDOM();
                lastFocusedElement = document.activeElement;

                const config = options || {};
                const title = config.title || 'Unsaved Changes';
                const message = config.message || 'You have unsaved changes. Would you like to save before leaving?';
                const details = config.details || 'Any unsaved edits will be lost if you leave without saving.';
                const saveText = config.saveText || 'Save Changes';
                const leaveText = config.leaveText || 'Leave Without Saving';
                const stayText = config.stayText || 'Stay on Page';

                dialogOverlay.className = 'app-dialog-overlay app-dialog-warning';

                const iconEl = document.getElementById('app-dialog-icon');
                iconEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';

                document.getElementById('app-dialog-title').textContent = title;
                document.getElementById('app-dialog-message').innerHTML = message;

                const detailsEl = document.getElementById('app-dialog-details');
                detailsEl.textContent = details;
                detailsEl.style.display = details ? 'block' : 'none';

                document.getElementById('app-dialog-input-container').innerHTML = '';

                const actionsEl = document.getElementById('app-dialog-actions');
                actionsEl.style.flexWrap = 'wrap';
                actionsEl.style.gap = '10px';
                actionsEl.innerHTML = `
                    <button type="button" class="app-dialog-btn app-dialog-btn-cancel" id="app-dialog-btn-stay" style="order: 1;">${stayText}</button>
                    <button type="button" class="app-dialog-btn" id="app-dialog-btn-leave" style="order: 2; background: #EF4444; color: #FFFFFF; border: none; border-radius: 12px; padding: 10px 18px; font-weight: 500; font-size: 0.95rem; cursor: pointer;">${leaveText}</button>
                    <button type="button" class="app-dialog-btn" id="app-dialog-btn-save" style="order: 3; background: #F59E0B; color: #FFFFFF; border: none; border-radius: 12px; padding: 10px 22px; font-weight: 600; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);"><i class="fa-solid fa-floppy-disk me-1"></i> ${saveText}</button>
                `;

                const stayBtn = document.getElementById('app-dialog-btn-stay');
                const leaveBtn = document.getElementById('app-dialog-btn-leave');
                const saveBtn = document.getElementById('app-dialog-btn-save');

                function cleanup(action) {
                    document.removeEventListener('keydown', handleKeydown);
                    dialogOverlay.removeEventListener('click', handleBackdropClick);

                    dialogOverlay.classList.remove('app-dialog-visible');
                    document.body.classList.remove('app-dialog-open');

                    setTimeout(() => {
                        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                            lastFocusedElement.focus();
                        }
                    }, 200);

                    if (currentDialogResolve) {
                        currentDialogResolve(action);
                        currentDialogResolve = null;
                    }
                }

                stayBtn.onclick = () => cleanup('stay');
                leaveBtn.onclick = () => cleanup('leave');
                saveBtn.onclick = () => cleanup('save');

                function handleBackdropClick(e) {
                    if (e.target === dialogOverlay) {
                        cleanup('stay');
                    }
                }
                dialogOverlay.addEventListener('click', handleBackdropClick);

                function handleKeydown(e) {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        cleanup('stay');
                    }
                }
                document.addEventListener('keydown', handleKeydown);

                currentDialogResolve = resolve;

                document.body.classList.add('app-dialog-open');
                dialogOverlay.classList.add('app-dialog-visible');

                requestAnimationFrame(() => {
                    saveBtn.focus();
                });
            });
        },

        /**
         * Open an alert dialog (replaces native alert).
         * @param {Object} options
         * @returns {Promise<void>}
         */
        alert: function (options) {
            return new Promise((resolve) => {
                ensureDialogDOM();
                lastFocusedElement = document.activeElement;

                const config = typeof options === 'string' ? { message: options } : (options || {});
                const type = config.type || 'info';
                const title = config.title || (type === 'error' ? 'Notice' : 'Information');
                const message = config.message || '';
                const buttonText = config.buttonText || 'OK';

                dialogOverlay.className = `app-dialog-overlay app-dialog-${type}`;

                const iconEl = document.getElementById('app-dialog-icon');
                if (config.icon) {
                    iconEl.innerHTML = config.icon;
                } else if (type === 'error' || type === 'danger') {
                    iconEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
                } else if (type === 'success') {
                    iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                } else {
                    iconEl.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
                }

                document.getElementById('app-dialog-title').textContent = title;
                document.getElementById('app-dialog-message').innerHTML = message;
                
                const detailsEl = document.getElementById('app-dialog-details');
                detailsEl.style.display = 'none';
                document.getElementById('app-dialog-input-container').innerHTML = '';

                const actionsEl = document.getElementById('app-dialog-actions');
                actionsEl.innerHTML = `
                    <button type="button" class="app-dialog-btn app-dialog-btn-primary" id="app-dialog-btn-ok">${buttonText}</button>
                `;

                const okBtn = document.getElementById('app-dialog-btn-ok');

                function cleanup() {
                    document.removeEventListener('keydown', handleKeydown);
                    dialogOverlay.removeEventListener('click', handleBackdropClick);

                    dialogOverlay.classList.remove('app-dialog-visible');
                    document.body.classList.remove('app-dialog-open');

                    setTimeout(() => {
                        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                            lastFocusedElement.focus();
                        }
                    }, 200);

                    resolve();
                }

                okBtn.onclick = cleanup;

                function handleBackdropClick(e) {
                    if (e.target === dialogOverlay) cleanup();
                }
                dialogOverlay.addEventListener('click', handleBackdropClick);

                function handleKeydown(e) {
                    if (e.key === 'Escape' || e.key === 'Enter') {
                        e.preventDefault();
                        cleanup();
                    }
                }
                document.addEventListener('keydown', handleKeydown);

                document.body.classList.add('app-dialog-open');
                dialogOverlay.classList.add('app-dialog-visible');

                requestAnimationFrame(() => okBtn.focus());
            });
        },

        /**
         * Open an input prompt dialog (replaces native prompt).
         * @param {Object} options
         * @returns {Promise<string|null>}
         */
        prompt: function (options) {
            return new Promise((resolve) => {
                ensureDialogDOM();
                lastFocusedElement = document.activeElement;

                const config = typeof options === 'string' ? { message: options } : (options || {});
                const type = config.type || 'primary';
                const title = config.title || 'Input Required';
                const message = config.message || '';
                const placeholder = config.placeholder || '';
                const defaultValue = config.defaultValue || '';
                const confirmText = config.confirmText || 'Submit';
                const cancelText = config.cancelText || 'Cancel';

                dialogOverlay.className = `app-dialog-overlay app-dialog-${type}`;
                document.getElementById('app-dialog-icon').innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                document.getElementById('app-dialog-title').textContent = title;
                document.getElementById('app-dialog-message').innerHTML = message;
                document.getElementById('app-dialog-details').style.display = 'none';

                const inputContainer = document.getElementById('app-dialog-input-container');
                inputContainer.innerHTML = `
                    <input type="text" class="app-dialog-input" id="app-dialog-input" placeholder="${placeholder}" value="${defaultValue}">
                `;

                const inputEl = document.getElementById('app-dialog-input');
                const actionsEl = document.getElementById('app-dialog-actions');
                actionsEl.innerHTML = `
                    <button type="button" class="app-dialog-btn app-dialog-btn-cancel" id="app-dialog-btn-cancel">${cancelText}</button>
                    <button type="button" class="app-dialog-btn app-dialog-btn-primary" id="app-dialog-btn-confirm">${confirmText}</button>
                `;

                const cancelBtn = document.getElementById('app-dialog-btn-cancel');
                const confirmBtn = document.getElementById('app-dialog-btn-confirm');

                function cleanup(value) {
                    document.removeEventListener('keydown', handleKeydown);
                    dialogOverlay.removeEventListener('click', handleBackdropClick);

                    dialogOverlay.classList.remove('app-dialog-visible');
                    document.body.classList.remove('app-dialog-open');

                    setTimeout(() => {
                        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                            lastFocusedElement.focus();
                        }
                    }, 200);

                    resolve(value);
                }

                cancelBtn.onclick = () => cleanup(null);
                confirmBtn.onclick = () => cleanup(inputEl.value);

                function handleBackdropClick(e) {
                    if (e.target === dialogOverlay) cleanup(null);
                }
                dialogOverlay.addEventListener('click', handleBackdropClick);

                function handleKeydown(e) {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        cleanup(null);
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        cleanup(inputEl.value);
                    }
                }
                document.addEventListener('keydown', handleKeydown);

                document.body.classList.add('app-dialog-open');
                dialogOverlay.classList.add('app-dialog-visible');

                requestAnimationFrame(() => {
                    inputEl.focus();
                    inputEl.select();
                });
            });
        }
    };

    // ------------------------------------------------------------------------
    // 4. DECLARATIVE HTML INTEGRATION (data-confirm)
    // ------------------------------------------------------------------------
    // Automatically intercept forms with data-confirm
    document.addEventListener('submit', async function (e) {
        const form = e.target;
        if (form && form.dataset.confirm && !form.dataset.confirmed) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const title = form.dataset.confirmTitle || 'Are you sure?';
            const message = form.dataset.confirm;
            const details = form.dataset.confirmDetails || (form.dataset.confirmType === 'danger' ? 'This action cannot be undone.' : '');
            const confirmText = form.dataset.confirmBtn || (form.dataset.confirmType === 'danger' ? 'Delete' : 'Confirm');
            const cancelText = form.dataset.confirmCancel || 'Cancel';
            const type = form.dataset.confirmType || 'danger';
            const icon = form.dataset.confirmIcon ? `<i class="fa-solid fa-${form.dataset.confirmIcon}"></i>` : null;

            const confirmed = await AppDialog.confirm({
                title,
                message,
                details,
                confirmText,
                cancelText,
                type,
                icon
            });

            if (confirmed) {
                form.dataset.confirmed = 'true';
                form.submit();
            }
        }
    }, true);

    // Automatically intercept buttons/links with data-confirm
    document.addEventListener('click', async function (e) {
        const target = e.target.closest('[data-confirm]');
        if (!target || target.tagName === 'FORM') return;
        if (target.dataset.confirmed) return; // Already confirmed

        e.preventDefault();
        e.stopImmediatePropagation();

        const title = target.dataset.confirmTitle || 'Are you sure?';
        const message = target.dataset.confirm;
        const details = target.dataset.confirmDetails || (target.dataset.confirmType === 'danger' ? 'This action cannot be undone.' : '');
        const confirmText = target.dataset.confirmBtn || (target.dataset.confirmType === 'danger' ? 'Delete' : 'Confirm');
        const cancelText = target.dataset.confirmCancel || 'Cancel';
        const type = target.dataset.confirmType || 'danger';
        const icon = target.dataset.confirmIcon ? `<i class="fa-solid fa-${target.dataset.confirmIcon}"></i>` : null;

        const confirmed = await AppDialog.confirm({
            title,
            message,
            details,
            confirmText,
            cancelText,
            type,
            icon
        });

        if (confirmed) {
            target.dataset.confirmed = 'true';
            if (target.tagName === 'A' && target.href) {
                window.location.href = target.href;
            } else if (target.type === 'submit' && target.form) {
                target.form.dataset.confirmed = 'true';
                target.form.submit();
            } else {
                target.click();
                delete target.dataset.confirmed;
            }
        }
    }, true);

    // ------------------------------------------------------------------------
    // 5. FLASH MESSAGE CONVERSION TO TOASTS ON PAGE LOAD
    // ------------------------------------------------------------------------
    function shouldSkipAlert(el) {
        if (!el) return true;
        if (el.dataset.noToast || el.hasAttribute('data-no-toast') || el.closest('[data-no-toast="true"]')) return true;
        if (el.closest('[style*="display: none"], [style*="display:none"], .d-none')) return true;
        try {
            if (window.getComputedStyle(el).display === 'none') return true;
        } catch (e) {}
        return false;
    }

    function autoConvertFlashAlerts() {
        // Success alerts
        document.querySelectorAll('.alert.alert-success').forEach(el => {
            if (shouldSkipAlert(el)) return;
            const text = el.textContent.trim();
            if (text) {
                AppToast.success(text);
                el.style.display = 'none';
            }
        });

        // Danger/Error alerts
        document.querySelectorAll('.alert.alert-danger').forEach(el => {
            if (shouldSkipAlert(el)) return;
            const text = el.textContent.trim();
            if (text) {
                AppToast.error(text);
                el.style.display = 'none';
            }
        });

        // Warning alerts
        document.querySelectorAll('.alert.alert-warning').forEach(el => {
            if (shouldSkipAlert(el)) return;
            const text = el.textContent.trim();
            if (text) {
                AppToast.warning(text);
                el.style.display = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoConvertFlashAlerts);
    } else {
        autoConvertFlashAlerts();
    }

    // ------------------------------------------------------------------------
    // 6. GLOBAL WINDOW POLYFILL & SAFETY NET
    // ------------------------------------------------------------------------
    // Replace window.alert with AppToast.info or AppDialog.alert
    window.alert = function (msg) {
        AppToast.info(String(msg || ''));
    };

    // Safety fallback for window.confirm
    window.confirm = function (msg) {
        console.warn('Native window.confirm is deprecated in this project. Use AppDialog.confirm() instead.');
        return true;
    };

    // Attach services to global window object
    window.AppDialog = AppDialog;
    window.AppToast = AppToast;

})();
