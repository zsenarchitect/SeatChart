/**
 * Error Tracking System for SeatChart
 * Tracks errors locally and can report to external services
 */

class ErrorTracker {
    constructor() {
        this.errors = [];
        this.maxErrors = 100; // Keep last 100 errors
        this.errorCount = 0;
        this.isEnabled = true;
        
        // Initialize error tracking
        this.setupGlobalErrorHandling();
        this.loadStoredErrors();
    }

    setupGlobalErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.trackError('Unhandled Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('Unhandled Promise Rejection', {
                message: event.reason?.message || 'Unknown promise rejection',
                stack: event.reason?.stack,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Override console.error to track errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.trackError('Console Error', {
                message: args.join(' '),
                stack: new Error().stack,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
            originalConsoleError.apply(console, args);
        };
    }

    trackError(type, details) {
        if (!this.isEnabled) return;

        const error = {
            id: ++this.errorCount,
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
        };

        this.errors.push(error);
        
        // Keep only the last maxErrors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Store errors locally
        this.storeErrors();
        
        // Show error notification
        this.showErrorNotification(error);
        
        // Log to console for debugging
        console.warn('Error tracked:', error);
        
        // Send to external service if configured
        this.sendToExternalService(error);
    }

    showErrorNotification(error) {
        const tracker = document.getElementById('errorTracker');
        const message = document.getElementById('errorMessage');
        
        if (tracker && message) {
            message.textContent = `${error.type}: ${error.details.message || 'Unknown error'}`;
            tracker.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                tracker.style.display = 'none';
            }, 10000);
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('seatChart_sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('seatChart_sessionId', sessionId);
        }
        return sessionId;
    }

    storeErrors() {
        try {
            localStorage.setItem('seatChart_errors', JSON.stringify(this.errors));
        } catch (e) {
            console.warn('Failed to store errors:', e);
        }
    }

    loadStoredErrors() {
        try {
            const stored = localStorage.getItem('seatChart_errors');
            if (stored) {
                this.errors = JSON.parse(stored);
                this.errorCount = this.errors.length;
            }
        } catch (e) {
            console.warn('Failed to load stored errors:', e);
        }
    }

    sendToExternalService(error) {
        // Configuration for external error reporting
        const config = {
            enabled: false, // Set to true to enable external reporting
            endpoint: 'https://api.github.com/repos/szhang/SeatChart/issues',
            token: '', // GitHub token for creating issues
            repo: 'szhang/SeatChart'
        };

        if (!config.enabled) return;

        // Create GitHub issue for critical errors
        if (error.type === 'Unhandled Error' || error.type === 'Unhandled Promise Rejection') {
            this.createGitHubIssue(error, config);
        }
    }

    async createGitHubIssue(error, config) {
        if (!config.token) return;

        const issueData = {
            title: `[Error] ${error.type}: ${error.details.message || 'Unknown error'}`,
            body: this.formatErrorForGitHub(error),
            labels: ['bug', 'error-tracking'],
            assignees: ['szhang']
        };

        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(issueData)
            });

            if (response.ok) {
                console.log('Error reported to GitHub successfully');
            } else {
                console.warn('Failed to report error to GitHub:', response.status);
            }
        } catch (e) {
            console.warn('Failed to send error to GitHub:', e);
        }
    }

    formatErrorForGitHub(error) {
        return `
## Error Details

**Type:** ${error.type}
**Message:** ${error.details.message || 'No message'}
**Timestamp:** ${error.timestamp}
**Session ID:** ${error.sessionId}
**Page URL:** ${error.pageUrl}

## Stack Trace
\`\`\`
${error.details.stack || 'No stack trace available'}
\`\`\`

## Browser Information
- **User Agent:** ${error.userAgent}
- **URL:** ${error.pageUrl}

## Additional Details
- **Error ID:** ${error.id}
- **Error Count:** ${this.errors.length}

---
*This issue was automatically generated by the SeatChart error tracking system.*
        `.trim();
    }

    // Public methods for manual error tracking
    logError(message, details = {}) {
        this.trackError('Manual Error', {
            message: message,
            ...details
        });
    }

    logWarning(message, details = {}) {
        this.trackError('Warning', {
            message: message,
            ...details
        });
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            total: this.errors.length,
            byType: {},
            recent: this.errors.slice(-10),
            sessionId: this.getSessionId()
        };

        this.errors.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
        });

        return stats;
    }

    // Clear all errors
    clearErrors() {
        this.errors = [];
        this.errorCount = 0;
        localStorage.removeItem('seatChart_errors');
    }

    // Export errors for debugging
    exportErrors() {
        return {
            errors: this.errors,
            stats: this.getErrorStats(),
            exportTime: new Date().toISOString()
        };
    }

    // Enable/disable error tracking
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
}

// Initialize error tracker
window.errorTracker = new ErrorTracker();

// Add error tracking to window object for debugging
window.seatChartErrors = {
    track: (message, details) => window.errorTracker.logError(message, details),
    warn: (message, details) => window.errorTracker.logWarning(message, details),
    stats: () => window.errorTracker.getErrorStats(),
    export: () => window.errorTracker.exportErrors(),
    clear: () => window.errorTracker.clearErrors(),
    enable: (enabled) => window.errorTracker.setEnabled(enabled)
};

// Log application startup
window.errorTracker.logError('Application Started', {
    message: 'SeatChart application initialized',
    version: '1.0.0',
    timestamp: new Date().toISOString()
});
