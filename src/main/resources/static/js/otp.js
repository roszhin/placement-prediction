/**
 * Reusable OTP Manager for Roshin Analytics
 */
class OtpManager {
    constructor(config) {
        this.emailInput = document.getElementById(config.emailInputId);
        this.sendBtn = document.getElementById(config.sendBtnId);
        this.otpBox = document.getElementById(config.otpBoxId);
        this.otpInput = document.getElementById(config.otpInputId);
        this.verifyBtn = document.getElementById(config.verifyBtnId);
        this.msgBox = document.getElementById(config.msgId);
        this.verifyMsgBox = document.getElementById(config.verifyMsgId);
        this.submitBtn = document.getElementById(config.submitBtnId);
        
        this.isVerified = false;
        this.countdown = 0;
        this.timerInterval = null;
        this.originalEmail = '';
        this.sendController = null;
        this.verifyController = null;
        this.modal = this.sendBtn?.closest('.modal') || this.verifyBtn?.closest('.modal');
        
        // Initial setup
        if(this.submitBtn) {
            this.submitBtn.disabled = true;
        }

        this.initEventListeners();
        if (this.modal) {
            this.modal.addEventListener('hidden.bs.modal', () => this.reset());
        }
    }

    initEventListeners() {
        if(this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendOtp());
        if(this.verifyBtn) this.verifyBtn.addEventListener('click', () => this.verifyOtp());
        
        // If email changes after verification, reset
        if(this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                if (this.isVerified && this.emailInput.value !== this.originalEmail) {
                    this.resetVerification();
                }
            });
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    resetVerification() {
        this.clearCountdown();
        this.isVerified = false;
        if(this.otpInput) {
            this.otpInput.readOnly = false;
            this.otpInput.value = '';
        }
        if(this.sendBtn) {
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = 'Send OTP';
        }
        if(this.otpBox) this.otpBox.style.display = 'none';
        if(this.verifyBtn) {
            this.verifyBtn.disabled = false;
            this.verifyBtn.innerHTML = 'Verify OTP';
            this.verifyBtn.classList.remove('btn-success');
            this.verifyBtn.classList.add('btn-primary', 'bg-success', 'border-success'); // keep it looking like green if requested, wait the user wanted green background, I should just reset it
            this.verifyBtn.style.backgroundColor = '#10B981';
            this.verifyBtn.style.borderColor = '#10B981';
            this.verifyBtn.style.color = 'white';
        }
        
        if(this.msgBox) this.msgBox.classList.add('d-none');
        if(this.verifyMsgBox) this.verifyMsgBox.classList.add('d-none');
        
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
        }
    }

    reset() {
        this.sendController?.abort();
        this.verifyController?.abort();
        this.sendController = null;
        this.verifyController = null;
        this.clearCountdown();
        this.isVerified = false;
        this.originalEmail = '';
        if (this.emailInput) this.emailInput.readOnly = false;
        if (this.otpInput) {
            this.otpInput.readOnly = false;
            this.otpInput.value = '';
        }
        if (this.otpBox) this.otpBox.style.display = 'none';
        if (this.sendBtn) {
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = 'Send OTP';
        }
        if (this.verifyBtn) {
            this.verifyBtn.disabled = false;
            this.verifyBtn.innerHTML = 'Verify OTP';
            this.verifyBtn.classList.remove('btn-success');
            this.verifyBtn.style.removeProperty('background-color');
            this.verifyBtn.style.removeProperty('border-color');
            this.verifyBtn.style.removeProperty('color');
        }
        [this.msgBox, this.verifyMsgBox].forEach(message => {
            if (!message) return;
            message.classList.add('d-none');
            message.textContent = '';
            message.classList.remove('text-info', 'text-success', 'text-danger', 'text-warning');
            message.style.removeProperty('color');
        });
        if (this.submitBtn) this.submitBtn.disabled = true;
    }

    sendOtp() {
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showMessage(this.msgBox, "Please enter an email address.", "danger");
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showMessage(this.msgBox, "Please enter a valid email address.", "danger");
            return;
        }

        this.sendBtn.disabled = true;
        this.sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        this.showMessage(this.msgBox, "Sending OTP...", "info");

        const controller = new AbortController();
        this.sendController?.abort();
        this.sendController = controller;

        fetch(`/api/send-otp?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            signal: controller.signal
        })
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (this.sendController !== controller) return;
            if (response.ok) {
                this.showMessage(this.msgBox, "OTP sent successfully.", "success");
                if(this.otpBox) this.otpBox.style.display = 'flex';
                this.originalEmail = email;
                this.startCountdown();
            } else {
                const message = data.message === "Email already exists"
                    ? "An account with this email already exists. Please sign in or use another email."
                    : "OTP sending failed. Please try again later.";
                this.showMessage(this.msgBox, message, "danger");
                this.sendBtn.disabled = false;
                this.sendBtn.innerHTML = 'Send OTP';
            }
        })
        .catch(error => {
            if (error.name === 'AbortError' || this.sendController !== controller) return;
            this.showMessage(this.msgBox, "OTP sending failed. Please try again later.", "danger");
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = 'Send OTP';
        })
        .finally(() => {
            if (this.sendController === controller) this.sendController = null;
        });
    }

    verifyOtp() {
        const otp = this.otpInput.value.trim();
        const email = this.emailInput.value.trim();
        
        if (!otp || otp.length < 4) {
            this.showMessage(this.verifyMsgBox, "Please enter a valid OTP.", "danger");
            return;
        }

        this.verifyBtn.disabled = true;
        this.verifyBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

        const controller = new AbortController();
        this.verifyController?.abort();
        this.verifyController = controller;

        fetch(`/api/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
            method: 'POST',
            signal: controller.signal
        })
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (this.verifyController !== controller) return;
            if (response.ok) {
                this.isVerified = true;
                this.showMessage(this.verifyMsgBox, "<i class='fa-solid fa-circle-check me-1'></i> Email verified successfully.", "success");
                
                this.emailInput.readOnly = true;
                this.otpInput.readOnly = true;
                this.sendBtn.disabled = true;
                this.verifyBtn.disabled = true;
                
                this.verifyBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Verified';
                this.verifyBtn.style.backgroundColor = '#10B981';
                this.verifyBtn.style.borderColor = '#10B981';
                this.verifyBtn.style.color = '#ffffff';
                
                if (this.submitBtn) {
                    this.submitBtn.disabled = false;
                }
            } else {
                this.showMessage(this.verifyMsgBox, data.message || "Invalid OTP.", "danger");
                this.verifyBtn.disabled = false;
                this.verifyBtn.innerHTML = 'Verify OTP';
            }
        })
        .catch(error => {
            if (error.name === 'AbortError' || this.verifyController !== controller) return;
            this.showMessage(this.verifyMsgBox, "An error occurred while verifying OTP.", "danger");
            this.verifyBtn.disabled = false;
            this.verifyBtn.innerHTML = 'Verify OTP';
        })
        .finally(() => {
            if (this.verifyController === controller) this.verifyController = null;
        });
    }

    startCountdown() {
        this.clearCountdown();
        this.countdown = 60;
        this.sendBtn.disabled = true;
        
        this.timerInterval = setInterval(() => {
            this.sendBtn.innerHTML = `Resend OTP (${this.countdown}s)`;
            this.countdown--;
            
            if (this.countdown < 0) {
                this.clearCountdown();
                this.sendBtn.innerHTML = 'Resend OTP';
                this.sendBtn.disabled = false;
            }
        }, 1000);
    }

    clearCountdown() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.countdown = 0;
    }

    showMessage(element, html, type) {
        if(!element) return;
        element.classList.remove('d-none', 'text-info', 'text-success', 'text-danger');
        
        if (type === 'info') element.classList.add('text-info');
        else if (type === 'success') element.classList.add('text-success');
        else if (type === 'danger') element.classList.add('text-danger');
        else if (type === 'warning') {
            element.classList.add('text-warning');
            element.style.color = '#F59E0B'; // orange countdown styling requested
        }
        
        element.innerHTML = html;
    }
}
