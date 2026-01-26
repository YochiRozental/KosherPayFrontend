type LogoutHandler = (() => void) | null;

let onUnauthorized: LogoutHandler = null;

export function setOnUnauthorized(handler: LogoutHandler) {
    onUnauthorized = handler;
    return () => {
        if (onUnauthorized === handler) onUnauthorized = null;
    };
}

export function triggerUnauthorizedLogout() {
    onUnauthorized?.();
}
