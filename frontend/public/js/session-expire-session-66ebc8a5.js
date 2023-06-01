(() => {
    const e = document.getElementById("js-expire-session");
    if (e && e.dataset.sessionTimeoutIn) {
        const t = 1e3 * parseInt(e.dataset.sessionTimeoutIn, 10),
            s = e.dataset.timeoutRefreshPath || "";
        setTimeout((() => {
            document.location.href = s
        }), t)
    }
})();