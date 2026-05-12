/**
 * app.js
 * Main portal UI logic:
 *  - Tab navigation
 *  - Multi-step form progress
 *  - Submit → POST dispatch payload to AI Gateway
 *  - Toast notifications
 */

import { captureDispatchState } from './form-listener.js';
import { postDispatchIntent }   from './api-client.js';

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: #1e293b; color: #f1f5f9; border-left: 4px solid ${colors[type] || colors.info};
        padding: 12px 18px; border-radius: 8px; font-size: 14px; font-family: Inter, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4); max-width: 360px;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Inject keyframes once
    if (!document.getElementById('toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'toast-keyframes';
        style.textContent = `@keyframes slideIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }`;
        document.head.appendChild(style);
    }

    setTimeout(() => toast.remove(), 4000);
}

// Make globally available for ai-button.js compatibility
window.showToast = showToast;

// ── Tab navigation ────────────────────────────────────────────────────────────
function initTabs() {
    const tabs        = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => { c.classList.remove('active'); c.style.display = 'none'; });

            tab.classList.add('active');
            const target = document.getElementById(tab.getAttribute('data-target'));
            if (target) { target.classList.add('active'); target.style.display = 'flex'; }
        });
    });
}

// ── Multi-step progress ───────────────────────────────────────────────────────
function goToStep(stepName) {
    document.querySelectorAll('.form-step').forEach(el => el.style.display = 'none');
    const step = document.getElementById('step-' + stepName);
    if (step) step.style.display = 'block';

    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const steps = { caller: 1, clinical: 2, location: 3 };
    const idx   = steps[stepName] || 1;
    ['progress-caller', 'progress-clinical', 'progress-location']
        .slice(0, idx)
        .forEach(id => document.getElementById(id)?.classList.add('active'));
}
// Expose globally (used by inline onclick in HTML)
window.goToStep = goToStep;

// ── Submit handler ────────────────────────────────────────────────────────────
async function handleSubmit() {
    const btn = document.getElementById('btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

    try {
        const rawForm = captureDispatchState();
        await postDispatchIntent(rawForm);
        
        // Simulate host application saving data to its own database
        await new Promise(resolve => setTimeout(resolve, 600));

        showToast('✓ Info Submitted!', 'success');

        // Banner — auto-dismisses after 4s, has × close button
        const banner = document.getElementById('dispatch-result-banner');
        if (banner) {
            banner.innerHTML = `
                <span>✓ Info Submitted!</span>
                <button onclick="this.parentElement.style.display='none'"
                    style="background:none;border:none;color:inherit;cursor:pointer;
                           font-size:16px;line-height:1;padding:0 0 0 12px;opacity:0.7;">×</button>
            `;
            banner.style.cssText += 'display:flex; align-items:center; justify-content:space-between;';
            banner.style.display = 'flex';

            // Notify ai-button.js that form was submitted (triggers hibernate)
            window.dispatchEvent(new CustomEvent('emlisten:submitted'));

            // Auto-dismiss after 4 seconds
            setTimeout(() => { banner.style.display = 'none'; }, 4000);
        }
    } catch (err) {
        console.error('[EMListen] Submit failed:', err);
        showToast(`✗ Submission failed: ${err.message}`, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
    }
}
window.handleSubmit = handleSubmit;

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
});