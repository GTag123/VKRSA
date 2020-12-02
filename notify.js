window.warnPush = window.createNotification({
    // closeOnClick: true,
    // displayCloseButton: false,
    // positionClass: 'nfc-top-right',
    // onclick: false,
    showDuration: 5000,
    // success, info, warning, error, and none
    theme: 'warning'
});
window.errorPush = window.createNotification({showDuration: 5000, theme: 'error'});
window.successPush = window.createNotification({theme: 'success'});
window.infoPush = window.createNotification({showDuration: 2000, theme: 'info'});