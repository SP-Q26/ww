export async function showNotification({
    notif_title,
    notif_body,
    notif_icon,
    notif_image,
    notif_tag,
    notif_data,
    notif_vibrate,
    notif_actions,
}) {
    if (!('Notification' in window)) {
        throw new Error('Notifications are not available.');
    }

    let permission = Notification.permission;
    if (permission === 'default') {
        permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') {
        throw new Error('Notification permission denied.');
    }

    const options = {
        body: notif_body,
        icon: notif_icon,
        image: notif_image,
        tag: notif_tag,
        data: notif_data,
        vibrate: notif_vibrate,
        actions: notif_actions,
    };
    if (notif_tag) {
        options.renotify = true;
    }

    let registration = null;
    if ('serviceWorker' in navigator) {
        try {
            registration =
                (await navigator.serviceWorker.getRegistration()) ||
                (await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise(resolve => setTimeout(() => resolve(null), 1500)),
                ]));
        } catch (error) {
            registration = null;
        }
    }

    try {
        if (registration) {
            await registration.showNotification(notif_title, options);
        } else {
            new Notification(notif_title, options);
        }
    } catch (error) {
        console.error('[plugin-pwa] showNotification failed:', error);
        throw error;
    }
}
