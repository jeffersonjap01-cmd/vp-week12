/**
 * Utility functions for formatting time in a readable way
 */

/**
 * Format date to a readable string
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateTime(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    }
): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format current time in a readable way
 * @returns Current time formatted as readable string
 */
export function getCurrentReadableTime(): string {
    return formatDateTime(new Date());
}

/**
 * Format time with timezone info
 * @param date - Date to format
 * @returns Formatted time with timezone
 */
export function formatTimeWithTimezone(date: Date | string | number): string {
    return formatDateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    });
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string | number): string {
    const now = new Date();
    const targetDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return diffInSeconds < 0 ? 'in the future' : 'just now';
}