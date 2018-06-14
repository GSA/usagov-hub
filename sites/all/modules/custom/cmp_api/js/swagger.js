function clippyCopiedCallback() {
    $("#api_key_copied").fadeIn().delay(1e3).fadeOut()
}! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = e.length,
            n = it.type(e);
        return "function" === n || it.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function r(e, t, n) {
        if (it.isFunction(t)) return it.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType) return it.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (ht.test(t)) return it.filter(t, e, n);
            t = it.filter(t, e)
        }
        return it.grep(e, function(e) {
            return it.inArray(e, t) >= 0 !== n
        })
    }

    function i(e, t) {
        do e = e[t]; while (e && 1 !== e.nodeType);
        return e
    }

    function o(e) {
        var t = xt[e] = {};
        return it.each(e.match(bt) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function a() {
        ft.addEventListener ? (ft.removeEventListener("DOMContentLoaded", s, !1), e.removeEventListener("load", s, !1)) : (ft.detachEvent("onreadystatechange", s), e.detachEvent("onload", s))
    }

    function s() {
        (ft.addEventListener || "load" === event.type || "complete" === ft.readyState) && (a(), it.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var r = "data-" + t.replace(Et, "-$1").toLowerCase();
            if (n = e.getAttribute(r), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Tt.test(n) ? it.parseJSON(n) : n
                } catch (i) {}
                it.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function u(e) {
        var t;
        for (t in e)
            if (("data" !== t || !it.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function c(e, t, n, r) {
        if (it.acceptData(e)) {
            var i, o, a = it.expando,
                s = e.nodeType,
                l = s ? it.cache : e,
                u = s ? e[a] : e[a] && a;
            if (u && l[u] && (r || l[u].data) || void 0 !== n || "string" != typeof t) return u || (u = s ? e[a] = J.pop() || it.guid++ : a), l[u] || (l[u] = s ? {} : {
                toJSON: it.noop
            }), ("object" == typeof t || "function" == typeof t) && (r ? l[u] = it.extend(l[u], t) : l[u].data = it.extend(l[u].data, t)), o = l[u], r || (o.data || (o.data = {}), o = o.data), void 0 !== n && (o[it.camelCase(t)] = n), "string" == typeof t ? (i = o[t], null == i && (i = o[it.camelCase(t)])) : i = o, i
        }
    }

    function p(e, t, n) {
        if (it.acceptData(e)) {
            var r, i, o = e.nodeType,
                a = o ? it.cache : e,
                s = o ? e[it.expando] : it.expando;
            if (a[s]) {
                if (t && (r = n ? a[s] : a[s].data)) {
                    it.isArray(t) ? t = t.concat(it.map(t, it.camelCase)) : t in r ? t = [t] : (t = it.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length;
                    for (; i--;) delete r[t[i]];
                    if (n ? !u(r) : !it.isEmptyObject(r)) return
                }(n || (delete a[s].data, u(a[s]))) && (o ? it.cleanData([e], !0) : nt.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }

    function h() {
        return !0
    }

    function d() {
        return !1
    }

    function f() {
        try {
            return ft.activeElement
        } catch (e) {}
    }

    function m(e) {
        var t = Rt.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function g(e, t) {
        var n, r, i = 0,
            o = typeof e.getElementsByTagName !== kt ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== kt ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (r = n[i]); i++) !t || it.nodeName(r, t) ? o.push(r) : it.merge(o, g(r, t));
        return void 0 === t || t && it.nodeName(e, t) ? it.merge([e], o) : o
    }

    function y(e) {
        jt.test(e.type) && (e.defaultChecked = e.checked)
    }

    function v(e, t) {
        return it.nodeName(e, "table") && it.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function b(e) {
        return e.type = (null !== it.find.attr(e, "type")) + "/" + e.type, e
    }

    function x(e) {
        var t = Xt.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function w(e, t) {
        for (var n, r = 0; null != (n = e[r]); r++) it._data(n, "globalEval", !t || it._data(t[r], "globalEval"))
    }

    function S(e, t) {
        if (1 === t.nodeType && it.hasData(e)) {
            var n, r, i, o = it._data(e),
                a = it._data(t, o),
                s = o.events;
            if (s) {
                delete a.handle, a.events = {};
                for (n in s)
                    for (r = 0, i = s[n].length; i > r; r++) it.event.add(t, n, s[n][r])
            }
            a.data && (a.data = it.extend({}, a.data))
        }
    }

    function k(e, t) {
        var n, r, i;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !nt.noCloneEvent && t[it.expando]) {
                i = it._data(t);
                for (r in i.events) it.removeEvent(t, r, i.handle);
                t.removeAttribute(it.expando)
            }
            "script" === n && t.text !== e.text ? (b(t).text = e.text, x(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), nt.html5Clone && e.innerHTML && !it.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && jt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }

    function T(t, n) {
        var r, i = it(n.createElement(t)).appendTo(n.body),
            o = e.getDefaultComputedStyle && (r = e.getDefaultComputedStyle(i[0])) ? r.display : it.css(i[0], "display");
        return i.detach(), o
    }

    function E(e) {
        var t = ft,
            n = Zt[e];
        return n || (n = T(e, t), "none" !== n && n || (Yt = (Yt || it("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Yt[0].contentWindow || Yt[0].contentDocument).document, t.write(), t.close(), n = T(e, t), Yt.detach()), Zt[e] = n), n
    }

    function C(e, t) {
        return {
            get: function() {
                var n = e();
                if (null != n) return n ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function N(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = dn.length; i--;)
            if (t = dn[i] + n, t in e) return t;
        return r
    }

    function _(e, t) {
        for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++) r = e[a], r.style && (o[a] = it._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && _t(r) && (o[a] = it._data(r, "olddisplay", E(r.nodeName)))) : (i = _t(r), (n && "none" !== n || !i) && it._data(r, "olddisplay", i ? n : it.css(r, "display"))));
        for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }

    function A(e, t, n) {
        var r = un.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function j(e, t, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += it.css(e, n + Nt[o], !0, i)), r ? ("content" === n && (a -= it.css(e, "padding" + Nt[o], !0, i)), "margin" !== n && (a -= it.css(e, "border" + Nt[o] + "Width", !0, i))) : (a += it.css(e, "padding" + Nt[o], !0, i), "padding" !== n && (a += it.css(e, "border" + Nt[o] + "Width", !0, i)));
        return a
    }

    function H(e, t, n) {
        var r = !0,
            i = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = en(e),
            a = nt.boxSizing && "border-box" === it.css(e, "boxSizing", !1, o);
        if (0 >= i || null == i) {
            if (i = tn(e, t, o), (0 > i || null == i) && (i = e.style[t]), rn.test(i)) return i;
            r = a && (nt.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + j(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }

    function L(e, t, n, r, i) {
        return new L.prototype.init(e, t, n, r, i)
    }

    function D() {
        return setTimeout(function() {
            fn = void 0
        }), fn = it.now()
    }

    function O(e, t) {
        var n, r = {
                height: e
            },
            i = 0;
        for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Nt[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function q(e, t, n) {
        for (var r, i = (xn[t] || []).concat(xn["*"]), o = 0, a = i.length; a > o; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function R(e, t, n) {
        var r, i, o, a, s, l, u, c, p = this,
            h = {},
            d = e.style,
            f = e.nodeType && _t(e),
            m = it._data(e, "fxshow");
        n.queue || (s = it._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
            s.unqueued || l()
        }), s.unqueued++, p.always(function() {
            p.always(function() {
                s.unqueued--, it.queue(e, "fx").length || s.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], u = it.css(e, "display"), c = "none" === u ? it._data(e, "olddisplay") || E(e.nodeName) : u, "inline" === c && "none" === it.css(e, "float") && (nt.inlineBlockNeedsLayout && "inline" !== E(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", nt.shrinkWrapBlocks() || p.always(function() {
            d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
        }));
        for (r in t)
            if (i = t[r], gn.exec(i)) {
                if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) {
                    if ("show" !== i || !m || void 0 === m[r]) continue;
                    f = !0
                }
                h[r] = m && m[r] || it.style(e, r)
            } else u = void 0;
        if (it.isEmptyObject(h)) "inline" === ("none" === u ? E(e.nodeName) : u) && (d.display = u);
        else {
            m ? "hidden" in m && (f = m.hidden) : m = it._data(e, "fxshow", {}), o && (m.hidden = !f), f ? it(e).show() : p.done(function() {
                it(e).hide()
            }), p.done(function() {
                var t;
                it._removeData(e, "fxshow");
                for (t in h) it.style(e, t, h[t])
            });
            for (r in h) a = q(f ? m[r] : 0, r, p), r in m || (m[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
        }
    }

    function P(e, t) {
        var n, r, i, o, a;
        for (n in e)
            if (r = it.camelCase(n), i = t[r], o = e[n], it.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = it.cssHooks[r], a && "expand" in a) {
                o = a.expand(o), delete e[r];
                for (n in o) n in e || (e[n] = o[n], t[n] = i)
            } else t[r] = i
    }

    function M(e, t, n) {
        var r, i, o = 0,
            a = bn.length,
            s = it.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (i) return !1;
                for (var t = fn || D(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length; l > a; a++) u.tweens[a].run(o);
                return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1)
            },
            u = s.promise({
                elem: e,
                props: it.extend({}, t),
                opts: it.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: fn || D(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = it.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? u.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) u.tweens[n].run(1);
                    return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (P(c, u.opts.specialEasing); a > o; o++)
            if (r = bn[o].call(u, e, c, u.opts)) return r;
        return it.map(c, q, u), it.isFunction(u.opts.start) && u.opts.start.call(e, u), it.fx.timer(it.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }

    function $(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0,
                o = t.toLowerCase().match(bt) || [];
            if (it.isFunction(n))
                for (; r = o[i++];) "+" === r.charAt(0) ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function F(e, t, n, r) {
        function i(s) {
            var l;
            return o[s] = !0, it.each(e[s] || [], function(e, s) {
                var u = s(t, n, r);
                return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), i(u), !1)
            }), l
        }
        var o = {},
            a = e === Wn;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }

    function I(e, t) {
        var n, r, i = it.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((i[r] ? e : n || (n = {}))[r] = t[r]);
        return n && it.extend(!0, e, n), e
    }

    function B(e, t, n) {
        for (var r, i, o, a, s = e.contents, l = e.dataTypes;
             "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (a in s)
                if (s[a] && s[a].test(i)) {
                    l.unshift(a);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    o = a;
                    break
                }
                r || (r = a)
            }
            o = o || r
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }

    function z(e, t, n, r) {
        var i, o, a, s, l, u = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
                    if (a = u[l + " " + o] || u["* " + o], !a)
                        for (i in u)
                            if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (p) {
                            return {
                                state: "parsererror",
                                error: a ? p : "No conversion from " + l + " to " + o
                            }
                        }
                }
        return {
            state: "success",
            data: t
        }
    }

    function W(e, t, n, r) {
        var i;
        if (it.isArray(t)) it.each(t, function(t, i) {
            n || Jn.test(e) ? r(e, i) : W(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== it.type(t)) r(e, t);
        else
            for (i in t) W(e + "[" + i + "]", t[i], n, r)
    }

    function V() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function U() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function X(e) {
        return it.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var J = [],
        Q = J.slice,
        G = J.concat,
        K = J.push,
        Y = J.indexOf,
        Z = {},
        et = Z.toString,
        tt = Z.hasOwnProperty,
        nt = {},
        rt = "1.11.2",
        it = function(e, t) {
            return new it.fn.init(e, t)
        },
        ot = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        at = /^-ms-/,
        st = /-([\da-z])/gi,
        lt = function(e, t) {
            return t.toUpperCase()
        };
    it.fn = it.prototype = {
        jquery: rt,
        constructor: it,
        selector: "",
        length: 0,
        toArray: function() {
            return Q.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : Q.call(this)
        },
        pushStack: function(e) {
            var t = it.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return it.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(it.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Q.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: K,
        sort: J.sort,
        splice: J.splice
    }, it.extend = it.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || it.isFunction(a) || (a = {}), s === l && (a = this, s--); l > s; s++)
            if (null != (i = arguments[s]))
                for (r in i) e = a[r], n = i[r], a !== n && (u && n && (it.isPlainObject(n) || (t = it.isArray(n))) ? (t ? (t = !1, o = e && it.isArray(e) ? e : []) : o = e && it.isPlainObject(e) ? e : {}, a[r] = it.extend(u, o, n)) : void 0 !== n && (a[r] = n));
        return a
    }, it.extend({
        expando: "jQuery" + (rt + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === it.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === it.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !it.isArray(e) && e - parseFloat(e) + 1 >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== it.type(e) || e.nodeType || it.isWindow(e)) return !1;
            try {
                if (e.constructor && !tt.call(e, "constructor") && !tt.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (nt.ownLast)
                for (t in e) return tt.call(e, t);
            for (t in e);
            return void 0 === t || tt.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Z[et.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && it.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(at, "ms-").replace(st, lt)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, r) {
            var i, o = 0,
                a = e.length,
                s = n(e);
            if (r) {
                if (s)
                    for (; a > o && (i = t.apply(e[o], r), i !== !1); o++);
                else
                    for (o in e)
                        if (i = t.apply(e[o], r), i === !1) break
            } else if (s)
                for (; a > o && (i = t.call(e[o], o, e[o]), i !== !1); o++);
            else
                for (o in e)
                    if (i = t.call(e[o], o, e[o]), i === !1) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(ot, "")
        },
        makeArray: function(e, t) {
            var r = t || [];
            return null != e && (n(Object(e)) ? it.merge(r, "string" == typeof e ? [e] : e) : K.call(r, e)), r
        },
        inArray: function(e, t, n) {
            var r;
            if (t) {
                if (Y) return Y.call(t, e, n);
                for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; n > r;) e[i++] = t[r++];
            if (n !== n)
                for (; void 0 !== t[r];) e[i++] = t[r++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r, i = [], o = 0, a = e.length, s = !n; a > o; o++) r = !t(e[o], o), r !== s && i.push(e[o]);
            return i
        },
        map: function(e, t, r) {
            var i, o = 0,
                a = e.length,
                s = n(e),
                l = [];
            if (s)
                for (; a > o; o++) i = t(e[o], o, r), null != i && l.push(i);
            else
                for (o in e) i = t(e[o], o, r), null != i && l.push(i);
            return G.apply([], l)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            return "string" == typeof t && (i = e[t], t = e, e = i), it.isFunction(e) ? (n = Q.call(arguments, 2), r = function() {
                return e.apply(t || this, n.concat(Q.call(arguments)))
            }, r.guid = e.guid = e.guid || it.guid++, r) : void 0
        },
        now: function() {
            return +new Date
        },
        support: nt
    }), it.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        Z["[object " + t + "]"] = t.toLowerCase()
    });
    var ut = function(e) {
        function t(e, t, n, r) {
            var i, o, a, s, l, u, p, d, f, m;
            if ((t ? t.ownerDocument || t : F) !== L && H(t), t = t || L, n = n || [], s = t.nodeType, "string" != typeof e || !e || 1 !== s && 9 !== s && 11 !== s) return n;
            if (!r && O) {
                if (11 !== s && (i = vt.exec(e)))
                    if (a = i[1]) {
                        if (9 === s) {
                            if (o = t.getElementById(a), !o || !o.parentNode) return n;
                            if (o.id === a) return n.push(o), n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && M(t, o) && o.id === a) return n.push(o), n
                    } else {
                        if (i[2]) return Y.apply(n, t.getElementsByTagName(e)), n;
                        if ((a = i[3]) && w.getElementsByClassName) return Y.apply(n, t.getElementsByClassName(a)), n
                    }
                if (w.qsa && (!q || !q.test(e))) {
                    if (d = p = $, f = t, m = 1 !== s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (u = E(e), (p = t.getAttribute("id")) ? d = p.replace(xt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = u.length; l--;) u[l] = d + h(u[l]);
                        f = bt.test(e) && c(t.parentNode) || t, m = u.join(",")
                    }
                    if (m) try {
                        return Y.apply(n, f.querySelectorAll(m)), n
                    } catch (g) {} finally {
                        p || t.removeAttribute("id")
                    }
                }
            }
            return N(e.replace(lt, "$1"), t, n, r)
        }

        function n() {
            function e(n, r) {
                return t.push(n + " ") > S.cacheLength && delete e[t.shift()], e[n + " "] = r
            }
            var t = [];
            return e
        }

        function r(e) {
            return e[$] = !0, e
        }

        function i(e) {
            var t = L.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), r = e.length; r--;) S.attrHandle[n[r]] = t
        }

        function a(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || X) - (~e.sourceIndex || X);
            if (r) return r;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function s(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function u(e) {
            return r(function(t) {
                return t = +t, r(function(n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function c(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }

        function p() {}

        function h(e) {
            for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
            return r
        }

        function d(e, t, n) {
            var r = t.dir,
                i = n && "parentNode" === r,
                o = B++;
            return t.first ? function(t, n, o) {
                for (; t = t[r];)
                    if (1 === t.nodeType || i) return e(t, n, o)
            } : function(t, n, a) {
                var s, l, u = [I, o];
                if (a) {
                    for (; t = t[r];)
                        if ((1 === t.nodeType || i) && e(t, n, a)) return !0
                } else
                    for (; t = t[r];)
                        if (1 === t.nodeType || i) {
                            if (l = t[$] || (t[$] = {}), (s = l[r]) && s[0] === I && s[1] === o) return u[2] = s[2];
                            if (l[r] = u, u[2] = e(t, n, a)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--;)
                    if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }

        function m(e, n, r) {
            for (var i = 0, o = n.length; o > i; i++) t(e, n[i], r);
            return r
        }

        function g(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; l > s; s++)(o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
            return a
        }

        function y(e, t, n, i, o, a) {
            return i && !i[$] && (i = y(i)), o && !o[$] && (o = y(o, a)), r(function(r, a, s, l) {
                var u, c, p, h = [],
                    d = [],
                    f = a.length,
                    y = r || m(t || "*", s.nodeType ? [s] : s, []),
                    v = !e || !r && t ? y : g(y, h, e, s, l),
                    b = n ? o || (r ? e : f || i) ? [] : a : v;
                if (n && n(v, b, s, l), i)
                    for (u = g(b, d), i(u, [], s, l), c = u.length; c--;)(p = u[c]) && (b[d[c]] = !(v[d[c]] = p));
                if (r) {
                    if (o || e) {
                        if (o) {
                            for (u = [], c = b.length; c--;)(p = b[c]) && u.push(v[c] = p);
                            o(null, b = [], u, l)
                        }
                        for (c = b.length; c--;)(p = b[c]) && (u = o ? et(r, p) : h[c]) > -1 && (r[u] = !(a[u] = p))
                    }
                } else b = g(b === a ? b.splice(f, b.length) : b), o ? o(null, a, b, l) : Y.apply(a, b)
            })
        }

        function v(e) {
            for (var t, n, r, i = e.length, o = S.relative[e[0].type], a = o || S.relative[" "], s = o ? 1 : 0, l = d(function(e) {
                return e === t
            }, a, !0), u = d(function(e) {
                return et(t, e) > -1
            }, a, !0), c = [function(e, n, r) {
                var i = !o && (r || n !== _) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r));
                return t = null, i
            }]; i > s; s++)
                if (n = S.relative[e[s].type]) c = [d(f(c), n)];
                else {
                    if (n = S.filter[e[s].type].apply(null, e[s].matches), n[$]) {
                        for (r = ++s; i > r && !S.relative[e[r].type]; r++);
                        return y(s > 1 && f(c), s > 1 && h(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(lt, "$1"), n, r > s && v(e.slice(s, r)), i > r && v(e = e.slice(r)), i > r && h(e))
                    }
                    c.push(n)
                }
            return f(c)
        }

        function b(e, n) {
            var i = n.length > 0,
                o = e.length > 0,
                a = function(r, a, s, l, u) {
                    var c, p, h, d = 0,
                        f = "0",
                        m = r && [],
                        y = [],
                        v = _,
                        b = r || o && S.find.TAG("*", u),
                        x = I += null == v ? 1 : Math.random() || .1,
                        w = b.length;
                    for (u && (_ = a !== L && a); f !== w && null != (c = b[f]); f++) {
                        if (o && c) {
                            for (p = 0; h = e[p++];)
                                if (h(c, a, s)) {
                                    l.push(c);
                                    break
                                }
                            u && (I = x)
                        }
                        i && ((c = !h && c) && d--, r && m.push(c))
                    }
                    if (d += f, i && f !== d) {
                        for (p = 0; h = n[p++];) h(m, y, a, s);
                        if (r) {
                            if (d > 0)
                                for (; f--;) m[f] || y[f] || (y[f] = G.call(l));
                            y = g(y)
                        }
                        Y.apply(l, y), u && !r && y.length > 0 && d + n.length > 1 && t.uniqueSort(l)
                    }
                    return u && (I = x, _ = v), m
                };
            return i ? r(a) : a
        }
        var x, w, S, k, T, E, C, N, _, A, j, H, L, D, O, q, R, P, M, $ = "sizzle" + 1 * new Date,
            F = e.document,
            I = 0,
            B = 0,
            z = n(),
            W = n(),
            V = n(),
            U = function(e, t) {
                return e === t && (j = !0), 0
            },
            X = 1 << 31,
            J = {}.hasOwnProperty,
            Q = [],
            G = Q.pop,
            K = Q.push,
            Y = Q.push,
            Z = Q.slice,
            et = function(e, t) {
                for (var n = 0, r = e.length; r > n; n++)
                    if (e[n] === t) return n;
                return -1
            },
            tt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            nt = "[\\x20\\t\\r\\n\\f]",
            rt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            it = rt.replace("w", "w#"),
            ot = "\\[" + nt + "*(" + rt + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + nt + "*\\]",
            at = ":(" + rt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ot + ")*)|.*)\\)|)",
            st = new RegExp(nt + "+", "g"),
            lt = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
            ut = new RegExp("^" + nt + "*," + nt + "*"),
            ct = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
            pt = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
            ht = new RegExp(at),
            dt = new RegExp("^" + it + "$"),
            ft = {
                ID: new RegExp("^#(" + rt + ")"),
                CLASS: new RegExp("^\\.(" + rt + ")"),
                TAG: new RegExp("^(" + rt.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + ot),
                PSEUDO: new RegExp("^" + at),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + tt + ")$", "i"),
                needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
            },
            mt = /^(?:input|select|textarea|button)$/i,
            gt = /^h\d$/i,
            yt = /^[^{]+\{\s*\[native \w/,
            vt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            bt = /[+~]/,
            xt = /'|\\/g,
            wt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
            St = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            kt = function() {
                H()
            };
        try {
            Y.apply(Q = Z.call(F.childNodes), F.childNodes), Q[F.childNodes.length].nodeType
        } catch (Tt) {
            Y = {
                apply: Q.length ? function(e, t) {
                    K.apply(e, Z.call(t))
                } : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];);
                    e.length = n - 1
                }
            }
        }
        w = t.support = {}, T = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, H = t.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : F;
            return r !== L && 9 === r.nodeType && r.documentElement ? (L = r, D = r.documentElement, n = r.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", kt, !1) : n.attachEvent && n.attachEvent("onunload", kt)), O = !T(r), w.attributes = i(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), w.getElementsByTagName = i(function(e) {
                return e.appendChild(r.createComment("")), !e.getElementsByTagName("*").length
            }), w.getElementsByClassName = yt.test(r.getElementsByClassName), w.getById = i(function(e) {
                return D.appendChild(e).id = $, !r.getElementsByName || !r.getElementsByName($).length
            }), w.getById ? (S.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && O) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, S.filter.ID = function(e) {
                var t = e.replace(wt, St);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete S.find.ID, S.filter.ID = function(e) {
                var t = e.replace(wt, St);
                return function(e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), S.find.TAG = w.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
            } : function(e, t) {
                var n, r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, S.find.CLASS = w.getElementsByClassName && function(e, t) {
                return O ? t.getElementsByClassName(e) : void 0
            }, R = [], q = [], (w.qsa = yt.test(r.querySelectorAll)) && (i(function(e) {
                D.appendChild(e).innerHTML = "<a id='" + $ + "'></a><select id='" + $ + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + nt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || q.push("\\[" + nt + "*(?:value|" + tt + ")"), e.querySelectorAll("[id~=" + $ + "-]").length || q.push("~="), e.querySelectorAll(":checked").length || q.push(":checked"), e.querySelectorAll("a#" + $ + "+*").length || q.push(".#.+[+~]")
            }), i(function(e) {
                var t = r.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && q.push("name" + nt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), q.push(",.*:")
            })), (w.matchesSelector = yt.test(P = D.matches || D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && i(function(e) {
                w.disconnectedMatch = P.call(e, "div"), P.call(e, "[s!='']:x"), R.push("!=", at)
            }), q = q.length && new RegExp(q.join("|")), R = R.length && new RegExp(R.join("|")), t = yt.test(D.compareDocumentPosition), M = t || yt.test(D.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, U = t ? function(e, t) {
                if (e === t) return j = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === r || e.ownerDocument === F && M(F, e) ? -1 : t === r || t.ownerDocument === F && M(F, t) ? 1 : A ? et(A, e) - et(A, t) : 0 : 4 & n ? -1 : 1)
            } : function(e, t) {
                if (e === t) return j = !0, 0;
                var n, i = 0,
                    o = e.parentNode,
                    s = t.parentNode,
                    l = [e],
                    u = [t];
                if (!o || !s) return e === r ? -1 : t === r ? 1 : o ? -1 : s ? 1 : A ? et(A, e) - et(A, t) : 0;
                if (o === s) return a(e, t);
                for (n = e; n = n.parentNode;) l.unshift(n);
                for (n = t; n = n.parentNode;) u.unshift(n);
                for (; l[i] === u[i];) i++;
                return i ? a(l[i], u[i]) : l[i] === F ? -1 : u[i] === F ? 1 : 0
            }, r) : L
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== L && H(e), n = n.replace(pt, "='$1']"), !(!w.matchesSelector || !O || R && R.test(n) || q && q.test(n))) try {
                var r = P.call(e, n);
                if (r || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
            } catch (i) {}
            return t(n, L, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== L && H(e), M(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== L && H(e);
            var n = S.attrHandle[t.toLowerCase()],
                r = n && J.call(S.attrHandle, t.toLowerCase()) ? n(e, t, !O) : void 0;
            return void 0 !== r ? r : w.attributes || !O ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                r = 0,
                i = 0;
            if (j = !w.detectDuplicates, A = !w.sortStable && e.slice(0), e.sort(U), j) {
                for (; t = e[i++];) t === e[i] && (r = n.push(i));
                for (; r--;) e.splice(n[r], 1)
            }
            return A = null, e
        }, k = t.getText = function(e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += k(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[r++];) n += k(t);
            return n
        }, S = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: ft,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(wt, St), e[3] = (e[3] || e[4] || e[5] || "").replace(wt, St), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return ft.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ht.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(wt, St).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = z[e + " "];
                    return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && z(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(st, " ") + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        a = "last" !== e.slice(-4),
                        s = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var u, c, p, h, d, f, m = o !== a ? "nextSibling" : "previousSibling",
                            g = t.parentNode,
                            y = s && t.nodeName.toLowerCase(),
                            v = !l && !s;
                        if (g) {
                            if (o) {
                                for (; m;) {
                                    for (p = t; p = p[m];)
                                        if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1;
                                    f = m = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [a ? g.firstChild : g.lastChild], a && v) {
                                for (c = g[$] || (g[$] = {}), u = c[e] || [], d = u[0] === I && u[1], h = u[0] === I && u[2], p = d && g.childNodes[d]; p = ++d && p && p[m] || (h = d = 0) || f.pop();)
                                    if (1 === p.nodeType && ++h && p === t) {
                                        c[e] = [I, d, h];
                                        break
                                    }
                            } else if (v && (u = (t[$] || (t[$] = {}))[e]) && u[0] === I) h = u[1];
                            else
                                for (;
                                    (p = ++d && p && p[m] || (h = d = 0) || f.pop()) && ((s ? p.nodeName.toLowerCase() !== y : 1 !== p.nodeType) || !++h || (v && ((p[$] || (p[$] = {}))[e] = [I, h]), p !== t)););
                            return h -= i, h === r || h % r === 0 && h / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = S.pseudos[e] || S.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[$] ? o(n) : o.length > 1 ? (i = [e, e, "", n], S.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), a = i.length; a--;) r = et(e, i[a]), e[r] = !(t[r] = i[a])
                    }) : function(e) {
                        return o(e, 0, i)
                    }) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = [],
                        n = [],
                        i = C(e.replace(lt, "$1"));
                    return i[$] ? r(function(e, t, n, r) {
                        for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function(e, r, o) {
                        return t[0] = e, i(t, null, o, n), t[0] = null, !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function(e) {
                    return e = e.replace(wt, St),
                        function(t) {
                            return (t.textContent || t.innerText || k(t)).indexOf(e) > -1
                        }
                }),
                lang: r(function(e) {
                    return dt.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(wt, St).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === D
                },
                focus: function(e) {
                    return e === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !S.pseudos.empty(e)
                },
                header: function(e) {
                    return gt.test(e.nodeName)
                },
                input: function(e) {
                    return mt.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: u(function() {
                    return [0]
                }),
                last: u(function(e, t) {
                    return [t - 1]
                }),
                eq: u(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: u(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: u(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                    return e
                }),
                gt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                    return e
                })
            }
        }, S.pseudos.nth = S.pseudos.eq;
        for (x in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) S.pseudos[x] = s(x);
        for (x in {
            submit: !0,
            reset: !0
        }) S.pseudos[x] = l(x);
        return p.prototype = S.filters = S.pseudos, S.setFilters = new p, E = t.tokenize = function(e, n) {
            var r, i, o, a, s, l, u, c = W[e + " "];
            if (c) return n ? 0 : c.slice(0);
            for (s = e, l = [], u = S.preFilter; s;) {
                (!r || (i = ut.exec(s))) && (i && (s = s.slice(i[0].length) || s), l.push(o = [])), r = !1, (i = ct.exec(s)) && (r = i.shift(), o.push({
                    value: r,
                    type: i[0].replace(lt, " ")
                }), s = s.slice(r.length));
                for (a in S.filter) !(i = ft[a].exec(s)) || u[a] && !(i = u[a](i)) || (r = i.shift(), o.push({
                    value: r,
                    type: a,
                    matches: i
                }), s = s.slice(r.length));
                if (!r) break
            }
            return n ? s.length : s ? t.error(e) : W(e, l).slice(0)
        }, C = t.compile = function(e, t) {
            var n, r = [],
                i = [],
                o = V[e + " "];
            if (!o) {
                for (t || (t = E(e)), n = t.length; n--;) o = v(t[n]), o[$] ? r.push(o) : i.push(o);
                o = V(e, b(i, r)), o.selector = e
            }
            return o
        }, N = t.select = function(e, t, n, r) {
            var i, o, a, s, l, u = "function" == typeof e && e,
                p = !r && E(e = u.selector || e);
            if (n = n || [], 1 === p.length) {
                if (o = p[0] = p[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && w.getById && 9 === t.nodeType && O && S.relative[o[1].type]) {
                    if (t = (S.find.ID(a.matches[0].replace(wt, St), t) || [])[0], !t) return n;
                    u && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (i = ft.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !S.relative[s = a.type]);)
                    if ((l = S.find[s]) && (r = l(a.matches[0].replace(wt, St), bt.test(o[0].type) && c(t.parentNode) || t))) {
                        if (o.splice(i, 1), e = r.length && h(o), !e) return Y.apply(n, r), n;
                        break
                    }
            }
            return (u || C(e, p))(r, t, !O, n, bt.test(e) && c(t.parentNode) || t), n
        }, w.sortStable = $.split("").sort(U).join("") === $, w.detectDuplicates = !!j, H(), w.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(L.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), w.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(tt, function(e, t, n) {
            var r;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), t
    }(e);
    it.find = ut, it.expr = ut.selectors, it.expr[":"] = it.expr.pseudos, it.unique = ut.uniqueSort, it.text = ut.getText, it.isXMLDoc = ut.isXML, it.contains = ut.contains;
    var ct = it.expr.match.needsContext,
        pt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ht = /^.[^:#\[\.,]*$/;
    it.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? it.find.matchesSelector(r, e) ? [r] : [] : it.find.matches(e, it.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, it.fn.extend({
        find: function(e) {
            var t, n = [],
                r = this,
                i = r.length;
            if ("string" != typeof e) return this.pushStack(it(e).filter(function() {
                for (t = 0; i > t; t++)
                    if (it.contains(r[t], this)) return !0
            }));
            for (t = 0; i > t; t++) it.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? it.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(r(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(r(this, e || [], !0))
        },
        is: function(e) {
            return !!r(this, "string" == typeof e && ct.test(e) ? it(e) : e || [], !1).length
        }
    });
    var dt, ft = e.document,
        mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        gt = it.fn.init = function(e, t) {
            var n, r;
            if (!e) return this;
            if ("string" == typeof e) {
                if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || dt).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof it ? t[0] : t, it.merge(this, it.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : ft, !0)), pt.test(n[1]) && it.isPlainObject(t))
                        for (n in t) it.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                if (r = ft.getElementById(n[2]), r && r.parentNode) {
                    if (r.id !== n[2]) return dt.find(e);
                    this.length = 1, this[0] = r
                }
                return this.context = ft, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : it.isFunction(e) ? "undefined" != typeof dt.ready ? dt.ready(e) : e(it) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), it.makeArray(e, this))
        };
    gt.prototype = it.fn, dt = it(ft);
    var yt = /^(?:parents|prev(?:Until|All))/,
        vt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    it.extend({
        dir: function(e, t, n) {
            for (var r = [], i = e[t]; i && 9 !== i.nodeType && (void 0 === n || 1 !== i.nodeType || !it(i).is(n));) 1 === i.nodeType && r.push(i), i = i[t];
            return r
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), it.fn.extend({
        has: function(e) {
            var t, n = it(e, this),
                r = n.length;
            return this.filter(function() {
                for (t = 0; r > t; t++)
                    if (it.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, r = 0, i = this.length, o = [], a = ct.test(e) || "string" != typeof e ? it(e, t || this.context) : 0; i > r; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && it.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? it.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? it.inArray(this[0], it(e)) : it.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(it.unique(it.merge(this.get(), it(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), it.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return it.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return it.dir(e, "parentNode", n)
        },
        next: function(e) {
            return i(e, "nextSibling")
        },
        prev: function(e) {
            return i(e, "previousSibling")
        },
        nextAll: function(e) {
            return it.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return it.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return it.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return it.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return it.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return it.sibling(e.firstChild)
        },
        contents: function(e) {
            return it.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : it.merge([], e.childNodes)
        }
    }, function(e, t) {
        it.fn[e] = function(n, r) {
            var i = it.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = it.filter(r, i)), this.length > 1 && (vt[e] || (i = it.unique(i)), yt.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    });
    var bt = /\S+/g,
        xt = {};
    it.Callbacks = function(e) {
        e = "string" == typeof e ? xt[e] || o(e) : it.extend({}, e);
        var t, n, r, i, a, s, l = [],
            u = !e.once && [],
            c = function(o) {
                for (n = e.memory && o, r = !0, a = s || 0, s = 0, i = l.length, t = !0; l && i > a; a++)
                    if (l[a].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                        n = !1;
                        break
                    }
                t = !1, l && (u ? u.length && c(u.shift()) : n ? l = [] : p.disable())
            },
            p = {
                add: function() {
                    if (l) {
                        var r = l.length;
                        ! function o(t) {
                            it.each(t, function(t, n) {
                                var r = it.type(n);
                                "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && o(n)
                            })
                        }(arguments), t ? i = l.length : n && (s = r, c(n))
                    }
                    return this
                },
                remove: function() {
                    return l && it.each(arguments, function(e, n) {
                        for (var r;
                             (r = it.inArray(n, l, r)) > -1;) l.splice(r, 1), t && (i >= r && i--, a >= r && a--)
                    }), this
                },
                has: function(e) {
                    return e ? it.inArray(e, l) > -1 : !(!l || !l.length)
                },
                empty: function() {
                    return l = [], i = 0, this
                },
                disable: function() {
                    return l = u = n = void 0, this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return u = void 0, n || p.disable(), this
                },
                locked: function() {
                    return !u
                },
                fireWith: function(e, n) {
                    return !l || r && !u || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? u.push(n) : c(n)), this
                },
                fire: function() {
                    return p.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return p
    }, it.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", it.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", it.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", it.Callbacks("memory")]
                ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return it.Deferred(function(n) {
                            it.each(t, function(t, o) {
                                var a = it.isFunction(e[t]) && e[t];
                                i[o[1]](function() {
                                    var e = a && a.apply(this, arguments);
                                    e && it.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === r ? n.promise() : this, a ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? it.extend(e, r) : r
                    }
                },
                i = {};
            return r.pipe = r.then, it.each(t, function(e, o) {
                var a = o[2],
                    s = o[3];
                r[o[1]] = a.add, s && a.add(function() {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                    return i[o[0] + "With"](this === i ? r : this, arguments), this
                }, i[o[0] + "With"] = a.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t, n, r, i = 0,
                o = Q.call(arguments),
                a = o.length,
                s = 1 !== a || e && it.isFunction(e.promise) ? a : 0,
                l = 1 === s ? e : it.Deferred(),
                u = function(e, n, r) {
                    return function(i) {
                        n[e] = this, r[e] = arguments.length > 1 ? Q.call(arguments) : i, r === t ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                    }
                };
            if (a > 1)
                for (t = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && it.isFunction(o[i].promise) ? o[i].promise().done(u(i, r, o)).fail(l.reject).progress(u(i, n, t)) : --s;
            return s || l.resolveWith(r, o), l.promise()
        }
    });
    var wt;
    it.fn.ready = function(e) {
        return it.ready.promise().done(e), this
    }, it.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? it.readyWait++ : it.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? !--it.readyWait : !it.isReady) {
                if (!ft.body) return setTimeout(it.ready);
                it.isReady = !0, e !== !0 && --it.readyWait > 0 || (wt.resolveWith(ft, [it]), it.fn.triggerHandler && (it(ft).triggerHandler("ready"), it(ft).off("ready")))
            }
        }
    }), it.ready.promise = function(t) {
        if (!wt)
            if (wt = it.Deferred(), "complete" === ft.readyState) setTimeout(it.ready);
            else if (ft.addEventListener) ft.addEventListener("DOMContentLoaded", s, !1), e.addEventListener("load", s, !1);
            else {
                ft.attachEvent("onreadystatechange", s), e.attachEvent("onload", s);
                var n = !1;
                try {
                    n = null == e.frameElement && ft.documentElement
                } catch (r) {}
                n && n.doScroll && ! function i() {
                    if (!it.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (e) {
                            return setTimeout(i, 50)
                        }
                        a(), it.ready()
                    }
                }()
            }
        return wt.promise(t)
    };
    var St, kt = "undefined";
    for (St in it(nt)) break;
    nt.ownLast = "0" !== St, nt.inlineBlockNeedsLayout = !1, it(function() {
        var e, t, n, r;
        n = ft.getElementsByTagName("body")[0], n && n.style && (t = ft.createElement("div"), r = ft.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(r).appendChild(t), typeof t.style.zoom !== kt && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", nt.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(r))
    }),
        function() {
            var e = ft.createElement("div");
            if (null == nt.deleteExpando) {
                nt.deleteExpando = !0;
                try {
                    delete e.test
                } catch (t) {
                    nt.deleteExpando = !1
                }
            }
            e = null
        }(), it.acceptData = function(e) {
        var t = it.noData[(e.nodeName + " ").toLowerCase()],
            n = +e.nodeType || 1;
        return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
    };
    var Tt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Et = /([A-Z])/g;
    it.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? it.cache[e[it.expando]] : e[it.expando], !!e && !u(e)
        },
        data: function(e, t, n) {
            return c(e, t, n)
        },
        removeData: function(e, t) {
            return p(e, t)
        },
        _data: function(e, t, n) {
            return c(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return p(e, t, !0)
        }
    }), it.fn.extend({
        data: function(e, t) {
            var n, r, i, o = this[0],
                a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = it.data(o), 1 === o.nodeType && !it._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--;) a[n] && (r = a[n].name, 0 === r.indexOf("data-") && (r = it.camelCase(r.slice(5)), l(o, r, i[r])));
                    it._data(o, "parsedAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                it.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                it.data(this, e, t)
            }) : o ? l(o, e, it.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                it.removeData(this, e)
            })
        }
    }), it.extend({
        queue: function(e, t, n) {
            var r;
            return e ? (t = (t || "fx") + "queue", r = it._data(e, t), n && (!r || it.isArray(n) ? r = it._data(e, t, it.makeArray(n)) : r.push(n)), r || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = it.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = it._queueHooks(e, t),
                a = function() {
                    it.dequeue(e, t)
                };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return it._data(e, n) || it._data(e, n, {
                empty: it.Callbacks("once memory").add(function() {
                    it._removeData(e, t + "queue"), it._removeData(e, n)
                })
            })
        }
    }), it.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? it.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = it.queue(this, e, t);
                it._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && it.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                it.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1,
                i = it.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --r || i.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = it._data(o[a], e + "queueHooks"), n && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    });
    var Ct = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Nt = ["Top", "Right", "Bottom", "Left"],
        _t = function(e, t) {
            return e = t || e, "none" === it.css(e, "display") || !it.contains(e.ownerDocument, e)
        },
        At = it.access = function(e, t, n, r, i, o, a) {
            var s = 0,
                l = e.length,
                u = null == n;
            if ("object" === it.type(n)) {
                i = !0;
                for (s in n) it.access(e, t, s, n[s], !0, o, a)
            } else if (void 0 !== r && (i = !0, it.isFunction(r) || (a = !0), u && (a ? (t.call(e, r), t = null) : (u = t, t = function(e, t, n) {
                    return u.call(it(e), n)
                })), t))
                for (; l > s; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
        },
        jt = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = ft.createElement("input"),
            t = ft.createElement("div"),
            n = ft.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", nt.leadingWhitespace = 3 === t.firstChild.nodeType, nt.tbody = !t.getElementsByTagName("tbody").length, nt.htmlSerialize = !!t.getElementsByTagName("link").length, nt.html5Clone = "<:nav></:nav>" !== ft.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), nt.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", nt.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", nt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, nt.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
                nt.noCloneEvent = !1
            }), t.cloneNode(!0).click()), null == nt.deleteExpando) {
            nt.deleteExpando = !0;
            try {
                delete t.test
            } catch (r) {
                nt.deleteExpando = !1
            }
        }
    }(),
        function() {
            var t, n, r = ft.createElement("div");
            for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            }) n = "on" + t, (nt[t + "Bubbles"] = n in e) || (r.setAttribute(n, "t"), nt[t + "Bubbles"] = r.attributes[n].expando === !1);
            r = null
        }();
    var Ht = /^(?:input|select|textarea)$/i,
        Lt = /^key/,
        Dt = /^(?:mouse|pointer|contextmenu)|click/,
        Ot = /^(?:focusinfocus|focusoutblur)$/,
        qt = /^([^.]*)(?:\.(.+)|)$/;
    it.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, l, u, c, p, h, d, f, m, g = it._data(e);
            if (g) {
                for (n.handler && (l = n, n = l.handler, i = l.selector), n.guid || (n.guid = it.guid++), (a = g.events) || (a = g.events = {}), (c = g.handle) || (c = g.handle = function(e) {
                    return typeof it === kt || e && it.event.triggered === e.type ? void 0 : it.event.dispatch.apply(c.elem, arguments)
                }, c.elem = e), t = (t || "").match(bt) || [""], s = t.length; s--;) o = qt.exec(t[s]) || [], d = m = o[1], f = (o[2] || "").split(".").sort(), d && (u = it.event.special[d] || {}, d = (i ? u.delegateType : u.bindType) || d, u = it.event.special[d] || {}, p = it.extend({
                    type: d,
                    origType: m,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && it.expr.match.needsContext.test(i),
                    namespace: f.join(".")
                }, l), (h = a[d]) || (h = a[d] = [], h.delegateCount = 0, u.setup && u.setup.call(e, r, f, c) !== !1 || (e.addEventListener ? e.addEventListener(d, c, !1) : e.attachEvent && e.attachEvent("on" + d, c))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), i ? h.splice(h.delegateCount++, 0, p) : h.push(p), it.event.global[d] = !0);
                e = null
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, l, u, c, p, h, d, f, m, g = it.hasData(e) && it._data(e);
            if (g && (c = g.events)) {
                for (t = (t || "").match(bt) || [""], u = t.length; u--;)
                    if (s = qt.exec(t[u]) || [], d = m = s[1], f = (s[2] || "").split(".").sort(), d) {
                        for (p = it.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, h = c[d] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = h.length; o--;) a = h[o], !i && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (h.splice(o, 1), a.selector && h.delegateCount--, p.remove && p.remove.call(e, a));
                        l && !h.length && (p.teardown && p.teardown.call(e, f, g.handle) !== !1 || it.removeEvent(e, d, g.handle), delete c[d])
                    } else
                        for (d in c) it.event.remove(e, d + t[u], n, r, !0);
                it.isEmptyObject(c) && (delete g.handle, it._removeData(e, "events"))
            }
        },
        trigger: function(t, n, r, i) {
            var o, a, s, l, u, c, p, h = [r || ft],
                d = tt.call(t, "type") ? t.type : t,
                f = tt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = c = r = r || ft, 3 !== r.nodeType && 8 !== r.nodeType && !Ot.test(d + it.event.triggered) && (d.indexOf(".") >= 0 && (f = d.split("."), d = f.shift(), f.sort()), a = d.indexOf(":") < 0 && "on" + d, t = t[it.expando] ? t : new it.Event(d, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : it.makeArray(n, [t]), u = it.event.special[d] || {}, i || !u.trigger || u.trigger.apply(r, n) !== !1)) {
                if (!i && !u.noBubble && !it.isWindow(r)) {
                    for (l = u.delegateType || d, Ot.test(l + d) || (s = s.parentNode); s; s = s.parentNode) h.push(s), c = s;
                    c === (r.ownerDocument || ft) && h.push(c.defaultView || c.parentWindow || e)
                }
                for (p = 0;
                     (s = h[p++]) && !t.isPropagationStopped();) t.type = p > 1 ? l : u.bindType || d, o = (it._data(s, "events") || {})[t.type] && it._data(s, "handle"), o && o.apply(s, n), o = a && s[a], o && o.apply && it.acceptData(s) && (t.result = o.apply(s, n), t.result === !1 && t.preventDefault());
                if (t.type = d, !i && !t.isDefaultPrevented() && (!u._default || u._default.apply(h.pop(), n) === !1) && it.acceptData(r) && a && r[d] && !it.isWindow(r)) {
                    c = r[a], c && (r[a] = null), it.event.triggered = d;
                    try {
                        r[d]()
                    } catch (m) {}
                    it.event.triggered = void 0, c && (r[a] = c)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = it.event.fix(e);
            var t, n, r, i, o, a = [],
                s = Q.call(arguments),
                l = (it._data(this, "events") || {})[e.type] || [],
                u = it.event.special[e.type] || {};
            if (s[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                for (a = it.event.handlers.call(this, e, l), t = 0;
                     (i = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = i.elem, o = 0;
                         (r = i.handlers[o++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(r.namespace)) && (e.handleObj = r, e.data = r.data, n = ((it.event.special[r.origType] || {}).handle || r.handler).apply(i.elem, s), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (i = [], o = 0; s > o; o++) r = t[o], n = r.selector + " ", void 0 === i[n] && (i[n] = r.needsContext ? it(n, this).index(l) >= 0 : it.find(n, this, null, [l]).length), i[n] && i.push(r);
                        i.length && a.push({
                            elem: l,
                            handlers: i
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function(e) {
            if (e[it.expando]) return e;
            var t, n, r, i = e.type,
                o = e,
                a = this.fixHooks[i];
            for (a || (this.fixHooks[i] = a = Dt.test(i) ? this.mouseHooks : Lt.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new it.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || ft), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (r = e.target.ownerDocument || ft, i = r.documentElement, n = r.body, e.pageX = t.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== f() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === f() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return it.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return it.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, r) {
            var i = it.extend(new it.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            r ? it.event.trigger(i, null, t) : it.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
        }
    }, it.removeEvent = ft.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var r = "on" + t;
        e.detachEvent && (typeof e[r] === kt && (e[r] = null), e.detachEvent(r, n))
    }, it.Event = function(e, t) {
        return this instanceof it.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? h : d) : this.type = e, t && it.extend(this, t), this.timeStamp = e && e.timeStamp || it.now(), void(this[it.expando] = !0)) : new it.Event(e, t)
    }, it.Event.prototype = {
        isDefaultPrevented: d,
        isPropagationStopped: d,
        isImmediatePropagationStopped: d,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = h, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = h, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = h, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, it.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        it.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = this,
                    i = e.relatedTarget,
                    o = e.handleObj;
                return (!i || i !== r && !it.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), nt.submitBubbles || (it.event.special.submit = {
        setup: function() {
            return it.nodeName(this, "form") ? !1 : void it.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = it.nodeName(t, "input") || it.nodeName(t, "button") ? t.form : void 0;
                n && !it._data(n, "submitBubbles") && (it.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), it._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && it.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return it.nodeName(this, "form") ? !1 : void it.event.remove(this, "._submit")
        }
    }), nt.changeBubbles || (it.event.special.change = {
        setup: function() {
            return Ht.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (it.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), it.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), it.event.simulate("change", this, e, !0)
            })), !1) : void it.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Ht.test(t.nodeName) && !it._data(t, "changeBubbles") && (it.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || it.event.simulate("change", this.parentNode, e, !0)
                }), it._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return it.event.remove(this, "._change"), !Ht.test(this.nodeName)
        }
    }), nt.focusinBubbles || it.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            it.event.simulate(t, e.target, it.event.fix(e), !0)
        };
        it.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this,
                    i = it._data(r, t);
                i || r.addEventListener(e, n, !0), it._data(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this,
                    i = it._data(r, t) - 1;
                i ? it._data(r, t, i) : (r.removeEventListener(e, n, !0), it._removeData(r, t))
            }
        }
    }), it.fn.extend({
        on: function(e, t, n, r, i) {
            var o, a;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = void 0);
                for (o in e) this.on(o, t, n, e[o], i);
                return this
            }
            if (null == n && null == r ? (r = t, n = t = void 0) : null == r && ("string" == typeof t ? (r = n, n = void 0) : (r = n, n = t, t = void 0)), r === !1) r = d;
            else if (!r) return this;
            return 1 === i && (a = r, r = function(e) {
                return it().off(e), a.apply(this, arguments)
            }, r.guid = a.guid || (a.guid = it.guid++)), this.each(function() {
                it.event.add(this, e, r, n, t)
            })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj, it(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = d), this.each(function() {
                it.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                it.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? it.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Rt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Pt = / jQuery\d+="(?:null|\d+)"/g,
        Mt = new RegExp("<(?:" + Rt + ")[\\s/>]", "i"),
        $t = /^\s+/,
        Ft = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        It = /<([\w:]+)/,
        Bt = /<tbody/i,
        zt = /<|&#?\w+;/,
        Wt = /<(?:script|style|link)/i,
        Vt = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ut = /^$|\/(?:java|ecma)script/i,
        Xt = /^true\/(.*)/,
        Jt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Qt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: nt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Gt = m(ft),
        Kt = Gt.appendChild(ft.createElement("div"));
    Qt.optgroup = Qt.option, Qt.tbody = Qt.tfoot = Qt.colgroup = Qt.caption = Qt.thead, Qt.th = Qt.td, it.extend({
        clone: function(e, t, n) {
            var r, i, o, a, s, l = it.contains(e.ownerDocument, e);
            if (nt.html5Clone || it.isXMLDoc(e) || !Mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Kt.innerHTML = e.outerHTML, Kt.removeChild(o = Kt.firstChild)), !(nt.noCloneEvent && nt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || it.isXMLDoc(e)))
                for (r = g(o), s = g(e), a = 0; null != (i = s[a]); ++a) r[a] && k(i, r[a]);
            if (t)
                if (n)
                    for (s = s || g(e), r = r || g(o), a = 0; null != (i = s[a]); a++) S(i, r[a]);
                else S(e, o);
            return r = g(o, "script"), r.length > 0 && w(r, !l && g(e, "script")), r = s = i = null, o
        },
        buildFragment: function(e, t, n, r) {
            for (var i, o, a, s, l, u, c, p = e.length, h = m(t), d = [], f = 0; p > f; f++)
                if (o = e[f], o || 0 === o)
                    if ("object" === it.type(o)) it.merge(d, o.nodeType ? [o] : o);
                    else if (zt.test(o)) {
                        for (s = s || h.appendChild(t.createElement("div")), l = (It.exec(o) || ["", ""])[1].toLowerCase(), c = Qt[l] || Qt._default, s.innerHTML = c[1] + o.replace(Ft, "<$1></$2>") + c[2], i = c[0]; i--;) s = s.lastChild;
                        if (!nt.leadingWhitespace && $t.test(o) && d.push(t.createTextNode($t.exec(o)[0])), !nt.tbody)
                            for (o = "table" !== l || Bt.test(o) ? "<table>" !== c[1] || Bt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length; i--;) it.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u);
                        for (it.merge(d, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                        s = h.lastChild
                    } else d.push(t.createTextNode(o));
            for (s && h.removeChild(s), nt.appendChecked || it.grep(g(d, "input"), y), f = 0; o = d[f++];)
                if ((!r || -1 === it.inArray(o, r)) && (a = it.contains(o.ownerDocument, o), s = g(h.appendChild(o), "script"), a && w(s), n))
                    for (i = 0; o = s[i++];) Ut.test(o.type || "") && n.push(o);
            return s = null, h
        },
        cleanData: function(e, t) {
            for (var n, r, i, o, a = 0, s = it.expando, l = it.cache, u = nt.deleteExpando, c = it.event.special; null != (n = e[a]); a++)
                if ((t || it.acceptData(n)) && (i = n[s], o = i && l[i])) {
                    if (o.events)
                        for (r in o.events) c[r] ? it.event.remove(n, r) : it.removeEvent(n, r, o.handle);
                    l[i] && (delete l[i], u ? delete n[s] : typeof n.removeAttribute !== kt ? n.removeAttribute(s) : n[s] = null, J.push(i))
                }
        }
    }), it.fn.extend({
        text: function(e) {
            return At(this, function(e) {
                return void 0 === e ? it.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ft).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = v(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = v(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, r = e ? it.filter(e, this) : this, i = 0; null != (n = r[i]); i++) t || 1 !== n.nodeType || it.cleanData(g(n)), n.parentNode && (t && it.contains(n.ownerDocument, n) && w(g(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && it.cleanData(g(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && it.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return it.clone(this, e, t)
            })
        },
        html: function(e) {
            return At(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    r = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Pt, "") : void 0;
                if (!("string" != typeof e || Wt.test(e) || !nt.htmlSerialize && Mt.test(e) || !nt.leadingWhitespace && $t.test(e) || Qt[(It.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(Ft, "<$1></$2>");
                    try {
                        for (; r > n; n++) t = this[n] || {}, 1 === t.nodeType && (it.cleanData(g(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (i) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, it.cleanData(g(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = G.apply([], e);
            var n, r, i, o, a, s, l = 0,
                u = this.length,
                c = this,
                p = u - 1,
                h = e[0],
                d = it.isFunction(h);
            if (d || u > 1 && "string" == typeof h && !nt.checkClone && Vt.test(h)) return this.each(function(n) {
                var r = c.eq(n);
                d && (e[0] = h.call(this, n, r.html())), r.domManip(e, t)
            });
            if (u && (s = it.buildFragment(e, this[0].ownerDocument, !1, this), n = s.firstChild, 1 === s.childNodes.length && (s = n), n)) {
                for (o = it.map(g(s, "script"), b), i = o.length; u > l; l++) r = s, l !== p && (r = it.clone(r, !0, !0), i && it.merge(o, g(r, "script"))), t.call(this[l], r, l);
                if (i)
                    for (a = o[o.length - 1].ownerDocument, it.map(o, x), l = 0; i > l; l++) r = o[l], Ut.test(r.type || "") && !it._data(r, "globalEval") && it.contains(a, r) && (r.src ? it._evalUrl && it._evalUrl(r.src) : it.globalEval((r.text || r.textContent || r.innerHTML || "").replace(Jt, "")));
                s = n = null
            }
            return this
        }
    }), it.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        it.fn[e] = function(e) {
            for (var n, r = 0, i = [], o = it(e), a = o.length - 1; a >= r; r++) n = r === a ? this : this.clone(!0), it(o[r])[t](n), K.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var Yt, Zt = {};
    ! function() {
        var e;
        nt.shrinkWrapBlocks = function() {
            if (null != e) return e;
            e = !1;
            var t, n, r;
            return n = ft.getElementsByTagName("body")[0], n && n.style ? (t = ft.createElement("div"), r = ft.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(r).appendChild(t), typeof t.style.zoom !== kt && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(ft.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(r), e) : void 0
        }
    }();
    var en, tn, nn = /^margin/,
        rn = new RegExp("^(" + Ct + ")(?!px)[a-z%]+$", "i"),
        on = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (en = function(t) {
        return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
    }, tn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || en(e), a = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== a || it.contains(e.ownerDocument, e) || (a = it.style(e, t)), rn.test(a) && nn.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 === a ? a : a + ""
    }) : ft.documentElement.currentStyle && (en = function(e) {
        return e.currentStyle
    }, tn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || en(e), a = n ? n[t] : void 0, null == a && s && s[t] && (a = s[t]), rn.test(a) && !on.test(t) && (r = s.left, i = e.runtimeStyle, o = i && i.left, o && (i.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = r, o && (i.left = o)), void 0 === a ? a : a + "" || "auto"
    }),
        function() {
            function t() {
                var t, n, r, i;
                n = ft.getElementsByTagName("body")[0], n && n.style && (t = ft.createElement("div"), r = ft.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(r).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", o = a = !1, l = !0, e.getComputedStyle && (o = "1%" !== (e.getComputedStyle(t, null) || {}).top, a = "4px" === (e.getComputedStyle(t, null) || {
                    width: "4px"
                }).width, i = t.appendChild(ft.createElement("div")), i.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", t.style.width = "1px", l = !parseFloat((e.getComputedStyle(i, null) || {}).marginRight), t.removeChild(i)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = t.getElementsByTagName("td"), i[0].style.cssText = "margin:0;border:0;padding:0;display:none", s = 0 === i[0].offsetHeight, s && (i[0].style.display = "", i[1].style.display = "none", s = 0 === i[0].offsetHeight), n.removeChild(r))
            }
            var n, r, i, o, a, s, l;
            n = ft.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = n.getElementsByTagName("a")[0], r = i && i.style, r && (r.cssText = "float:left;opacity:.5", nt.opacity = "0.5" === r.opacity, nt.cssFloat = !!r.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", nt.clearCloneStyle = "content-box" === n.style.backgroundClip, nt.boxSizing = "" === r.boxSizing || "" === r.MozBoxSizing || "" === r.WebkitBoxSizing, it.extend(nt, {
                reliableHiddenOffsets: function() {
                    return null == s && t(), s
                },
                boxSizingReliable: function() {
                    return null == a && t(), a
                },
                pixelPosition: function() {
                    return null == o && t(), o
                },
                reliableMarginRight: function() {
                    return null == l && t(), l
                }
            }))
        }(), it.swap = function(e, t, n, r) {
        var i, o, a = {};
        for (o in t) a[o] = e.style[o], e.style[o] = t[o];
        i = n.apply(e, r || []);
        for (o in t) e.style[o] = a[o];
        return i
    };
    var an = /alpha\([^)]*\)/i,
        sn = /opacity\s*=\s*([^)]*)/,
        ln = /^(none|table(?!-c[ea]).+)/,
        un = new RegExp("^(" + Ct + ")(.*)$", "i"),
        cn = new RegExp("^([+-])=(" + Ct + ")", "i"),
        pn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        hn = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        dn = ["Webkit", "O", "Moz", "ms"];
    it.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = tn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": nt.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = it.camelCase(t),
                    l = e.style;
                if (t = it.cssProps[s] || (it.cssProps[s] = N(l, s)), a = it.cssHooks[t] || it.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                if (o = typeof n, "string" === o && (i = cn.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(it.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || it.cssNumber[s] || (n += "px"), nt.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && void 0 === (n = a.set(e, n, r))))) try {
                    l[t] = n
                } catch (u) {}
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = it.camelCase(t);
            return t = it.cssProps[s] || (it.cssProps[s] = N(e.style, s)), a = it.cssHooks[t] || it.cssHooks[s], a && "get" in a && (o = a.get(e, !0, n)), void 0 === o && (o = tn(e, t, r)), "normal" === o && t in hn && (o = hn[t]), "" === n || n ? (i = parseFloat(o), n === !0 || it.isNumeric(i) ? i || 0 : o) : o
        }
    }), it.each(["height", "width"], function(e, t) {
        it.cssHooks[t] = {
            get: function(e, n, r) {
                return n ? ln.test(it.css(e, "display")) && 0 === e.offsetWidth ? it.swap(e, pn, function() {
                    return H(e, t, r)
                }) : H(e, t, r) : void 0
            },
            set: function(e, n, r) {
                var i = r && en(e);
                return A(e, n, r ? j(e, t, r, nt.boxSizing && "border-box" === it.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), nt.opacity || (it.cssHooks.opacity = {
        get: function(e, t) {
            return sn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = it.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = r && r.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === it.trim(o.replace(an, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = an.test(o) ? o.replace(an, i) : o + " " + i)
        }
    }), it.cssHooks.marginRight = C(nt.reliableMarginRight, function(e, t) {
        return t ? it.swap(e, {
            display: "inline-block"
        }, tn, [e, "marginRight"]) : void 0
    }), it.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        it.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + Nt[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, nn.test(e) || (it.cssHooks[e + t].set = A)
    }), it.fn.extend({
        css: function(e, t) {
            return At(this, function(e, t, n) {
                var r, i, o = {},
                    a = 0;
                if (it.isArray(t)) {
                    for (r = en(e), i = t.length; i > a; a++) o[t[a]] = it.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? it.style(e, t, n) : it.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return _(this, !0)
        },
        hide: function() {
            return _(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                _t(this) ? it(this).show() : it(this).hide()
            })
        }
    }), it.Tween = L, L.prototype = {
        constructor: L,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (it.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = L.propHooks[this.prop];
            return e && e.get ? e.get(this) : L.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = L.propHooks[this.prop];
            return this.pos = t = this.options.duration ? it.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : L.propHooks._default.set(this), this
        }
    }, L.prototype.init.prototype = L.prototype, L.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = it.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                it.fx.step[e.prop] ? it.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[it.cssProps[e.prop]] || it.cssHooks[e.prop]) ? it.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, L.propHooks.scrollTop = L.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, it.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, it.fx = L.prototype.init, it.fx.step = {};
    var fn, mn, gn = /^(?:toggle|show|hide)$/,
        yn = new RegExp("^(?:([+-])=|)(" + Ct + ")([a-z%]*)$", "i"),
        vn = /queueHooks$/,
        bn = [R],
        xn = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    r = n.cur(),
                    i = yn.exec(t),
                    o = i && i[3] || (it.cssNumber[e] ? "" : "px"),
                    a = (it.cssNumber[e] || "px" !== o && +r) && yn.exec(it.css(n.elem, e)),
                    s = 1,
                    l = 20;
                if (a && a[3] !== o) {
                    o = o || a[3], i = i || [], a = +r || 1;
                    do s = s || ".5", a /= s, it.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --l)
                }
                return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n
            }]
        };
    it.Animation = it.extend(M, {
        tweener: function(e, t) {
            it.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            for (var n, r = 0, i = e.length; i > r; r++) n = e[r], xn[n] = xn[n] || [], xn[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? bn.unshift(e) : bn.push(e)
        }
    }), it.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? it.extend({}, e) : {
            complete: n || !n && t || it.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !it.isFunction(t) && t
        };
        return r.duration = it.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in it.fx.speeds ? it.fx.speeds[r.duration] : it.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            it.isFunction(r.old) && r.old.call(this), r.queue && it.dequeue(this, r.queue)
        }, r
    }, it.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(_t).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = it.isEmptyObject(e),
                o = it.speed(t, n, r),
                a = function() {
                    var t = M(this, it.extend({}, e), o);
                    (i || it._data(this, "finish")) && t.stop(!0)
                };
            return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    i = null != e && e + "queueHooks",
                    o = it.timers,
                    a = it._data(this);
                if (i) a[i] && a[i].stop && r(a[i]);
                else
                    for (i in a) a[i] && a[i].stop && vn.test(i) && r(a[i]);
                for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                (t || !n) && it.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"), this.each(function() {
                var t, n = it._data(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    o = it.timers,
                    a = r ? r.length : 0;
                for (n.finish = !0, it.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), it.each(["toggle", "show", "hide"], function(e, t) {
        var n = it.fn[t];
        it.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(O(t, !0), e, r, i)
        }
    }), it.each({
        slideDown: O("show"),
        slideUp: O("hide"),
        slideToggle: O("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        it.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), it.timers = [], it.fx.tick = function() {
        var e, t = it.timers,
            n = 0;
        for (fn = it.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
        t.length || it.fx.stop(), fn = void 0
    }, it.fx.timer = function(e) {
        it.timers.push(e), e() ? it.fx.start() : it.timers.pop()
    }, it.fx.interval = 13, it.fx.start = function() {
        mn || (mn = setInterval(it.fx.tick, it.fx.interval))
    }, it.fx.stop = function() {
        clearInterval(mn), mn = null
    }, it.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, it.fn.delay = function(e, t) {
        return e = it.fx ? it.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
            var r = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(r)
            }
        })
    },
        function() {
            var e, t, n, r, i;
            t = ft.createElement("div"), t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = t.getElementsByTagName("a")[0], n = ft.createElement("select"), i = n.appendChild(ft.createElement("option")), e = t.getElementsByTagName("input")[0], r.style.cssText = "top:1px", nt.getSetAttribute = "t" !== t.className, nt.style = /top/.test(r.getAttribute("style")), nt.hrefNormalized = "/a" === r.getAttribute("href"), nt.checkOn = !!e.value, nt.optSelected = i.selected, nt.enctype = !!ft.createElement("form").enctype, n.disabled = !0, nt.optDisabled = !i.disabled, e = ft.createElement("input"), e.setAttribute("value", ""), nt.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), nt.radioValue = "t" === e.value
        }();
    var wn = /\r/g;
    it.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0]; {
                if (arguments.length) return r = it.isFunction(e), this.each(function(n) {
                    var i;
                    1 === this.nodeType && (i = r ? e.call(this, n, it(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : it.isArray(i) && (i = it.map(i, function(e) {
                        return null == e ? "" : e + ""
                    })), t = it.valHooks[this.type] || it.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                });
                if (i) return t = it.valHooks[i.type] || it.valHooks[i.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(wn, "") : null == n ? "" : n)
            }
        }
    }), it.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = it.find.attr(e, "value");
                    return null != t ? t : it.trim(it.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0; s > l; l++)
                        if (n = r[l], !(!n.selected && l !== i || (nt.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && it.nodeName(n.parentNode, "optgroup"))) {
                            if (t = it(n).val(), o) return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = it.makeArray(t), a = i.length; a--;)
                        if (r = i[a], it.inArray(it.valHooks.option.get(r), o) >= 0) try {
                            r.selected = n = !0
                        } catch (s) {
                            r.scrollHeight
                        } else r.selected = !1;
                    return n || (e.selectedIndex = -1), i
                }
            }
        }
    }), it.each(["radio", "checkbox"], function() {
        it.valHooks[this] = {
            set: function(e, t) {
                return it.isArray(t) ? e.checked = it.inArray(it(e).val(), t) >= 0 : void 0
            }
        }, nt.checkOn || (it.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var Sn, kn, Tn = it.expr.attrHandle,
        En = /^(?:checked|selected)$/i,
        Cn = nt.getSetAttribute,
        Nn = nt.input;
    it.fn.extend({
        attr: function(e, t) {
            return At(this, it.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                it.removeAttr(this, e)
            })
        }
    }), it.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === kt ? it.prop(e, t, n) : (1 === o && it.isXMLDoc(e) || (t = t.toLowerCase(), r = it.attrHooks[t] || (it.expr.match.bool.test(t) ? kn : Sn)), void 0 === n ? r && "get" in r && null !== (i = r.get(e, t)) ? i : (i = it.find.attr(e, t), null == i ? void 0 : i) : null !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : void it.removeAttr(e, t))
        },
        removeAttr: function(e, t) {
            var n, r, i = 0,
                o = t && t.match(bt);
            if (o && 1 === e.nodeType)
                for (; n = o[i++];) r = it.propFix[n] || n, it.expr.match.bool.test(n) ? Nn && Cn || !En.test(n) ? e[r] = !1 : e[it.camelCase("default-" + n)] = e[r] = !1 : it.attr(e, n, ""), e.removeAttribute(Cn ? n : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!nt.radioValue && "radio" === t && it.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), kn = {
        set: function(e, t, n) {
            return t === !1 ? it.removeAttr(e, n) : Nn && Cn || !En.test(n) ? e.setAttribute(!Cn && it.propFix[n] || n, n) : e[it.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, it.each(it.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Tn[t] || it.find.attr;
        Tn[t] = Nn && Cn || !En.test(t) ? function(e, t, r) {
            var i, o;
            return r || (o = Tn[t], Tn[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, Tn[t] = o), i
        } : function(e, t, n) {
            return n ? void 0 : e[it.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), Nn && Cn || (it.attrHooks.value = {
        set: function(e, t, n) {
            return it.nodeName(e, "input") ? void(e.defaultValue = t) : Sn && Sn.set(e, t, n)
        }
    }), Cn || (Sn = {
        set: function(e, t, n) {
            var r = e.getAttributeNode(n);
            return r || e.setAttributeNode(r = e.ownerDocument.createAttribute(n)), r.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, Tn.id = Tn.name = Tn.coords = function(e, t, n) {
        var r;
        return n ? void 0 : (r = e.getAttributeNode(t)) && "" !== r.value ? r.value : null
    }, it.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: Sn.set
    }, it.attrHooks.contenteditable = {
        set: function(e, t, n) {
            Sn.set(e, "" === t ? !1 : t, n)
        }
    }, it.each(["width", "height"], function(e, t) {
        it.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
            }
        }
    })), nt.style || (it.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var _n = /^(?:input|select|textarea|button|object)$/i,
        An = /^(?:a|area)$/i;
    it.fn.extend({
        prop: function(e, t) {
            return At(this, it.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = it.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (t) {}
            })
        }
    }), it.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var r, i, o, a = e.nodeType;
            if (e && 3 !== a && 8 !== a && 2 !== a) return o = 1 !== a || !it.isXMLDoc(e), o && (t = it.propFix[t] || t, i = it.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = it.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : _n.test(e.nodeName) || An.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), nt.hrefNormalized || it.each(["href", "src"], function(e, t) {
        it.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), nt.optSelected || (it.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), it.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        it.propFix[this.toLowerCase()] = this
    }), nt.enctype || (it.propFix.enctype = "encoding");
    var jn = /[\t\r\n\f]/g;
    it.fn.extend({
        addClass: function(e) {
            var t, n, r, i, o, a, s = 0,
                l = this.length,
                u = "string" == typeof e && e;
            if (it.isFunction(e)) return this.each(function(t) {
                it(this).addClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(bt) || []; l > s; s++)
                    if (n = this[s], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(jn, " ") : " ")) {
                        for (o = 0; i = t[o++];) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        a = it.trim(r), n.className !== a && (n.className = a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, a, s = 0,
                l = this.length,
                u = 0 === arguments.length || "string" == typeof e && e;
            if (it.isFunction(e)) return this.each(function(t) {
                it(this).removeClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(bt) || []; l > s; s++)
                    if (n = this[s], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(jn, " ") : "")) {
                        for (o = 0; i = t[o++];)
                            for (; r.indexOf(" " + i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
                        a = e ? it.trim(r) : "", n.className !== a && (n.className = a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(it.isFunction(e) ? function(n) {
                it(this).toggleClass(e.call(this, n, this.className, t), t)
            } : function() {
                if ("string" === n)
                    for (var t, r = 0, i = it(this), o = e.match(bt) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                else(n === kt || "boolean" === n) && (this.className && it._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : it._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(jn, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    }), it.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        it.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), it.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var Hn = it.now(),
        Ln = /\?/,
        Dn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    it.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, r = null,
            i = it.trim(t + "");
        return i && !it.trim(i.replace(Dn, function(e, t, i, o) {
            return n && t && (r = 0), 0 === r ? e : (n = i || t, r += !o - !i, "")
        })) ? Function("return " + i)() : it.error("Invalid JSON: " + t)
    }, it.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (r = new DOMParser, n = r.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (i) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || it.error("Invalid XML: " + t), n
    };
    var On, qn, Rn = /#.*$/,
        Pn = /([?&])_=[^&]*/,
        Mn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        $n = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Fn = /^(?:GET|HEAD)$/,
        In = /^\/\//,
        Bn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        zn = {},
        Wn = {},
        Vn = "*/".concat("*");
    try {
        qn = location.href
    } catch (Un) {
        qn = ft.createElement("a"), qn.href = "", qn = qn.href
    }
    On = Bn.exec(qn.toLowerCase()) || [], it.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: qn,
            type: "GET",
            isLocal: $n.test(On[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Vn,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": it.parseJSON,
                "text xml": it.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? I(I(e, it.ajaxSettings), t) : I(it.ajaxSettings, e)
        },
        ajaxPrefilter: $(zn),
        ajaxTransport: $(Wn),
        ajax: function(e, t) {
            function n(e, t, n, r) {
                var i, c, y, v, x, S = t;
                2 !== b && (b = 2, s && clearTimeout(s), u = void 0, a = r || "", w.readyState = e > 0 ? 4 : 0, i = e >= 200 && 300 > e || 304 === e, n && (v = B(p, w, n)), v = z(p, v, w, i), i ? (p.ifModified && (x = w.getResponseHeader("Last-Modified"), x && (it.lastModified[o] = x), x = w.getResponseHeader("etag"), x && (it.etag[o] = x)), 204 === e || "HEAD" === p.type ? S = "nocontent" : 304 === e ? S = "notmodified" : (S = v.state, c = v.data, y = v.error, i = !y)) : (y = S, (e || !S) && (S = "error", 0 > e && (e = 0))), w.status = e, w.statusText = (t || S) + "", i ? f.resolveWith(h, [c, S, w]) : f.rejectWith(h, [w, S, y]), w.statusCode(g), g = void 0, l && d.trigger(i ? "ajaxSuccess" : "ajaxError", [w, p, i ? c : y]), m.fireWith(h, [w, S]), l && (d.trigger("ajaxComplete", [w, p]), --it.active || it.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var r, i, o, a, s, l, u, c, p = it.ajaxSetup({}, t),
                h = p.context || p,
                d = p.context && (h.nodeType || h.jquery) ? it(h) : it.event,
                f = it.Deferred(),
                m = it.Callbacks("once memory"),
                g = p.statusCode || {},
                y = {},
                v = {},
                b = 0,
                x = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === b) {
                            if (!c)
                                for (c = {}; t = Mn.exec(a);) c[t[1].toLowerCase()] = t[2];
                            t = c[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === b ? a : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return b || (e = v[n] = v[n] || e, y[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return b || (p.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > b)
                                for (t in e) g[t] = [g[t], e[t]];
                            else w.always(e[w.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || x;
                        return u && u.abort(t), n(0, t), this
                    }
                };
            if (f.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, p.url = ((e || p.url || qn) + "").replace(Rn, "").replace(In, On[1] + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = it.trim(p.dataType || "*").toLowerCase().match(bt) || [""], null == p.crossDomain && (r = Bn.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === On[1] && r[2] === On[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (On[3] || ("http:" === On[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = it.param(p.data, p.traditional)), F(zn, p, t, w), 2 === b) return w;
            l = it.event && p.global, l && 0 === it.active++ && it.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Fn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (Ln.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = Pn.test(o) ? o.replace(Pn, "$1_=" + Hn++) : o + (Ln.test(o) ? "&" : "?") + "_=" + Hn++)), p.ifModified && (it.lastModified[o] && w.setRequestHeader("If-Modified-Since", it.lastModified[o]), it.etag[o] && w.setRequestHeader("If-None-Match", it.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", p.contentType), w.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Vn + "; q=0.01" : "") : p.accepts["*"]);
            for (i in p.headers) w.setRequestHeader(i, p.headers[i]);
            if (p.beforeSend && (p.beforeSend.call(h, w, p) === !1 || 2 === b)) return w.abort();
            x = "abort";
            for (i in {
                success: 1,
                error: 1,
                complete: 1
            }) w[i](p[i]);
            if (u = F(Wn, p, t, w)) {
                w.readyState = 1, l && d.trigger("ajaxSend", [w, p]), p.async && p.timeout > 0 && (s = setTimeout(function() {
                    w.abort("timeout")
                }, p.timeout));
                try {
                    b = 1, u.send(y, n)
                } catch (S) {
                    if (!(2 > b)) throw S;
                    n(-1, S)
                }
            } else n(-1, "No Transport");
            return w
        },
        getJSON: function(e, t, n) {
            return it.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return it.get(e, void 0, t, "script")
        }
    }), it.each(["get", "post"], function(e, t) {
        it[t] = function(e, n, r, i) {
            return it.isFunction(n) && (i = i || r, r = n, n = void 0), it.ajax({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            })
        }
    }), it._evalUrl = function(e) {
        return it.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, it.fn.extend({
        wrapAll: function(e) {
            if (it.isFunction(e)) return this.each(function(t) {
                it(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = it(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(it.isFunction(e) ? function(t) {
                it(this).wrapInner(e.call(this, t))
            } : function() {
                var t = it(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = it.isFunction(e);
            return this.each(function(n) {
                it(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                it.nodeName(this, "body") || it(this).replaceWith(this.childNodes)
            }).end()
        }
    }), it.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !nt.reliableHiddenOffsets() && "none" === (e.style && e.style.display || it.css(e, "display"))
    }, it.expr.filters.visible = function(e) {
        return !it.expr.filters.hidden(e)
    };
    var Xn = /%20/g,
        Jn = /\[\]$/,
        Qn = /\r?\n/g,
        Gn = /^(?:submit|button|image|reset|file)$/i,
        Kn = /^(?:input|select|textarea|keygen)/i;
    it.param = function(e, t) {
        var n, r = [],
            i = function(e, t) {
                t = it.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = it.ajaxSettings && it.ajaxSettings.traditional), it.isArray(e) || e.jquery && !it.isPlainObject(e)) it.each(e, function() {
            i(this.name, this.value)
        });
        else
            for (n in e) W(n, e[n], t, i);
        return r.join("&").replace(Xn, "+")
    }, it.fn.extend({
        serialize: function() {
            return it.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = it.prop(this, "elements");
                return e ? it.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !it(this).is(":disabled") && Kn.test(this.nodeName) && !Gn.test(e) && (this.checked || !jt.test(e))
            }).map(function(e, t) {
                var n = it(this).val();
                return null == n ? null : it.isArray(n) ? it.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Qn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Qn, "\r\n")
                }
            }).get()
        }
    }), it.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && V() || U()
    } : V;
    var Yn = 0,
        Zn = {},
        er = it.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var e in Zn) Zn[e](void 0, !0)
    }), nt.cors = !!er && "withCredentials" in er, er = nt.ajax = !!er, er && it.ajaxTransport(function(e) {
        if (!e.crossDomain || nt.cors) {
            var t;
            return {
                send: function(n, r) {
                    var i, o = e.xhr(),
                        a = ++Yn;
                    if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (i in e.xhrFields) o[i] = e.xhrFields[i];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (i in n) void 0 !== n[i] && o.setRequestHeader(i, n[i] + "");
                    o.send(e.hasContent && e.data || null), t = function(n, i) {
                        var s, l, u;
                        if (t && (i || 4 === o.readyState))
                            if (delete Zn[a], t = void 0, o.onreadystatechange = it.noop, i) 4 !== o.readyState && o.abort();
                            else {
                                u = {}, s = o.status, "string" == typeof o.responseText && (u.text = o.responseText);
                                try {
                                    l = o.statusText
                                } catch (c) {
                                    l = ""
                                }
                                s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = u.text ? 200 : 404
                            }
                        u && r(s, l, u, o.getAllResponseHeaders())
                    }, e.async ? 4 === o.readyState ? setTimeout(t) : o.onreadystatechange = Zn[a] = t : t()
                },
                abort: function() {
                    t && t(void 0, !0)
                }
            }
        }
    }), it.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return it.globalEval(e), e
            }
        }
    }), it.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), it.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = ft.head || it("head")[0] || ft.documentElement;
            return {
                send: function(r, i) {
                    t = ft.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || i(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var tr = [],
        nr = /(=)\?(?=&|$)|\?\?/;
    it.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = tr.pop() || it.expando + "_" + Hn++;
            return this[e] = !0, e
        }
    }), it.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, a, s = t.jsonp !== !1 && (nr.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && nr.test(t.data) && "data");
        return s || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback = it.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(nr, "$1" + i) : t.jsonp !== !1 && (t.url += (Ln.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
            return a || it.error(i + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
            a = arguments
        }, r.always(function() {
            e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, tr.push(i)), a && it.isFunction(o) && o(a[0]), a = o = void 0
        }), "script") : void 0
    }), it.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || ft;
        var r = pt.exec(e),
            i = !n && [];
        return r ? [t.createElement(r[1])] : (r = it.buildFragment([e], t, i), i && i.length && it(i).remove(), it.merge([], r.childNodes))
    };
    var rr = it.fn.load;
    it.fn.load = function(e, t, n) {
        if ("string" != typeof e && rr) return rr.apply(this, arguments);
        var r, i, o, a = this,
            s = e.indexOf(" ");
        return s >= 0 && (r = it.trim(e.slice(s, e.length)), e = e.slice(0, s)), it.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && it.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            i = arguments, a.html(r ? it("<div>").append(it.parseHTML(e)).find(r) : e)
        }).complete(n && function(e, t) {
            a.each(n, i || [e.responseText, t, e])
        }), this
    }, it.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        it.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), it.expr.filters.animated = function(e) {
        return it.grep(it.timers, function(t) {
            return e === t.elem
        }).length
    };
    var ir = e.document.documentElement;
    it.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, l, u, c = it.css(e, "position"),
                p = it(e),
                h = {};
            "static" === c && (e.style.position = "relative"), s = p.offset(), o = it.css(e, "top"), l = it.css(e, "left"), u = ("absolute" === c || "fixed" === c) && it.inArray("auto", [o, l]) > -1, u ? (r = p.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(l) || 0), it.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (h.top = t.top - s.top + a), null != t.left && (h.left = t.left - s.left + i), "using" in t ? t.using.call(e, h) : p.css(h)
        }
    }, it.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                it.offset.setOffset(this, e, t)
            });
            var t, n, r = {
                    top: 0,
                    left: 0
                },
                i = this[0],
                o = i && i.ownerDocument;
            if (o) return t = o.documentElement, it.contains(t, i) ? (typeof i.getBoundingClientRect !== kt && (r = i.getBoundingClientRect()), n = X(o), {
                top: r.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: r.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : r
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    r = this[0];
                return "fixed" === it.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), it.nodeName(e[0], "html") || (n = e.offset()), n.top += it.css(e[0], "borderTopWidth", !0), n.left += it.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - it.css(r, "marginTop", !0),
                    left: t.left - n.left - it.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || ir; e && !it.nodeName(e, "html") && "static" === it.css(e, "position");) e = e.offsetParent;
                return e || ir
            })
        }
    }), it.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        it.fn[e] = function(r) {
            return At(this, function(e, r, i) {
                var o = X(e);
                return void 0 === i ? o ? t in o ? o[t] : o.document.documentElement[r] : e[r] : void(o ? o.scrollTo(n ? it(o).scrollLeft() : i, n ? i : it(o).scrollTop()) : e[r] = i)
            }, e, r, arguments.length, null)
        }
    }), it.each(["top", "left"], function(e, t) {
        it.cssHooks[t] = C(nt.pixelPosition, function(e, n) {
            return n ? (n = tn(e, t), rn.test(n) ? it(e).position()[t] + "px" : n) : void 0
        })
    }), it.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        it.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            it.fn[r] = function(r, i) {
                var o = arguments.length && (n || "boolean" != typeof r),
                    a = n || (r === !0 || i === !0 ? "margin" : "border");
                return At(this, function(t, n, r) {
                    var i;
                    return it.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? it.css(t, n, a) : it.style(t, n, r, a)
                }, t, o ? r : void 0, o, null)
            }
        })
    }), it.fn.size = function() {
        return this.length
    }, it.fn.andSelf = it.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return it
    });
    var or = e.jQuery,
        ar = e.$;
    return it.noConflict = function(t) {
        return e.$ === it && (e.$ = ar), t && e.jQuery === it && (e.jQuery = or), it
    }, typeof t === kt && (e.jQuery = e.$ = it), it
}),
    function(e, t) {
        e.rails !== t && e.error("jquery-ujs has already been loaded!");
        var n, r = e(document);
        e.rails = n = {
            linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
            buttonClickSelector: "button[data-remote]:not(form button), button[data-confirm]:not(form button)",
            inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
            formSubmitSelector: "form",
            formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
            disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
            enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
            requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
            fileInputSelector: "input[type=file]",
            linkDisableSelector: "a[data-disable-with], a[data-disable]",
            buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
            CSRFProtection: function(t) {
                var n = e('meta[name="csrf-token"]').attr("content");
                n && t.setRequestHeader("X-CSRF-Token", n)
            },
            refreshCSRFTokens: function() {
                var t = e("meta[name=csrf-token]").attr("content"),
                    n = e("meta[name=csrf-param]").attr("content");
                e('form input[name="' + n + '"]').val(t)
            },
            fire: function(t, n, r) {
                var i = e.Event(n);
                return t.trigger(i, r), i.result !== !1
            },
            confirm: function(e) {
                return confirm(e)
            },
            ajax: function(t) {
                return e.ajax(t)
            },
            href: function(e) {
                return e.attr("href")
            },
            handleRemote: function(r) {
                var i, o, a, s, l, u, c, p;
                if (n.fire(r, "ajax:before")) {
                    if (s = r.data("cross-domain"), l = s === t ? null : s, u = r.data("with-credentials") || null, c = r.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, r.is("form")) {
                        i = r.attr("method"), o = r.attr("action"), a = r.serializeArray();
                        var h = r.data("ujs:submit-button");
                        h && (a.push(h), r.data("ujs:submit-button", null))
                    } else r.is(n.inputChangeSelector) ? (i = r.data("method"), o = r.data("url"), a = r.serialize(), r.data("params") && (a = a + "&" + r.data("params"))) : r.is(n.buttonClickSelector) ? (i = r.data("method") || "get", o = r.data("url"), a = r.serialize(), r.data("params") && (a = a + "&" + r.data("params"))) : (i = r.data("method"), o = n.href(r), a = r.data("params") || null);
                    return p = {
                        type: i || "GET",
                        data: a,
                        dataType: c,
                        beforeSend: function(e, i) {
                            return i.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + i.accepts.script), n.fire(r, "ajax:beforeSend", [e, i]) ? void r.trigger("ajax:send", e) : !1
                        },
                        success: function(e, t, n) {
                            r.trigger("ajax:success", [e, t, n])
                        },
                        complete: function(e, t) {
                            r.trigger("ajax:complete", [e, t])
                        },
                        error: function(e, t, n) {
                            r.trigger("ajax:error", [e, t, n])
                        },
                        crossDomain: l
                    }, u && (p.xhrFields = {
                        withCredentials: u
                    }), o && (p.url = o), n.ajax(p)
                }
                return !1
            },
            handleMethod: function(r) {
                var i = n.href(r),
                    o = r.data("method"),
                    a = r.attr("target"),
                    s = e("meta[name=csrf-token]").attr("content"),
                    l = e("meta[name=csrf-param]").attr("content"),
                    u = e('<form method="post" action="' + i + '"></form>'),
                    c = '<input name="_method" value="' + o + '" type="hidden" />';
                l !== t && s !== t && (c += '<input name="' + l + '" value="' + s + '" type="hidden" />'), a && u.attr("target", a), u.hide().append(c).appendTo("body"), u.submit()
            },
            formElements: function(t, n) {
                return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
            },
            disableFormElements: function(t) {
                n.formElements(t, n.disableSelector).each(function() {
                    n.disableFormElement(e(this))
                })
            },
            disableFormElement: function(e) {
                var n, r;
                n = e.is("button") ? "html" : "val", r = e.data("disable-with"), e.data("ujs:enable-with", e[n]()), r !== t && e[n](r), e.prop("disabled", !0)
            },
            enableFormElements: function(t) {
                n.formElements(t, n.enableSelector).each(function() {
                    n.enableFormElement(e(this))
                })
            },
            enableFormElement: function(e) {
                var t = e.is("button") ? "html" : "val";
                e.data("ujs:enable-with") && e[t](e.data("ujs:enable-with")), e.prop("disabled", !1)
            },
            allowAction: function(e) {
                var t, r = e.data("confirm"),
                    i = !1;
                return r ? (n.fire(e, "confirm") && (i = n.confirm(r), t = n.fire(e, "confirm:complete", [i])), i && t) : !0
            },
            blankInputs: function(t, n, r) {
                var i, o, a = e(),
                    s = n || "input,textarea",
                    l = t.find(s);
                return l.each(function() {
                    if (i = e(this), o = i.is("input[type=checkbox],input[type=radio]") ? i.is(":checked") : i.val(), !o == !r) {
                        if (i.is("input[type=radio]") && l.filter('input[type=radio]:checked[name="' + i.attr("name") + '"]').length) return !0;
                        a = a.add(i)
                    }
                }), a.length ? a : !1
            },
            nonBlankInputs: function(e, t) {
                return n.blankInputs(e, t, !0)
            },
            stopEverything: function(t) {
                return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
            },
            disableElement: function(e) {
                var r = e.data("disable-with");
                e.data("ujs:enable-with", e.html()), r !== t && e.html(r), e.bind("click.railsDisable", function(e) {
                    return n.stopEverything(e)
                })
            },
            enableElement: function(e) {
                e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable")
            }
        }, n.fire(r, "rails:attachBindings") && (e.ajaxPrefilter(function(e, t, r) {
            e.crossDomain || n.CSRFProtection(r)
        }), e(window).on("pageshow.rails", function() {
            e(e.rails.enableSelector).each(function() {
                var t = e(this);
                t.data("ujs:enable-with") && e.rails.enableFormElement(t)
            }), e(e.rails.linkDisableSelector).each(function() {
                var t = e(this);
                t.data("ujs:enable-with") && e.rails.enableElement(t)
            })
        }), r.delegate(n.linkDisableSelector, "ajax:complete", function() {
            n.enableElement(e(this))
        }), r.delegate(n.buttonDisableSelector, "ajax:complete", function() {
            n.enableFormElement(e(this))
        }), r.delegate(n.linkClickSelector, "click.rails", function(r) {
            var i = e(this),
                o = i.data("method"),
                a = i.data("params"),
                s = r.metaKey || r.ctrlKey;
            if (!n.allowAction(i)) return n.stopEverything(r);
            if (!s && i.is(n.linkDisableSelector) && n.disableElement(i), i.data("remote") !== t) {
                if (s && (!o || "GET" === o) && !a) return !0;
                var l = n.handleRemote(i);
                return l === !1 ? n.enableElement(i) : l.fail(function() {
                    n.enableElement(i)
                }), !1
            }
            return o ? (n.handleMethod(i), !1) : void 0
        }), r.delegate(n.buttonClickSelector, "click.rails", function(t) {
            var r = e(this);
            if (!n.allowAction(r)) return n.stopEverything(t);
            r.is(n.buttonDisableSelector) && n.disableFormElement(r);
            var i = n.handleRemote(r);
            return i === !1 ? n.enableFormElement(r) : i.fail(function() {
                n.enableFormElement(r)
            }), !1
        }), r.delegate(n.inputChangeSelector, "change.rails", function(t) {
            var r = e(this);
            return n.allowAction(r) ? (n.handleRemote(r), !1) : n.stopEverything(t)
        }), r.delegate(n.formSubmitSelector, "submit.rails", function(r) {
            var i, o, a = e(this),
                s = a.data("remote") !== t;
            if (!n.allowAction(a)) return n.stopEverything(r);
            if (a.attr("novalidate") == t && (i = n.blankInputs(a, n.requiredInputSelector), i && n.fire(a, "ajax:aborted:required", [i]))) return n.stopEverything(r);
            if (s) {
                if (o = n.nonBlankInputs(a, n.fileInputSelector)) {
                    setTimeout(function() {
                        n.disableFormElements(a)
                    }, 13);
                    var l = n.fire(a, "ajax:aborted:file", [o]);
                    return l || setTimeout(function() {
                        n.enableFormElements(a)
                    }, 13), l
                }
                return n.handleRemote(a), !1
            }
            setTimeout(function() {
                n.disableFormElements(a)
            }, 13)
        }), r.delegate(n.formInputClickSelector, "click.rails", function(t) {
            var r = e(this);
            if (!n.allowAction(r)) return n.stopEverything(t);
            var i = r.attr("name"),
                o = i ? {
                    name: i,
                    value: r.val()
                } : null;
            r.closest("form").data("ujs:submit-button", o)
        }), r.delegate(n.formSubmitSelector, "ajax:send.rails", function(t) {
            this == t.target && n.disableFormElements(e(this))
        }), r.delegate(n.formSubmitSelector, "ajax:complete.rails", function(t) {
            this == t.target && n.enableFormElements(e(this))
        }), e(function() {
            n.refreshCSRFTokens()
        }))
    }(jQuery),
    function() {
        var e, t, n, r, i, o, a, s, l, u, c, p, h, d, f, m, g, y, v, b, x, w, S, k, T, E, C, N, _, A, j, H, L, D, O, q, R, P, M, $, F, I, B, z, W, V, U, X, J, Q, G, K, Y, Z, et, tt, nt = [].indexOf || function(e) {
                    for (var t = 0, n = this.length; n > t; t++)
                        if (t in this && this[t] === e) return t;
                    return -1
                },
            rt = function(e, t) {
                function n() {
                    this.constructor = e
                }
                for (var r in t) it.call(t, r) && (e[r] = t[r]);
                return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
            },
            it = {}.hasOwnProperty,
            ot = [].slice,
            at = function(e, t) {
                return function() {
                    return e.apply(t, arguments)
                }
            };
        D = {}, h = 10, K = !1, M = null, v = null, H = null, I = null, tt = null, r = {
            BEFORE_CHANGE: "page:before-change",
            FETCH: "page:fetch",
            RECEIVE: "page:receive",
            CHANGE: "page:change",
            UPDATE: "page:update",
            LOAD: "page:load",
            RESTORE: "page:restore",
            BEFORE_UNLOAD: "page:before-unload",
            EXPIRE: "page:expire"
        }, k = function(e) {
            var t;
            return e = new n(e), U(), p(), null != M && M.start(), K && (t = Y(e.absolute)) ? (T(t), E(e, null, !1)) : E(e, Q)
        }, Y = function(e) {
            var t;
            return t = D[e], t && !t.transitionCacheDisabled ? t : void 0
        }, x = function(e) {
            return null == e && (e = !0), K = e
        }, b = function(e) {
            return null == e && (e = !0), u ? e ? null != M ? M : M = new o("html") : (null != M && M.uninstall(), M = null) : void 0
        }, E = function(e, t, n) {
            return null == n && (n = !0), Z(r.FETCH, {
                url: e.absolute
            }), null != tt && tt.abort(), tt = new XMLHttpRequest, tt.open("GET", e.withoutHashForIE10compatibility(), !0), tt.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml"), tt.setRequestHeader("X-XHR-Referer", I), tt.onload = function() {
                var n;
                return Z(r.RECEIVE, {
                    url: e.absolute
                }), (n = P()) ? (B(e), z(), d.apply(null, S(n)), L(), "function" == typeof t && t(), Z(r.LOAD)) : document.location.href = y() || e.absolute
            }, M && n && (tt.onprogress = function() {
                return function(e) {
                    var t;
                    return t = e.lengthComputable ? e.loaded / e.total * 100 : M.value + (100 - M.value) / 10, M.advanceTo(t)
                }
            }(this)), tt.onloadend = function() {
                return tt = null
            }, tt.onerror = function() {
                return document.location.href = e.absolute
            }, tt.send()
        }, T = function(e) {
            return null != tt && tt.abort(), d(e.title, e.body), $(e), Z(r.RESTORE)
        }, p = function() {
            var e;
            return e = new n(v.url), D[e.absolute] = {
                url: e.relative,
                body: document.body,
                title: document.title,
                positionY: window.pageYOffset,
                positionX: window.pageXOffset,
                cachedAt: (new Date).getTime(),
                transitionCacheDisabled: null != document.querySelector("[data-no-transition-cache]")
            }, m(h)
        }, q = function(e) {
            return null == e && (e = h), /^[\d]+$/.test(e) ? h = parseInt(e) : void 0
        }, m = function(e) {
            var t, n, i, o, a, s;
            for (a = Object.keys(D), t = a.map(function(e) {
                return D[e].cachedAt
            }).sort(function(e, t) {
                return t - e
            }), s = [], n = 0, o = a.length; o > n; n++) i = a[n], D[i].cachedAt <= t[e] && (Z(r.EXPIRE, D[i]), s.push(delete D[i]));
            return s
        }, d = function(t, n, i, o) {
            return Z(r.BEFORE_UNLOAD), document.title = t, document.documentElement.replaceChild(n, document.body), null != i && e.update(i), G(), o && w(), v = window.history.state, null != M && M.done(), Z(r.CHANGE), Z(r.UPDATE)
        }, w = function() {
            var e, t, n, r, i, o, a, s, l, u, c, p;
            for (p = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])')), n = 0, i = p.length; i > n; n++)
                if (c = p[n], "" === (l = c.type) || "text/javascript" === l) {
                    for (t = document.createElement("script"), u = c.attributes, r = 0, o = u.length; o > r; r++) e = u[r], t.setAttribute(e.name, e.value);
                    c.hasAttribute("async") || (t.async = !1), t.appendChild(document.createTextNode(c.innerHTML)), s = c.parentNode, a = c.nextSibling, s.removeChild(c), s.insertBefore(t, a)
                }
        }, X = function(e) {
            return e.innerHTML = e.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/gi, ""), e
        }, G = function() {
            var e, t;
            return e = (t = document.querySelectorAll("input[autofocus], textarea[autofocus]"))[t.length - 1], e && document.activeElement !== e ? e.focus() : void 0
        }, B = function(e) {
            return (e = new n(e)).absolute !== I ? window.history.pushState({
                turbolinks: !0,
                url: e.absolute
            }, "", e.absolute) : void 0
        }, z = function() {
            var e, t;
            return (e = tt.getResponseHeader("X-XHR-Redirected-To")) ? (e = new n(e), t = e.hasNoHash() ? document.location.hash : "", window.history.replaceState(window.history.state, "", e.href + t)) : void 0
        }, y = function() {
            var e;
            return null != (e = tt.getResponseHeader("Location")) && new n(e).crossOrigin() ? e : void 0
        }, U = function() {
            return I = document.location.href
        }, V = function() {
            return window.history.replaceState({
                turbolinks: !0,
                url: document.location.href
            }, "", document.location.href)
        }, W = function() {
            return v = window.history.state
        }, L = function() {
            var e;
            return navigator.userAgent.match(/Firefox/) && !(e = new n).hasNoHash() ? (window.history.replaceState(v, "", e.withoutHash()), document.location.hash = e.hash) : void 0
        }, $ = function(e) {
            return window.scrollTo(e.positionX, e.positionY)
        }, Q = function() {
            return document.location.hash ? document.location.href = document.location.href : window.scrollTo(0, 0)
        }, f = function(e) {
            var t, n, r;
            if (null == e || "object" != typeof e) return e;
            t = new e.constructor;
            for (n in e) r = e[n], t[n] = f(r);
            return t
        }, R = function(e) {
            var t, n;
            return n = (null != (t = document.cookie.match(new RegExp(e + "=(\\w+)"))) ? t[1].toUpperCase() : void 0) || "", document.cookie = e + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/", n
        }, Z = function(e, t) {
            var n;
            return "undefined" != typeof Prototype && Event.fire(document, e, t, !0), n = document.createEvent("Events"), t && (n.data = t), n.initEvent(e, !0, !0), document.dispatchEvent(n)
        }, O = function(e) {
            return !Z(r.BEFORE_CHANGE, {
                url: e
            })
        }, P = function() {
            var e, t, n, r, i, o;
            return t = function() {
                var e;
                return 400 <= (e = tt.status) && 600 > e
            }, o = function() {
                var e;
                return null != (e = tt.getResponseHeader("Content-Type")) && e.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)
            }, r = function(e) {
                var t, n, r, i, o;
                for (i = e.querySelector("head").childNodes, o = [], t = 0, n = i.length; n > t; t++) r = i[t], null != ("function" == typeof r.getAttribute ? r.getAttribute("data-turbolinks-track") : void 0) && o.push(r.getAttribute("src") || r.getAttribute("href"));
                return o
            }, e = function(e) {
                var t;
                return H || (H = r(document)), t = r(e), t.length !== H.length || i(t, H).length !== H.length
            }, i = function(e, t) {
                var n, r, i, o, a;
                for (e.length > t.length && (i = [t, e], e = i[0], t = i[1]), o = [], n = 0, r = e.length; r > n; n++) a = e[n], nt.call(t, a) >= 0 && o.push(a);
                return o
            }, !t() && o() && (n = g(tt.responseText), n && !e(n)) ? n : void 0
        }, S = function(t) {
            var n;
            return n = t.querySelector("title"), [null != n ? n.textContent : void 0, X(t.querySelector("body")), e.get(t).token, "runScripts"]
        }, e = {
            get: function(e) {
                var t;
                return null == e && (e = document), {
                    node: t = e.querySelector('meta[name="csrf-token"]'),
                    token: null != t && "function" == typeof t.getAttribute ? t.getAttribute("content") : void 0
                }
            },
            update: function(e) {
                var t;
                return t = this.get(), null != t.token && null != e && t.token !== e ? t.node.setAttribute("content", e) : void 0
            }
        }, g = function(e) {
            var t;
            return t = document.documentElement.cloneNode(), t.innerHTML = e, t.head = t.querySelector("head"), t.body = t.querySelector("body"), t
        }, n = function() {
            function e(t) {
                return this.original = null != t ? t : document.location.href, this.original.constructor === e ? this.original : void this._parse()
            }
            return e.prototype.withoutHash = function() {
                return this.href.replace(this.hash, "").replace("#", "")
            }, e.prototype.withoutHashForIE10compatibility = function() {
                return this.withoutHash()
            }, e.prototype.hasNoHash = function() {
                return 0 === this.hash.length
            }, e.prototype.crossOrigin = function() {
                return this.origin !== (new e).origin
            }, e.prototype._parse = function() {
                var e;
                return (null != this.link ? this.link : this.link = document.createElement("a")).href = this.original, e = this.link, this.href = e.href, this.protocol = e.protocol, this.host = e.host, this.hostname = e.hostname, this.port = e.port, this.pathname = e.pathname, this.search = e.search, this.hash = e.hash, this.origin = [this.protocol, "//", this.hostname].join(""), 0 !== this.port.length && (this.origin += ":" + this.port), this.relative = [this.pathname, this.search, this.hash].join(""), this.absolute = this.href
            }, e
        }(), i = function(e) {
            function t(e) {
                return this.link = e, this.link.constructor === t ? this.link : (this.original = this.link.href, this.originalElement = this.link, this.link = this.link.cloneNode(!1), void t.__super__.constructor.apply(this, arguments))
            }
            return rt(t, e), t.HTML_EXTENSIONS = ["html"], t.allowExtensions = function() {
                var e, n, r, i;
                for (n = 1 <= arguments.length ? ot.call(arguments, 0) : [], r = 0, i = n.length; i > r; r++) e = n[r], t.HTML_EXTENSIONS.push(e);
                return t.HTML_EXTENSIONS
            }, t.prototype.shouldIgnore = function() {
                return this.crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target()
            }, t.prototype._anchored = function() {
                return (this.hash.length > 0 || "#" === this.href.charAt(this.href.length - 1)) && this.withoutHash() === (new n).withoutHash()
            }, t.prototype._nonHtml = function() {
                return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + t.HTML_EXTENSIONS.join("|") + ")?$", "g"))
            }, t.prototype._optOut = function() {
                var e, t;
                for (t = this.originalElement; !e && t !== document;) e = null != t.getAttribute("data-no-turbolink"), t = t.parentNode;
                return e
            }, t.prototype._target = function() {
                return 0 !== this.link.target.length
            }, t
        }(n), t = function() {
            function e(e) {
                this.event = e, this.event.defaultPrevented || (this._extractLink(), this._validForTurbolinks() && (O(this.link.absolute) || et(this.link.href), this.event.preventDefault()))
            }
            return e.installHandlerLast = function(t) {
                return t.defaultPrevented ? void 0 : (document.removeEventListener("click", e.handle, !1), document.addEventListener("click", e.handle, !1))
            }, e.handle = function(t) {
                return new e(t)
            }, e.prototype._extractLink = function() {
                var e;
                for (e = this.event.target; e.parentNode && "A" !== e.nodeName;) e = e.parentNode;
                return "A" === e.nodeName && 0 !== e.href.length ? this.link = new i(e) : void 0
            }, e.prototype._validForTurbolinks = function() {
                return null != this.link && !(this.link.shouldIgnore() || this._nonStandardClick())
            }, e.prototype._nonStandardClick = function() {
                return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey
            }, e
        }(), o = function() {
            function e(e) {
                this.elementSelector = e, this._trickle = at(this._trickle, this), this.value = 0, this.content = "", this.speed = 300, this.opacity = .99, this.install()
            }
            var t;
            return t = "turbolinks-progress-bar", e.prototype.install = function() {
                return this.element = document.querySelector(this.elementSelector), this.element.classList.add(t), this.styleElement = document.createElement("style"), document.head.appendChild(this.styleElement), this._updateStyle()
            }, e.prototype.uninstall = function() {
                return this.element.classList.remove(t), document.head.removeChild(this.styleElement)
            }, e.prototype.start = function() {
                return this.advanceTo(5)
            }, e.prototype.advanceTo = function(e) {
                var t;
                if (e > (t = this.value) && 100 >= t) {
                    if (this.value = e, this._updateStyle(), 100 === this.value) return this._stopTrickle();
                    if (this.value > 0) return this._startTrickle()
                }
            }, e.prototype.done = function() {
                return this.value > 0 ? (this.advanceTo(100), this._reset()) : void 0
            }, e.prototype._reset = function() {
                var e;
                return e = this.opacity, setTimeout(function(e) {
                    return function() {
                        return e.opacity = 0, e._updateStyle()
                    }
                }(this), this.speed / 2), setTimeout(function(t) {
                    return function() {
                        return t.value = 0, t.opacity = e, t._withSpeed(0, function() {
                            return t._updateStyle(!0)
                        })
                    }
                }(this), this.speed)
            }, e.prototype._startTrickle = function() {
                return this.trickling ? void 0 : (this.trickling = !0, setTimeout(this._trickle, this.speed))
            }, e.prototype._stopTrickle = function() {
                return delete this.trickling
            }, e.prototype._trickle = function() {
                return this.trickling ? (this.advanceTo(this.value + Math.random() / 2), setTimeout(this._trickle, this.speed)) : void 0
            }, e.prototype._withSpeed = function(e, t) {
                var n, r;
                return n = this.speed, this.speed = e, r = t(), this.speed = n, r
            }, e.prototype._updateStyle = function(e) {
                return null == e && (e = !1), e && this._changeContentToForceRepaint(), this.styleElement.textContent = this._createCSSRule()
            }, e.prototype._changeContentToForceRepaint = function() {
                return this.content = "" === this.content ? " " : ""
            }, e.prototype._createCSSRule = function() {
                return this.elementSelector + "." + t + "::before {\n  content: '" + this.content + "';\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2000;\n  background-color: #0076ff;\n  height: 3px;\n  opacity: " + this.opacity + ";\n  width: " + this.value + "%;\n  transition: width " + this.speed + "ms ease-out, opacity " + this.speed / 2 + "ms ease-in;\n  transform: translate3d(0,0,0);\n}"
            }, e
        }(), c = function(e) {
            return setTimeout(e, 500)
        }, _ = function() {
            return document.addEventListener("DOMContentLoaded", function() {
                return Z(r.CHANGE), Z(r.UPDATE)
            }, !0)
        }, j = function() {
            return "undefined" != typeof jQuery ? jQuery(document).on("ajaxSuccess", function(e, t) {
                return jQuery.trim(t.responseText) ? Z(r.UPDATE) : void 0
            }) : void 0
        }, A = function(e) {
            var t, r;
            return (null != (r = e.state) ? r.turbolinks : void 0) ? (t = D[new n(e.state.url).absolute]) ? (p(), T(t)) : et(e.target.location.href) : void 0
        }, N = function() {
            return V(), W(), document.addEventListener("click", t.installHandlerLast, !0), window.addEventListener("hashchange", function() {
                return V(), W()
            }, !1), c(function() {
                return window.addEventListener("popstate", A, !1)
            })
        }, C = void 0 !== window.history.state || navigator.userAgent.match(/Firefox\/2[6|7]/), l = window.history && window.history.pushState && window.history.replaceState && C, a = !navigator.userAgent.match(/CriOS\//), J = "GET" === (F = R("request_method")) || "" === F, u = l && a && J, s = document.addEventListener && document.createEvent, s && (_(), j()), u ? (et = k, N()) : et = function(e) {
            return document.location.href = e
        }, this.Turbolinks = {
            visit: et,
            pagesCached: q,
            enableTransitionCache: x,
            enableProgressBar: b,
            allowLinkExtensions: i.allowExtensions,
            supported: u,
            EVENTS: f(r)
        }
    }.call(this);
var require = function(e, t) {
    var n = require.resolve(e, t || "/"),
        r = require.modules[n];
    if (!r) throw new Error("Failed to resolve module " + e + ", tried " + n);
    var i = r._cached ? r._cached : r();
    return i
};
require.paths = [], require.modules = {}, require.extensions = [".js", ".coffee"], require._core = {
    assert: !0,
    events: !0,
    fs: !0,
    path: !0,
    vm: !0
}, require.resolve = function() {
    return function(e, t) {
        function n(e) {
            if (require.modules[e]) return e;
            for (var t = 0; t < require.extensions.length; t++) {
                var n = require.extensions[t];
                if (require.modules[e + n]) return e + n
            }
        }

        function r(e) {
            e = e.replace(/\/+$/, "");
            var t = e + "/package.json";
            if (require.modules[t]) {
                var r = require.modules[t](),
                    i = r.browserify;
                if ("object" == typeof i && i.main) {
                    var o = n(a.resolve(e, i.main));
                    if (o) return o
                } else if ("string" == typeof i) {
                    var o = n(a.resolve(e, i));
                    if (o) return o
                } else if (r.main) {
                    var o = n(a.resolve(e, r.main));
                    if (o) return o
                }
            }
            return n(e + "/index")
        }

        function i(e, t) {
            for (var i = o(t), a = 0; a < i.length; a++) {
                var s = i[a],
                    l = n(s + "/" + e);
                if (l) return l;
                var u = r(s + "/" + e);
                if (u) return u
            }
            var l = n(e);
            return l ? l : void 0
        }

        function o(e) {
            var t;
            t = "/" === e ? [""] : a.normalize(e).split("/");
            for (var n = [], r = t.length - 1; r >= 0; r--)
                if ("node_modules" !== t[r]) {
                    var i = t.slice(0, r + 1).join("/") + "/node_modules";
                    n.push(i)
                }
            return n
        }
        if (t || (t = "/"), require._core[e]) return e;
        var a = require.modules.path(),
            s = t || ".";
        if (e.match(/^(?:\.\.?\/|\/)/)) {
            var l = n(a.resolve(s, e)) || r(a.resolve(s, e));
            if (l) return l
        }
        var u = i(e, s);
        if (u) return u;
        throw new Error("Cannot find module '" + e + "'")
    }
}(), require.alias = function(e, t) {
    var n = require.modules.path(),
        r = null;
    try {
        r = require.resolve(e + "/package.json", "/")
    } catch (i) {
        r = require.resolve(e, "/")
    }
    for (var o = n.dirname(r), a = (Object.keys || function(e) {
        var t = [];
        for (var n in e) t.push(n);
        return t
    })(require.modules), s = 0; s < a.length; s++) {
        var l = a[s];
        if (l.slice(0, o.length + 1) === o + "/") {
            var u = l.slice(o.length);
            require.modules[t + u] = require.modules[o + u]
        } else l === o && (require.modules[t] = require.modules[o])
    }
}, require.define = function(e, t) {
    var n = require._core[e] ? "" : require.modules.path().dirname(e),
        r = function(e) {
            return require(e, n)
        };
    r.resolve = function(e) {
        return require.resolve(e, n)
    }, r.modules = require.modules, r.define = require.define;
    var i = {
        exports: {}
    };
    require.modules[e] = function() {
        return require.modules[e]._cached = i.exports, t.call(i.exports, r, i, i.exports, n, e), require.modules[e]._cached = i.exports, i.exports
    }
}, "undefined" == typeof process && (process = {}), process.nextTick || (process.nextTick = function() {
    var e = [],
        t = "undefined" != typeof window && window.postMessage && window.addEventListener;
    return t && window.addEventListener("message", function(t) {
        if (t.source === window && "browserify-tick" === t.data && (t.stopPropagation(), e.length > 0)) {
            var n = e.shift();
            n()
        }
    }, !0),
        function(n) {
            t ? (e.push(n), window.postMessage("browserify-tick", "*")) : setTimeout(n, 0)
        }
}()), process.title || (process.title = "browser"), process.binding || (process.binding = function(e) {
    if ("evals" === e) return require("vm");
    throw new Error("No such module")
}), process.cwd || (process.cwd = function() {
    return "."
}), require.define("path", function(e, t, n) {
    function r(e, t) {
        for (var n = [], r = 0; r < e.length; r++) t(e[r], r, e) && n.push(e[r]);
        return n
    }

    function i(e, t) {
        for (var n = 0, r = e.length; r >= 0; r--) {
            var i = e[r];
            "." == i ? e.splice(r, 1) : ".." === i ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--)
        }
        if (t)
            for (; n--; n) e.unshift("..");
        return e
    }
    var o = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
    n.resolve = function() {
        for (var e = "", t = !1, n = arguments.length; n >= -1 && !t; n--) {
            var o = n >= 0 ? arguments[n] : process.cwd();
            "string" == typeof o && o && (e = o + "/" + e, t = "/" === o.charAt(0))
        }
        return e = i(r(e.split("/"), function(e) {
            return !!e
        }), !t).join("/"), (t ? "/" : "") + e || "."
    }, n.normalize = function(e) {
        var t = "/" === e.charAt(0),
            n = "/" === e.slice(-1);
        return e = i(r(e.split("/"), function(e) {
            return !!e
        }), !t).join("/"), e || t || (e = "."), e && n && (e += "/"), (t ? "/" : "") + e
    }, n.join = function() {
        var e = Array.prototype.slice.call(arguments, 0);
        return n.normalize(r(e, function(e) {
            return e && "string" == typeof e
        }).join("/"))
    }, n.dirname = function(e) {
        var t = o.exec(e)[1] || "",
            n = !1;
        return t ? 1 === t.length || n && t.length <= 3 && ":" === t.charAt(1) ? t : t.substring(0, t.length - 1) : "."
    }, n.basename = function(e, t) {
        var n = o.exec(e)[2] || "";
        return t && n.substr(-1 * t.length) === t && (n = n.substr(0, n.length - t.length)), n
    }, n.extname = function(e) {
        return o.exec(e)[3] || ""
    }
}), require.define("/shred.js", function(e, t) {
    var n = e("ax"),
        r = e("cookiejar"),
        i = r.CookieJar,
        o = function(e) {
            e = e || {}, this.agent = e.agent, this.defaults = e.defaults || {}, this.log = e.logger || new n({
                level: "info"
            }), this._sharedCookieJar = new i, this.logCurl = e.logCurl || !1
        };
    o.Request = e("./shred/request"), o.Response = e("./shred/response"), o.prototype = {
        request: function(e) {
            e.logger = this.log, e.logCurl = e.logCurl || this.logCurl, e.cookieJar = "cookieJar" in e ? e.cookieJar : this._sharedCookieJar, e.agent = e.agent || this.agent;
            for (var t in this.defaults) this.defaults.hasOwnProperty(t) && !e[t] && (e[t] = this.defaults[t]);
            return new o.Request(e)
        }
    }, "get put post delete".split(" ").forEach(function(e) {
        o.prototype[e] = function(t) {
            return t.method = e, this.request(t)
        }
    }), t.exports = o
}), require.define("/node_modules/ax/package.json", function(e, t) {
    t.exports = {
        main: "./lib/ax.js"
    }
}), require.define("/node_modules/ax/lib/ax.js", function(e, t) {
    var n = (e("util").inspect, e("fs")),
        r = function(e) {
            var t = this,
                e = e || {};
            switch (e.level = e.level || "info", e.timestamp = e.timestamp || !0, e.prefix = e.prefix || "", t.options = e, t.options.module && (t.options.prefix = t.options.module), t.options.file ? t.stream = n.createWriteStream(t.options.file, {
                flags: "a"
            }) : "node" === process.title ? t.stream = process.stderr : "browser" === process.title && (t.stream = function() {
                return console[t.options.level].apply(console, arguments)
            }), t.options.level) {
                case "debug":
                    ["debug", "info", "warn"].forEach(function(e) {
                        t[e] = r.writer(e)
                    });
                case "info":
                    ["info", "warn"].forEach(function(e) {
                        t[e] = r.writer(e)
                    });
                case "warn":
                    t.warn = r.writer("warn")
            }
        };
    r.writer = function(e) {
        return function(t) {
            var n = this;
            "node" === process.title ? n.stream.write(n.format(e, t) + "\n") : "browser" === process.title && n.stream(n.format(e, t) + "\n")
        }
    }, r.prototype = {
        info: function() {},
        debug: function() {},
        warn: function() {},
        error: r.writer("error"),
        format: function(e, t) {
            if (!t) return "";
            var n = this,
                r = n.options.prefix,
                i = n.options.timestamp ? " " + (new Date).toISOString() : "";
            return r + i + ": " + t
        }
    }, t.exports = r
}), require.define("util", function() {}), require.define("fs", function() {}), require.define("/node_modules/cookiejar/package.json", function(e, t) {
    t.exports = {
        main: "cookiejar.js"
    }
}), require.define("/node_modules/cookiejar/cookiejar.js", function(e, t, n) {
    n.CookieAccessInfo = CookieAccessInfo = function i(e, t, n, r) {
        return this instanceof i ? (this.domain = e || void 0, this.path = t || "/", this.secure = !!n, this.script = !!r, this) : new i(e, t, n, r)
    }, n.Cookie = Cookie = function o(e) {
        return e instanceof o ? e : this instanceof o ? (this.name = null, this.value = null, this.expiration_date = 1 / 0, this.path = "/", this.domain = null, this.secure = !1, this.noscript = !1, e && this.parse(e), this) : new o(e)
    }, Cookie.prototype.toString = function() {
        var e = [this.name + "=" + this.value];
        return 1 / 0 !== this.expiration_date && e.push("expires=" + new Date(this.expiration_date).toGMTString()), this.domain && e.push("domain=" + this.domain), this.path && e.push("path=" + this.path), this.secure && e.push("secure"), this.noscript && e.push("httponly"), e.join("; ")
    }, Cookie.prototype.toValueString = function() {
        return this.name + "=" + this.value
    };
    var r = /[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g;
    Cookie.prototype.parse = function(e) {
        if (this instanceof Cookie) {
            var t = e.split(";"),
                n = t[0].match(/([^=]+)=((?:.|\n)*)/),
                r = n[1],
                i = n[2];
            this.name = r, this.value = i;
            for (var o = 1; o < t.length; o++) switch (n = t[o].match(/([^=]+)(?:=((?:.|\n)*))?/), r = n[1].trim().toLowerCase(), i = n[2], r) {
                case "httponly":
                    this.noscript = !0;
                    break;
                case "expires":
                    this.expiration_date = i ? Number(Date.parse(i)) : 1 / 0;
                    break;
                case "path":
                    this.path = i ? i.trim() : "";
                    break;
                case "domain":
                    this.domain = i ? i.trim() : "";
                    break;
                case "secure":
                    this.secure = !0
            }
            return this
        }
        return (new Cookie).parse(e)
    }, Cookie.prototype.matches = function(e) {
        return this.noscript && e.script || this.secure && !e.secure || !this.collidesWith(e) ? !1 : !0
    }, Cookie.prototype.collidesWith = function(e) {
        if (this.path && !e.path || this.domain && !e.domain) return !1;
        if (this.path && 0 !== e.path.indexOf(this.path)) return !1;
        if (this.domain === e.domain) return !0;
        if (this.domain && "." === this.domain.charAt(0)) {
            var t = e.domain.indexOf(this.domain.slice(1));
            if (-1 === t || t !== e.domain.length - this.domain.length + 1) return !1
        } else if (this.domain) return !1;
        return !0
    }, n.CookieJar = CookieJar = function a() {
        if (this instanceof a) {
            var e = {};
            return this.setCookie = function(t) {
                t = Cookie(t);
                var n = t.expiration_date <= Date.now();
                if (t.name in e) {
                    for (var r = e[t.name], i = 0; i < r.length; i++) {
                        var o = r[i];
                        if (o.collidesWith(t)) return n ? (r.splice(i, 1), 0 === r.length && delete e[t.name], !1) : r[i] = t
                    }
                    return n ? !1 : (r.push(t), t)
                }
                return n ? !1 : e[t.name] = [t]
            }, this.getCookie = function(t, n) {
                for (var r = e[t], i = 0; i < r.length; i++) {
                    var o = r[i];
                    if (o.expiration_date <= Date.now()) 0 === r.length && delete e[o.name];
                    else if (o.matches(n)) return o
                }
            }, this.getCookies = function(t) {
                var n = [];
                for (var r in e) {
                    var i = this.getCookie(r, t);
                    i && n.push(i)
                }
                return n.toString = function() {
                    return n.join(":")
                }, n.toValueString = function() {
                    return n.map(function(e) {
                        return e.toValueString()
                    }).join(";")
                }, n
            }, this
        }
        return new a
    }, CookieJar.prototype.setCookies = function(e) {
        e = Array.isArray(e) ? e : e.split(r);
        for (var t = [], n = 0; n < e.length; n++) {
            var i = Cookie(e[n]);
            this.setCookie(i) && t.push(i)
        }
        return t
    }
}), require.define("/shred/request.js", function(e, t) {
    var n = e("http"),
        r = e("https"),
        i = e("./parseUri"),
        o = e("events").EventEmitter,
        a = e("sprintf").sprintf,
        s = e("./response"),
        l = e("./mixins/headers"),
        u = e("./content"),
        c = n.STATUS_CODES || {
                100: "Continue",
                101: "Switching Protocols",
                102: "Processing",
                200: "OK",
                201: "Created",
                202: "Accepted",
                203: "Non-Authoritative Information",
                204: "No Content",
                205: "Reset Content",
                206: "Partial Content",
                207: "Multi-Status",
                300: "Multiple Choices",
                301: "Moved Permanently",
                302: "Moved Temporarily",
                303: "See Other",
                304: "Not Modified",
                305: "Use Proxy",
                307: "Temporary Redirect",
                400: "Bad Request",
                401: "Unauthorized",
                402: "Payment Required",
                403: "Forbidden",
                404: "Not Found",
                405: "Method Not Allowed",
                406: "Not Acceptable",
                407: "Proxy Authentication Required",
                408: "Request Time-out",
                409: "Conflict",
                410: "Gone",
                411: "Length Required",
                412: "Precondition Failed",
                413: "Request Entity Too Large",
                414: "Request-URI Too Large",
                415: "Unsupported Media Type",
                416: "Requested Range Not Satisfiable",
                417: "Expectation Failed",
                418: "I'm a teapot",
                422: "Unprocessable Entity",
                423: "Locked",
                424: "Failed Dependency",
                425: "Unordered Collection",
                426: "Upgrade Required",
                500: "Internal Server Error",
                501: "Not Implemented",
                502: "Bad Gateway",
                503: "Service Unavailable",
                504: "Gateway Time-out",
                505: "HTTP Version not supported",
                506: "Variant Also Negotiates",
                507: "Insufficient Storage",
                509: "Bandwidth Limit Exceeded",
                510: "Not Extended"
            },
        p = function(e) {
            this.log = e.logger, this.cookieJar = e.cookieJar, this.encoding = e.encoding, this.logCurl = e.logCurl, h(this, e || {}), d(this)
        };
    Object.defineProperties(p.prototype, {
        url: {
            get: function() {
                return this.scheme ? a("%s://%s:%s%s", this.scheme, this.host, this.port, (this.proxy ? "/" : this.path) + (this.query ? "?" + this.query : "")) : null
            },
            set: function(e) {
                return e = i(e), this.scheme = e.protocol, this.host = e.host, this.port = e.port, this.path = e.path, this.query = e.query, this
            },
            enumerable: !0
        },
        headers: {
            get: function() {
                return this.getHeaders()
            },
            enumerable: !0
        },
        port: {
            get: function() {
                if (!this._port) switch (this.scheme) {
                    case "https":
                        return this._port = 443;
                    case "http":
                    default:
                        return this._port = 80
                }
                return this._port
            },
            set: function(e) {
                return this._port = e, this
            },
            enumerable: !0
        },
        method: {
            get: function() {
                return this._method = this._method || "GET"
            },
            set: function(e) {
                return this._method = e, this
            },
            enumerable: !0
        },
        query: {
            get: function() {
                return this._query
            },
            set: function(e) {
                var t = function(e) {
                    var t = "";
                    for (var n in e) t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]) + "&";
                    return t = t.slice(0, -1)
                };
                return e ? ("object" == typeof e && (e = t(e)), this._query = e) : this._query = "", this
            },
            enumerable: !0
        },
        parameters: {
            get: function() {
                return QueryString.parse(this._query || "")
            },
            enumerable: !0
        },
        body: {
            get: function() {
                return this._body
            },
            set: function(e) {
                return this._body = new u({
                    data: e,
                    type: this.getHeader("Content-Type")
                }), this.setHeader("Content-Type", this.content.type), this.setHeader("Content-Length", this.content.length), this
            },
            enumerable: !0
        },
        timeout: {
            get: function() {
                return this._timeout
            },
            set: function(e) {
                var t = 0;
                return e ? (t = "number" == typeof e ? e : (e.milliseconds || 0) + 1e3 * ((e.seconds || 0) + 60 * ((e.minutes || 0) + 60 * (e.hours || 0))), this._timeout = t, this) : this
            },
            enumerable: !0
        }
    }), Object.defineProperty(p.prototype, "content", Object.getOwnPropertyDescriptor(p.prototype, "body")), p.prototype.inspect = function() {
        var e = this,
            t = this.format_headers(),
            n = ["<Shred Request> ", e.method.toUpperCase(), e.url].join(" ");
        return [n, "- Headers:", t].join("\n")
    }, p.prototype.format_headers = function() {
        var e = [],
            t = this._headers;
        for (var n in t)
            if (t.hasOwnProperty(n)) {
                var r = t[n];
                e.push("	" + n + ": " + r)
            }
        return e.join("\n")
    }, p.prototype.on = function(e, t) {
        var n = this.emitter;
        if (1 === arguments.length && "function" == typeof e) n.on("response", e);
        else if (1 === arguments.length && "object" == typeof e)
            for (var r in e) e.hasOwnProperty(r) && n.on(r, e[r]);
        else n.on(e, t);
        return this
    }, l.gettersAndSetters(p);
    var h = function(e, t) {
            if (e.log.debug("Processing request options .."), e.emitter = new o, e.agent = t.agent, t.on)
                for (var n in t.on) t.on.hasOwnProperty(n) && e.emitter.on(n, t.on[n]);
            if (!t.url && !t.host) return void e.emitter.emit("request_error", new Error("No url or url options (host, port, etc.)"));
            if (t.url && (t.proxy ? (e.url = t.proxy, e.path = t.url) : e.url = t.url), e.query = t.query || t.parameters || e.query, e.method = t.method, e.setHeader("user-agent", t.agent || "Shred"), e.setHeaders(t.headers), e.cookieJar) {
                var r = e.cookieJar.getCookies(CookieAccessInfo(e.host, e.path));
                if (r.length) {
                    for (var i = e.getHeader("cookie") || "", a = 0; a < r.length; ++a) i.length && ";" != i[i.length - 1] && (i += ";"), i += r[a].name + "=" + r[a].value + ";";
                    e.setHeader("cookie", i)
                }
            }(t.body || t.content) && (e.content = t.body || t.content), e.timeout = t.timeout
        },
        d = function(e) {
            var t;
            e.log.debug("Creating request .."), e.log.debug(e);
            var i = {
                host: e.host,
                port: e.port,
                method: e.method,
                path: e.path + (e.query ? "?" + e.query : ""),
                headers: e.getHeaders(),
                scheme: e.scheme,
                agent: e.agent
            };
            e.logCurl && f(e);
            var o = "http" == e.scheme ? n : r;
            e._raw = o.request(i, function(n) {
                e.log.debug("Received response .."), clearTimeout(t), n = new s(n, e, function(t) {
                    var n = function(n) {
                        var r = e.emitter,
                            i = c[t.status] ? c[t.status].toLowerCase() : null;
                        r.listeners(t.status).length > 0 || r.listeners(i).length > 0 ? (r.emit(t.status, t), r.emit(i, t)) : r.listeners(n).length > 0 ? r.emit(n, t) : t.isRedirect || r.emit("response", t)
                    };
                    t.isRedirect ? (e.log.debug("Redirecting to " + t.getHeader("Location")), e.url = t.getHeader("Location"), n("redirect"), d(e)) : n(t.isError ? "error" : "success")
                })
            }), e._raw.on("error", function(t) {
                e.emitter.emit("request_error", t)
            }), e._raw.on("socket", function(t) {
                e.emitter.emit("socket", t)
            }), e._raw.on("socket", function() {
                e._raw.socket.on("timeout", function() {
                    e._raw.abort()
                })
            }), e.content && (e.log.debug("Streaming body: '" + e.content.data.slice(0, 59) + "' ... "), e._raw.write(e.content.data)), e.timeout && (t = setTimeout(function() {
                e.log.debug("Timeout fired, aborting request ..."), e._raw.abort(), e.emitter.emit("timeout", e)
            }, e.timeout)), e.log.debug("Sending request ..."), e._raw.end()
        },
        f = function(e) {
            var t = e.getHeaders(),
                n = "";
            for (var r in t) n += '-H "' + r + ": " + t[r] + '" ';
            var i = "";
            e.content && (i += "-d '" + e.content.body + "' ");
            var o = e.query ? "?" + e.query : "";
            console.log("curl -X " + e.method.toUpperCase() + " " + e.scheme + "://" + e.host + ":" + e.port + e.path + o + " " + n + i)
        };
    t.exports = p
}), require.define("http", function() {}), require.define("https", function() {}), require.define("/shred/parseUri.js", function(e, t) {
    function n(e) {
        for (var t = n.options, r = t.parser[t.strictMode ? "strict" : "loose"].exec(e), i = {}, o = 14; o--;) i[t.key[o]] = r[o] || "";
        return i[t.q.name] = {}, i[t.key[12]].replace(t.q.parser, function(e, n, r) {
            n && (i[t.q.name][n] = r)
        }), i
    }
    n.options = {
        strictMode: !1,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    }, t.exports = n
}), require.define("events", function(e, t, n) {
    process.EventEmitter || (process.EventEmitter = function() {});
    var r = n.EventEmitter = process.EventEmitter,
        i = "function" == typeof Array.isArray ? Array.isArray : function(e) {
            return "[object Array]" === Object.toString.call(e)
        },
        o = 10;
    r.prototype.setMaxListeners = function(e) {
        this._events || (this._events = {}), this._events.maxListeners = e
    }, r.prototype.emit = function(e) {
        if ("error" === e && (!this._events || !this._events.error || i(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
        if (!this._events) return !1;
        var t = this._events[e];
        if (!t) return !1;
        if ("function" == typeof t) {
            switch (arguments.length) {
                case 1:
                    t.call(this);
                    break;
                case 2:
                    t.call(this, arguments[1]);
                    break;
                case 3:
                    t.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    var n = Array.prototype.slice.call(arguments, 1);
                    t.apply(this, n)
            }
            return !0
        }
        if (i(t)) {
            for (var n = Array.prototype.slice.call(arguments, 1), r = t.slice(), o = 0, a = r.length; a > o; o++) r[o].apply(this, n);
            return !0
        }
        return !1
    }, r.prototype.addListener = function(e, t) {
        if ("function" != typeof t) throw new Error("addListener only takes instances of Function");
        if (this._events || (this._events = {}), this.emit("newListener", e, t), this._events[e])
            if (i(this._events[e])) {
                if (!this._events[e].warned) {
                    var n;
                    n = void 0 !== this._events.maxListeners ? this._events.maxListeners : o, n && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), console.trace())
                }
                this._events[e].push(t)
            } else this._events[e] = [this._events[e], t];
        else this._events[e] = t;
        return this
    }, r.prototype.on = r.prototype.addListener, r.prototype.once = function(e, t) {
        var n = this;
        return n.on(e, function r() {
            n.removeListener(e, r), t.apply(this, arguments)
        }), this
    }, r.prototype.removeListener = function(e, t) {
        if ("function" != typeof t) throw new Error("removeListener only takes instances of Function");
        if (!this._events || !this._events[e]) return this;
        var n = this._events[e];
        if (i(n)) {
            var r = n.indexOf(t);
            if (0 > r) return this;
            n.splice(r, 1), 0 == n.length && delete this._events[e]
        } else this._events[e] === t && delete this._events[e];
        return this
    }, r.prototype.removeAllListeners = function(e) {
        return e && this._events && this._events[e] && (this._events[e] = null), this
    }, r.prototype.listeners = function(e) {
        return this._events || (this._events = {}), this._events[e] || (this._events[e] = []), i(this._events[e]) || (this._events[e] = [this._events[e]]), this._events[e]
    }
}), require.define("/node_modules/sprintf/package.json", function(e, t) {
    t.exports = {
        main: "./lib/sprintf"
    }
}), require.define("/node_modules/sprintf/lib/sprintf.js", function(e, t, n) {
    var r = function() {
            function e(e) {
                return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
            }

            function t(e, t) {
                for (var n = []; t > 0; n[--t] = e);
                return n.join("")
            }
            var n = function() {
                return n.cache.hasOwnProperty(arguments[0]) || (n.cache[arguments[0]] = n.parse(arguments[0])), n.format.call(null, n.cache[arguments[0]], arguments)
            };
            return n.format = function(n, i) {
                var o, a, s, l, u, c, p, h = 1,
                    d = n.length,
                    f = "",
                    m = [];
                for (a = 0; d > a; a++)
                    if (f = e(n[a]), "string" === f) m.push(n[a]);
                    else if ("array" === f) {
                        if (l = n[a], l[2])
                            for (o = i[h], s = 0; s < l[2].length; s++) {
                                if (!o.hasOwnProperty(l[2][s])) throw r('[sprintf] property "%s" does not exist', l[2][s]);
                                o = o[l[2][s]]
                            } else o = l[1] ? i[l[1]] : i[h++];
                        if (/[^s]/.test(l[8]) && "number" != e(o)) throw r("[sprintf] expecting number but found %s", e(o));
                        switch (l[8]) {
                            case "b":
                                o = o.toString(2);
                                break;
                            case "c":
                                o = String.fromCharCode(o);
                                break;
                            case "d":
                                o = parseInt(o, 10);
                                break;
                            case "e":
                                o = l[7] ? o.toExponential(l[7]) : o.toExponential();
                                break;
                            case "f":
                                o = l[7] ? parseFloat(o).toFixed(l[7]) : parseFloat(o);
                                break;
                            case "o":
                                o = o.toString(8);
                                break;
                            case "s":
                                o = (o = String(o)) && l[7] ? o.substring(0, l[7]) : o;
                                break;
                            case "u":
                                o = Math.abs(o);
                                break;
                            case "x":
                                o = o.toString(16);
                                break;
                            case "X":
                                o = o.toString(16).toUpperCase()
                        }
                        o = /[def]/.test(l[8]) && l[3] && o >= 0 ? "+" + o : o, c = l[4] ? "0" == l[4] ? "0" : l[4].charAt(1) : " ", p = l[6] - String(o).length, u = l[6] ? t(c, p) : "", m.push(l[5] ? o + u : u + o)
                    }
                return m.join("")
            }, n.cache = {}, n.parse = function(e) {
                for (var t = e, n = [], r = [], i = 0; t;) {
                    if (null !== (n = /^[^\x25]+/.exec(t))) r.push(n[0]);
                    else if (null !== (n = /^\x25{2}/.exec(t))) r.push("%");
                    else {
                        if (null === (n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t))) throw "[sprintf] huh?";
                        if (n[2]) {
                            i |= 1;
                            var o = [],
                                a = n[2],
                                s = [];
                            if (null === (s = /^([a-z_][a-z_\d]*)/i.exec(a))) throw "[sprintf] huh?";
                            for (o.push(s[1]);
                                 "" !== (a = a.substring(s[0].length));)
                                if (null !== (s = /^\.([a-z_][a-z_\d]*)/i.exec(a))) o.push(s[1]);
                                else {
                                    if (null === (s = /^\[(\d+)\]/.exec(a))) throw "[sprintf] huh?";
                                    o.push(s[1])
                                }
                            n[2] = o
                        } else i |= 2;
                        if (3 === i) throw "[sprintf] mixing positional and named placeholders is not (yet) supported";
                        r.push(n)
                    }
                    t = t.substring(n[0].length)
                }
                return r
            }, n
        }(),
        i = function(e, t) {
            return t.unshift(e), r.apply(null, t)
        };
    n.sprintf = r, n.vsprintf = i
}), require.define("/shred/response.js", function(e, t) {
    var n = e("./content"),
        r = e("./mixins/headers"),
        i = e("cookiejar"),
        o = i.Cookie,
        a = null;
    try {
        a = e("zlib")
    } catch (s) {
        console.warn("no zlib library")
    }
    var l = null;
    try {
        l = e("iconv-lite")
    } catch (s) {
        console.warn("no iconv library")
    }
    var u = function(e, t, r) {
        var i = this;
        if (this._raw = e, this._setHeaders.call(this, e.headers), t.cookieJar && this.getHeader("set-cookie")) {
            for (var s, u = this.getHeader("set-cookie"), c = [], p = 0; p < u.length; p++) {
                var h = u[p];
                if (h) {
                    h.match(/domain\=/i) || (h += "; domain=" + t.host), h.match(/path\=/i) || (h += "; path=" + t.path);
                    try {
                        s = new o(h), s && c.push(s)
                    } catch (d) {
                        console.warn("Tried to set bad cookie: " + h)
                    }
                }
            }
            t.cookieJar.setCookies(c)
        }
        this.request = t, this.client = t.client, this.log = this.request.log;
        var f = [],
            m = 0;
        e.on("data", function(e) {
            f.push(e), m += e.length
        }), e.on("end", function() {
            var e;
            if ("undefined" == typeof Buffer) e = f.join("");
            else {
                e = new Buffer(m);
                for (var t = 0, o = 0; t < f.length; t++) f[t].copy(e, o), o += f[t].length
            }
            var s = function(e) {
                i._body = new n({
                    body: e,
                    type: i.getHeader("Content-Type")
                }), r(i)
            };
            a && "gzip" === i.getHeader("Content-Encoding") ? a.gunzip(e, function(t, n) {
                e = l && i.request.encoding ? l.fromEncoding(n, i.request.encoding) : n.toString(), s(e)
            }) : (i.request.encoding && (e = l.fromEncoding(e, i.request.encoding)), s(e))
        })
    };
    u.prototype = {
        inspect: function() {
            var e = this,
                t = this.format_headers(),
                n = ["<Shred Response> ", e.status].join(" ");
            return [n, "- Headers:", t].join("\n")
        },
        format_headers: function() {
            var e = [],
                t = this._headers;
            for (var n in t)
                if (t.hasOwnProperty(n)) {
                    var r = t[n];
                    e.push("	" + n + ": " + r)
                }
            return e.join("\n")
        }
    }, Object.defineProperties(u.prototype, {
        status: {
            get: function() {
                return this._raw.statusCode
            },
            enumerable: !0
        },
        body: {
            get: function() {
                return this._body
            }
        },
        content: {
            get: function() {
                return this.body
            },
            enumerable: !0
        },
        isRedirect: {
            get: function() {
                return this.status > 299 && this.status < 400 && this.getHeader("Location")
            },
            enumerable: !0
        },
        isError: {
            get: function() {
                return 0 === this.status || this.status > 399
            },
            enumerable: !0
        }
    }), r.getters(u), r.privateSetters(u);
    var c = u.prototype.getHeader;
    u.prototype.getHeader = function(e) {
        return c.call(this, e) || "function" == typeof this._raw.getHeader && this._raw.getHeader(e)
    }, t.exports = u
}), require.define("/shred/content.js", function(e, t) {
    var n = function(e) {
        this.body = e.body, this.data = e.data, this.type = e.type
    };
    n.prototype = {}, Object.defineProperties(n.prototype, {
        type: {
            get: function() {
                if (this._type) return this._type;
                if (this._data) switch (typeof this._data) {
                    case "string":
                        return "text/plain";
                    case "object":
                        return "application/json"
                }
                return "text/plain"
            },
            set: function(e) {
                return this._type = e, this
            },
            enumerable: !0
        },
        data: {
            get: function() {
                return this._body ? this.processor.parser(this._body) : this._data
            },
            set: function(e) {
                return this._body && e && o.setDataWithBody(this), this._data = e, this
            },
            enumerable: !0
        },
        body: {
            get: function() {
                return this.processor.stringify(this._data ? this._data : this._body)
            },
            set: function(e) {
                return this._data && e && o.setBodyWithData(this), this._body = e, this
            },
            enumerable: !0
        },
        processor: {
            get: function() {
                var e = n.processors[this.type];
                if (e) return e;
                for (var t = this.type.split(";")[0], o = t.split(/\+|\//), a = 0, s = o.length; s > a; a++) e = n.processors[o[a]];
                return e || {
                    parser: r,
                    stringify: i
                }
            },
            enumerable: !0
        },
        length: {
            get: function() {
                return "undefined" != typeof Buffer ? Buffer.byteLength(this.body) : this.body.length
            }
        }
    }), n.processors = {}, n.registerProcessor = function(e, t) {
        e.forEach ? e.forEach(function(e) {
            n.processors[e] = t
        }) : n.processors[e] = t
    };
    var r = function(e) {
            return e
        },
        i = function(e) {
            return e.toString()
        };
    n.registerProcessor(["text/html", "text/plain", "text"], {
        parser: r,
        stringify: i
    }), n.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
        parser: function(e) {
            return JSON.parse(e)
        },
        stringify: function(e) {
            return JSON.stringify(e)
        }
    });
    var o = {
        setDataWithBody: function() {
            throw new Error("Attempt to set data attribute of a content object when the body attributes was already set.")
        },
        setBodyWithData: function() {
            throw new Error("Attempt to set body attribute of a content object when the data attributes was already set.")
        }
    };
    t.exports = n
}), require.define("/shred/mixins/headers.js", function(e, t) {
    var n = function(e) {
            return e.toLowerCase().replace(/(^|-)(\w)/g, function(e) {
                return e.toUpperCase()
            })
        },
        r = function() {
            return {}
        },
        i = function(e) {
            return e._headers || (e._headers = r(e))
        },
        o = function(e, t) {
            return i(e)[n(t)]
        },
        a = function(e, t) {
            var n = t && t.length > 0 ? t : Object.keys(i(e)),
                r = n.reduce(function(t, n) {
                    return t[n] = o(e, n), t
                }, {});
            return Object.freeze(r), r
        },
        s = function(e, t, r) {
            return i(e)[n(t)] = r, e
        },
        l = function(e, t) {
            for (var n in t) s(e, n, t[n]);
            return this
        };
    t.exports = {
        getters: function(e) {
            e.prototype.getHeader = function(e) {
                return o(this, e)
            }, e.prototype.getHeaders = function() {
                return a(this, arguments)
            }
        },
        privateSetters: function(e) {
            e.prototype._setHeader = function(e, t) {
                return s(this, e, t)
            }, e.prototype._setHeaders = function(e) {
                return l(this, e)
            }
        },
        setters: function(e) {
            e.prototype.setHeader = function(e, t) {
                return s(this, e, t)
            }, e.prototype.setHeaders = function(e) {
                return l(this, e)
            }
        },
        gettersAndSetters: function(e) {
            e.prototype.getHeader = function(e) {
                return o(this, e)
            }, e.prototype.getHeaders = function() {
                return a(this, arguments)
            }, e.prototype.setHeader = function(e, t) {
                return s(this, e, t)
            }, e.prototype.setHeaders = function(e) {
                return l(this, e)
            }
        }
    }
}), require.define("/node_modules/iconv-lite/package.json", function(e, t) {
    t.exports = {}
}), require.define("/node_modules/iconv-lite/index.js", function(e, t, n, r) {
    var i = t.exports = {
        toEncoding: function(e, t) {
            return i.getCodec(t).toEncoding(e)
        },
        fromEncoding: function(e, t) {
            return i.getCodec(t).fromEncoding(e)
        },
        defaultCharUnicode: "\ufffd",
        defaultCharSingleByte: "?",
        getCodec: function(e) {
            for (var t = e || "utf8", n = void 0;;) {
                "String" === c(t) && (t = t.replace(/[- ]/g, "").toLowerCase());
                var r = i.encodings[t],
                    o = c(r);
                if ("String" === o) n = {
                    originalEncoding: t
                }, t = r;
                else {
                    if ("Object" !== o || void 0 == r.type) {
                        if ("Function" === o) return r(n);
                        throw new Error("Encoding not recognized: '" + e + "' (searched as: '" + t + "')")
                    }
                    n = r, t = r.type
                }
            }
        },
        encodings: {
            internal: function(e) {
                return {
                    toEncoding: function(t) {
                        return new Buffer(u(t), e.originalEncoding)
                    },
                    fromEncoding: function(t) {
                        return l(t).toString(e.originalEncoding)
                    }
                }
            },
            utf8: "internal",
            ucs2: "internal",
            binary: "internal",
            ascii: "internal",
            base64: "internal",
            singlebyte: function(e) {
                if (!e.chars || 128 !== e.chars.length && 256 !== e.chars.length) throw new Error("Encoding '" + e.type + "' has incorrect 'chars' (must be of len 128 or 256)");
                if (128 === e.chars.length && (e.chars = s + e.chars), e.charsBuf || (e.charsBuf = new Buffer(e.chars, "ucs2")), !e.revCharsBuf) {
                    e.revCharsBuf = new Buffer(65536);
                    for (var t = i.defaultCharSingleByte.charCodeAt(0), n = 0; n < e.revCharsBuf.length; n++) e.revCharsBuf[n] = t;
                    for (var n = 0; n < e.chars.length; n++) e.revCharsBuf[e.chars.charCodeAt(n)] = n
                }
                return {
                    toEncoding: function(t) {
                        t = u(t);
                        for (var n = new Buffer(t.length), r = e.revCharsBuf, i = 0; i < t.length; i++) n[i] = r[t.charCodeAt(i)];
                        return n
                    },
                    fromEncoding: function(t) {
                        t = l(t);
                        for (var n = e.charsBuf, r = new Buffer(2 * t.length), i = 0, o = 0, a = 0, s = t.length; s > a; a++) i = 2 * t[a], o = 2 * a, r[o] = n[i], r[o + 1] = n[i + 1];
                        return r.toString("ucs2")
                    }
                }
            },
            table: function(e) {
                var t, n = e.table,
                    r = e.revCharsTable;
                if (!n) throw new Error("Encoding '" + e.type + "' has incorect 'table' option");
                if (!r) {
                    r = e.revCharsTable = {};
                    for (t in n) r[n[t]] = parseInt(t)
                }
                return {
                    toEncoding: function(e) {
                        e = u(e);
                        for (var t = e.length, n = t, o = 0; t > o; o++) e.charCodeAt(o) >> 7 && n++;
                        for (var a, s, l = new Buffer(n), c = r[i.defaultCharUnicode.charCodeAt(0)], o = 0, p = 0; t > o; o++) s = e.charCodeAt(o), s >> 7 ? (a = r[s] || c, l[p++] = a >> 8, l[p++] = 255 & a) : l[p++] = s;
                        return l
                    },
                    fromEncoding: function(e) {
                        e = l(e);
                        for (var t = e.length, r = 0, o = 0; t > o; o++) r++, 128 & e[o] && o++;
                        for (var a, s, u = new Buffer(2 * r), c = i.defaultCharUnicode.charCodeAt(0), o = 0, p = 0; t > o; o++, p += 2) s = e[o], 128 & s ? (s = (s << 8) + e[++o], a = n[s] || c) : a = s, u[p] = 255 & a, u[p + 1] = a >> 8;
                        return u.toString("ucs2")
                    }
                }
            }
        }
    };
    i.encode = i.toEncoding, i.decode = i.fromEncoding;
    var o = r + "/encodings/",
        a = e("fs");
    a.readdirSync(o).forEach(function(t) {
        if (!a.statSync(o + t).isDirectory()) {
            var n = e(o + t);
            for (var r in n) i.encodings[r] = n[r]
        }
    });
    var s = "\x00\b	\n\f\r !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
        l = function(e) {
            return e = e || new Buffer(0), e instanceof Buffer ? e : new Buffer(e.toString(), "utf8")
        },
        u = function(e) {
            return e = e || "", e instanceof String ? e : e.toString(e instanceof Buffer ? "utf8" : void 0)
        },
        c = function(e) {
            return Object.prototype.toString.call(e).slice(8, -1)
        }
}), require.define("/node_modules/http-browserify/package.json", function(e, t) {
    t.exports = {
        main: "index.js",
        browserify: "browser.js"
    }
}), require.define("/node_modules/http-browserify/browser.js", function(e, t) {
    var n = t.exports,
        r = (e("events").EventEmitter, e("./lib/request"));
    n.request = function(e, t) {
        e || (e = {}), e.host || (e.host = window.location.host.split(":")[0]), e.port || (e.port = window.location.port);
        var n = new r(new i, e);
        return t && n.on("response", t), n
    }, n.get = function(e, t) {
        e.method = "GET";
        var r = n.request(e, t);
        return r.end(), r
    };
    var i = function() {
        if ("undefined" == typeof window) throw new Error("no window object present");
        if (window.XMLHttpRequest) return window.XMLHttpRequest;
        if (window.ActiveXObject) {
            for (var e = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Microsoft.XMLHTTP"], t = 0; t < e.length; t++) try {
                var n = new window.ActiveXObject(e[t]);
                return function() {
                    if (n) {
                        var r = n;
                        return n = null, r
                    }
                    return new window.ActiveXObject(e[t])
                }
            } catch (r) {}
            throw new Error("ajax not supported in this browser")
        }
        throw new Error("ajax not supported in this browser")
    }();
    n.STATUS_CODES = {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        207: "Multi-Status",
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Moved Temporarily",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Time-out",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Large",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a teapot",
        422: "Unprocessable Entity",
        423: "Locked",
        424: "Failed Dependency",
        425: "Unordered Collection",
        426: "Upgrade Required",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Time-out",
        505: "HTTP Version not supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        509: "Bandwidth Limit Exceeded",
        510: "Not Extended"
    }
}), require.define("/node_modules/http-browserify/lib/request.js", function(e, t) {
    var n = e("events").EventEmitter,
        r = e("./response"),
        i = e("./isSafeHeader"),
        o = t.exports = function(e, t) {
            var n = this;
            n.xhr = e, n.body = "";
            var o = t.host + ":" + t.port + (t.path || "/");
            e.open(t.method || "GET", (t.scheme || "http") + "://" + o, !0), t.headers && Object.keys(t.headers).forEach(function(n) {
                if (i(n)) {
                    var r = t.headers[n];
                    Array.isArray(r) ? r.forEach(function(t) {
                        e.setRequestHeader(n, t)
                    }) : e.setRequestHeader(n, r)
                }
            });
            var a = new r(e);
            a.on("ready", function() {
                n.emit("response", a)
            }), e.onreadystatechange = function() {
                a.handle(e)
            }
        };
    o.prototype = new n, o.prototype.setHeader = function(e, t) {
        if (Array.isArray && Array.isArray(t) || t instanceof Array)
            for (var n = 0; n < t.length; n++) this.xhr.setRequestHeader(e, t[n]);
        else this.xhr.setRequestHeader(e, t)
    }, o.prototype.write = function(e) {
        this.body += e
    }, o.prototype.end = function(e) {
        void 0 !== e && this.write(e), this.xhr.send(this.body)
    }
}), require.define("/node_modules/http-browserify/lib/response.js", function(e, t) {
    function n(e) {
        for (var t = e.getAllResponseHeaders().split(/\r?\n/), n = {}, r = 0; r < t.length; r++) {
            var i = t[r];
            if ("" !== i) {
                var o = i.match(/^([^:]+):\s*(.*)/);
                if (o) {
                    var a = o[1].toLowerCase(),
                        s = o[2];
                    void 0 !== n[a] ? Array.isArray && Array.isArray(n[a]) || n[a] instanceof Array ? n[a].push(s) : n[a] = [n[a], s] : n[a] = s
                } else n[i] = !0
            }
        }
        return n
    }
    var r = e("events").EventEmitter,
        i = e("./isSafeHeader"),
        o = t.exports = function(e) {
            this.xhr = e, this.offset = 0
        };
    o.prototype = new r;
    var a = {
        streaming: !0,
        status2: !0
    };
    o.prototype.getHeader = function(e) {
        var t = this.headers ? this.headers[e.toLowerCase()] : null;
        return t ? t : i(e) ? this.xhr.getResponseHeader(e) : null
    }, o.prototype.handle = function() {
        var e = this.xhr;
        if (2 === e.readyState && a.status2) {
            try {
                this.statusCode = e.status, this.headers = n(e)
            } catch (t) {
                a.status2 = !1
            }
            a.status2 && this.emit("ready")
        } else if (a.streaming && 3 === e.readyState) {
            try {
                this.statusCode || (this.statusCode = e.status, this.headers = n(e), this.emit("ready"))
            } catch (t) {}
            try {
                this.write()
            } catch (t) {
                a.streaming = !1
            }
        } else 4 === e.readyState && (this.statusCode || (this.statusCode = e.status, this.emit("ready")), this.write(), e.error ? this.emit("error", e.responseText) : this.emit("end"))
    }, o.prototype.write = function() {
        var e = this.xhr;
        e.responseText.length > this.offset && (this.emit("data", e.responseText.slice(this.offset)), this.offset = e.responseText.length)
    }
}), require.define("/node_modules/http-browserify/lib/isSafeHeader.js", function(e, t) {
    var n = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "origin", "referer", "set-cookie", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
    t.exports = function(e) {
        return e ? -1 === n.indexOf(e.toLowerCase()) : !1
    }
}), require.alias("http-browserify", "/node_modules/http"), require.alias("http-browserify", "/node_modules/https"), ! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = !!e && "length" in e && e.length,
            n = dt.type(e);
        return "function" === n || dt.isWindow(e) ? !1 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function r(e, t, n) {
        if (dt.isFunction(t)) return dt.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType) return dt.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (kt.test(t)) return dt.filter(t, e, n);
            t = dt.filter(t, e)
        }
        return dt.grep(e, function(e) {
            return dt.inArray(e, t) > -1 !== n
        })
    }

    function i(e, t) {
        do e = e[t]; while (e && 1 !== e.nodeType);
        return e
    }

    function o(e) {
        var t = {};
        return dt.each(e.match(At) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function a() {
        rt.addEventListener ? (rt.removeEventListener("DOMContentLoaded", s), e.removeEventListener("load", s)) : (rt.detachEvent("onreadystatechange", s), e.detachEvent("onload", s))
    }

    function s() {
        (rt.addEventListener || "load" === e.event.type || "complete" === rt.readyState) && (a(), dt.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var r = "data-" + t.replace(Ot, "-$1").toLowerCase();
            if (n = e.getAttribute(r), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Dt.test(n) ? dt.parseJSON(n) : n
                } catch (i) {}
                dt.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function u(e) {
        var t;
        for (t in e)
            if (("data" !== t || !dt.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function c(e, t, n, r) {
        if (Lt(e)) {
            var i, o, a = dt.expando,
                s = e.nodeType,
                l = s ? dt.cache : e,
                u = s ? e[a] : e[a] && a;
            if (u && l[u] && (r || l[u].data) || void 0 !== n || "string" != typeof t) return u || (u = s ? e[a] = nt.pop() || dt.guid++ : a), l[u] || (l[u] = s ? {} : {
                toJSON: dt.noop
            }), "object" != typeof t && "function" != typeof t || (r ? l[u] = dt.extend(l[u], t) : l[u].data = dt.extend(l[u].data, t)), o = l[u], r || (o.data || (o.data = {}), o = o.data), void 0 !== n && (o[dt.camelCase(t)] = n), "string" == typeof t ? (i = o[t], null == i && (i = o[dt.camelCase(t)])) : i = o, i
        }
    }

    function p(e, t, n) {
        if (Lt(e)) {
            var r, i, o = e.nodeType,
                a = o ? dt.cache : e,
                s = o ? e[dt.expando] : dt.expando;
            if (a[s]) {
                if (t && (r = n ? a[s] : a[s].data)) {
                    dt.isArray(t) ? t = t.concat(dt.map(t, dt.camelCase)) : t in r ? t = [t] : (t = dt.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length;
                    for (; i--;) delete r[t[i]];
                    if (n ? !u(r) : !dt.isEmptyObject(r)) return
                }(n || (delete a[s].data, u(a[s]))) && (o ? dt.cleanData([e], !0) : pt.deleteExpando || a != a.window ? delete a[s] : a[s] = void 0)
            }
        }
    }

    function h(e, t, n, r) {
        var i, o = 1,
            a = 20,
            s = r ? function() {
                return r.cur()
            } : function() {
                return dt.css(e, t, "")
            },
            l = s(),
            u = n && n[3] || (dt.cssNumber[t] ? "" : "px"),
            c = (dt.cssNumber[t] || "px" !== u && +l) && Rt.exec(dt.css(e, t));
        if (c && c[3] !== u) {
            u = u || c[3], n = n || [], c = +l || 1;
            do o = o || ".5", c /= o, dt.style(e, t, c + u); while (o !== (o = s() / l) && 1 !== o && --a)
        }
        return n && (c = +c || +l || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = u, r.start = c, r.end = i)), i
    }

    function d(e) {
        var t = Wt.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function f(e, t) {
        var n, r, i = 0,
            o = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (r = n[i]); i++) !t || dt.nodeName(r, t) ? o.push(r) : dt.merge(o, f(r, t));
        return void 0 === t || t && dt.nodeName(e, t) ? dt.merge([e], o) : o
    }

    function m(e, t) {
        for (var n, r = 0; null != (n = e[r]); r++) dt._data(n, "globalEval", !t || dt._data(t[r], "globalEval"))
    }

    function g(e) {
        Ft.test(e.type) && (e.defaultChecked = e.checked)
    }

    function y(e, t, n, r, i) {
        for (var o, a, s, l, u, c, p, h = e.length, y = d(t), v = [], b = 0; h > b; b++)
            if (a = e[b], a || 0 === a)
                if ("object" === dt.type(a)) dt.merge(v, a.nodeType ? [a] : a);
                else if (Ut.test(a)) {
                    for (l = l || y.appendChild(t.createElement("div")), u = (It.exec(a) || ["", ""])[1].toLowerCase(), p = Vt[u] || Vt._default, l.innerHTML = p[1] + dt.htmlPrefilter(a) + p[2], o = p[0]; o--;) l = l.lastChild;
                    if (!pt.leadingWhitespace && zt.test(a) && v.push(t.createTextNode(zt.exec(a)[0])), !pt.tbody)
                        for (a = "table" !== u || Xt.test(a) ? "<table>" !== p[1] || Xt.test(a) ? 0 : l : l.firstChild, o = a && a.childNodes.length; o--;) dt.nodeName(c = a.childNodes[o], "tbody") && !c.childNodes.length && a.removeChild(c);
                    for (dt.merge(v, l.childNodes), l.textContent = ""; l.firstChild;) l.removeChild(l.firstChild);
                    l = y.lastChild
                } else v.push(t.createTextNode(a));
        for (l && y.removeChild(l), pt.appendChecked || dt.grep(f(v, "input"), g), b = 0; a = v[b++];)
            if (r && dt.inArray(a, r) > -1) i && i.push(a);
            else if (s = dt.contains(a.ownerDocument, a), l = f(y.appendChild(a), "script"), s && m(l), n)
                for (o = 0; a = l[o++];) Bt.test(a.type || "") && n.push(a);
        return l = null, y
    }

    function v() {
        return !0
    }

    function b() {
        return !1
    }

    function x() {
        try {
            return rt.activeElement
        } catch (e) {}
    }

    function w(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            "string" != typeof n && (r = r || n, n = void 0);
            for (s in t) w(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), i === !1) i = b;
        else if (!i) return e;
        return 1 === o && (a = i, i = function(e) {
            return dt().off(e), a.apply(this, arguments)
        }, i.guid = a.guid || (a.guid = dt.guid++)), e.each(function() {
            dt.event.add(this, t, i, r, n)
        })
    }

    function S(e, t) {
        return dt.nodeName(e, "table") && dt.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function k(e) {
        return e.type = (null !== dt.find.attr(e, "type")) + "/" + e.type, e
    }

    function T(e) {
        var t = on.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function E(e, t) {
        if (1 === t.nodeType && dt.hasData(e)) {
            var n, r, i, o = dt._data(e),
                a = dt._data(t, o),
                s = o.events;
            if (s) {
                delete a.handle, a.events = {};
                for (n in s)
                    for (r = 0, i = s[n].length; i > r; r++) dt.event.add(t, n, s[n][r])
            }
            a.data && (a.data = dt.extend({}, a.data))
        }
    }

    function C(e, t) {
        var n, r, i;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !pt.noCloneEvent && t[dt.expando]) {
                i = dt._data(t);
                for (r in i.events) dt.removeEvent(t, r, i.handle);
                t.removeAttribute(dt.expando)
            }
            "script" === n && t.text !== e.text ? (k(t).text = e.text, T(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), pt.html5Clone && e.innerHTML && !dt.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ft.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }
    }

    function N(e, t, n, r) {
        t = ot.apply([], t);
        var i, o, a, s, l, u, c = 0,
            p = e.length,
            h = p - 1,
            d = t[0],
            m = dt.isFunction(d);
        if (m || p > 1 && "string" == typeof d && !pt.checkClone && rn.test(d)) return e.each(function(i) {
            var o = e.eq(i);
            m && (t[0] = d.call(this, i, o.html())), N(o, t, n, r)
        });
        if (p && (u = y(t, e[0].ownerDocument, !1, e, r), i = u.firstChild, 1 === u.childNodes.length && (u = i), i || r)) {
            for (s = dt.map(f(u, "script"), k), a = s.length; p > c; c++) o = u, c !== h && (o = dt.clone(o, !0, !0), a && dt.merge(s, f(o, "script"))), n.call(e[c], o, c);
            if (a)
                for (l = s[s.length - 1].ownerDocument, dt.map(s, T), c = 0; a > c; c++) o = s[c], Bt.test(o.type || "") && !dt._data(o, "globalEval") && dt.contains(l, o) && (o.src ? dt._evalUrl && dt._evalUrl(o.src) : dt.globalEval((o.text || o.textContent || o.innerHTML || "").replace(an, "")));
            u = i = null
        }
        return e
    }

    function _(e, t, n) {
        for (var r, i = t ? dt.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || dt.cleanData(f(r)), r.parentNode && (n && dt.contains(r.ownerDocument, r) && m(f(r, "script")), r.parentNode.removeChild(r));
        return e
    }

    function A(e, t) {
        var n = dt(t.createElement(e)).appendTo(t.body),
            r = dt.css(n[0], "display");
        return n.detach(), r
    }

    function j(e) {
        var t = rt,
            n = cn[e];
        return n || (n = A(e, t), "none" !== n && n || (un = (un || dt("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (un[0].contentWindow || un[0].contentDocument).document, t.write(), t.close(), n = A(e, t), un.detach()), cn[e] = n), n
    }

    function H(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function L(e) {
        if (e in En) return e;
        for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = Tn.length; n--;)
            if (e = Tn[n] + t, e in En) return e
    }

    function D(e, t) {
        for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++) r = e[a], r.style && (o[a] = dt._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && Mt(r) && (o[a] = dt._data(r, "olddisplay", j(r.nodeName)))) : (i = Mt(r), (n && "none" !== n || !i) && dt._data(r, "olddisplay", i ? n : dt.css(r, "display"))));
        for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }

    function O(e, t, n) {
        var r = wn.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function q(e, t, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += dt.css(e, n + Pt[o], !0, i)), r ? ("content" === n && (a -= dt.css(e, "padding" + Pt[o], !0, i)), "margin" !== n && (a -= dt.css(e, "border" + Pt[o] + "Width", !0, i))) : (a += dt.css(e, "padding" + Pt[o], !0, i), "padding" !== n && (a += dt.css(e, "border" + Pt[o] + "Width", !0, i)));
        return a
    }

    function R(e, t, n) {
        var r = !0,
            i = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = mn(e),
            a = pt.boxSizing && "border-box" === dt.css(e, "boxSizing", !1, o);
        if (0 >= i || null == i) {
            if (i = gn(e, t, o), (0 > i || null == i) && (i = e.style[t]), hn.test(i)) return i;
            r = a && (pt.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + q(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }

    function P(e, t, n, r, i) {
        return new P.prototype.init(e, t, n, r, i)
    }

    function M() {
        return e.setTimeout(function() {
            Cn = void 0
        }), Cn = dt.now()
    }

    function $(e, t) {
        var n, r = {
                height: e
            },
            i = 0;
        for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Pt[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function F(e, t, n) {
        for (var r, i = (z.tweeners[t] || []).concat(z.tweeners["*"]), o = 0, a = i.length; a > o; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function I(e, t, n) {
        var r, i, o, a, s, l, u, c, p = this,
            h = {},
            d = e.style,
            f = e.nodeType && Mt(e),
            m = dt._data(e, "fxshow");
        n.queue || (s = dt._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
            s.unqueued || l()
        }), s.unqueued++, p.always(function() {
            p.always(function() {
                s.unqueued--, dt.queue(e, "fx").length || s.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], u = dt.css(e, "display"), c = "none" === u ? dt._data(e, "olddisplay") || j(e.nodeName) : u, "inline" === c && "none" === dt.css(e, "float") && (pt.inlineBlockNeedsLayout && "inline" !== j(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", pt.shrinkWrapBlocks() || p.always(function() {
            d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
        }));
        for (r in t)
            if (i = t[r], _n.exec(i)) {
                if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) {
                    if ("show" !== i || !m || void 0 === m[r]) continue;
                    f = !0
                }
                h[r] = m && m[r] || dt.style(e, r)
            } else u = void 0;
        if (dt.isEmptyObject(h)) "inline" === ("none" === u ? j(e.nodeName) : u) && (d.display = u);
        else {
            m ? "hidden" in m && (f = m.hidden) : m = dt._data(e, "fxshow", {}), o && (m.hidden = !f), f ? dt(e).show() : p.done(function() {
                dt(e).hide()
            }), p.done(function() {
                var t;
                dt._removeData(e, "fxshow");
                for (t in h) dt.style(e, t, h[t])
            });
            for (r in h) a = F(f ? m[r] : 0, r, p), r in m || (m[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
        }
    }

    function B(e, t) {
        var n, r, i, o, a;
        for (n in e)
            if (r = dt.camelCase(n), i = t[r], o = e[n], dt.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = dt.cssHooks[r], a && "expand" in a) {
                o = a.expand(o), delete e[r];
                for (n in o) n in e || (e[n] = o[n], t[n] = i)
            } else t[r] = i
    }

    function z(e, t, n) {
        var r, i, o = 0,
            a = z.prefilters.length,
            s = dt.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (i) return !1;
                for (var t = Cn || M(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length; l > a; a++) u.tweens[a].run(o);
                return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1)
            },
            u = s.promise({
                elem: e,
                props: dt.extend({}, t),
                opts: dt.extend(!0, {
                    specialEasing: {},
                    easing: dt.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Cn || M(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = dt.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? u.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) u.tweens[n].run(1);
                    return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (B(c, u.opts.specialEasing); a > o; o++)
            if (r = z.prefilters[o].call(u, e, c, u.opts)) return dt.isFunction(r.stop) && (dt._queueHooks(u.elem, u.opts.queue).stop = dt.proxy(r.stop, r)), r;
        return dt.map(c, F, u), dt.isFunction(u.opts.start) && u.opts.start.call(e, u), dt.fx.timer(dt.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }

    function W(e) {
        return dt.attr(e, "class") || ""
    }

    function V(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0,
                o = t.toLowerCase().match(At) || [];
            if (dt.isFunction(n))
                for (; r = o[i++];) "+" === r.charAt(0) ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function U(e, t, n, r) {
        function i(s) {
            var l;
            return o[s] = !0, dt.each(e[s] || [], function(e, s) {
                var u = s(t, n, r);
                return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), i(u), !1)
            }), l
        }
        var o = {},
            a = e === Zn;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }

    function X(e, t) {
        var n, r, i = dt.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((i[r] ? e : n || (n = {}))[r] = t[r]);
        return n && dt.extend(!0, e, n), e
    }

    function J(e, t, n) {
        for (var r, i, o, a, s = e.contents, l = e.dataTypes;
             "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (a in s)
                if (s[a] && s[a].test(i)) {
                    l.unshift(a);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    o = a;
                    break
                }
                r || (r = a)
            }
            o = o || r
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }

    function Q(e, t, n, r) {
        var i, o, a, s, l, u = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
                    if (a = u[l + " " + o] || u["* " + o], !a)
                        for (i in u)
                            if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (p) {
                            return {
                                state: "parsererror",
                                error: a ? p : "No conversion from " + l + " to " + o
                            }
                        }
                }
        return {
            state: "success",
            data: t
        }
    }

    function G(e) {
        return e.style && e.style.display || dt.css(e, "display")
    }

    function K(e) {
        if (!dt.contains(e.ownerDocument || rt, e)) return !0;
        for (; e && 1 === e.nodeType;) {
            if ("none" === G(e) || "hidden" === e.type) return !0;
            e = e.parentNode
        }
        return !1
    }

    function Y(e, t, n, r) {
        var i;
        if (dt.isArray(t)) dt.each(t, function(t, i) {
            n || ir.test(e) ? r(e, i) : Y(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== dt.type(t)) r(e, t);
        else
            for (i in t) Y(e + "[" + i + "]", t[i], n, r)
    }

    function Z() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function et() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function tt(e) {
        return dt.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var nt = [],
        rt = e.document,
        it = nt.slice,
        ot = nt.concat,
        at = nt.push,
        st = nt.indexOf,
        lt = {},
        ut = lt.toString,
        ct = lt.hasOwnProperty,
        pt = {},
        ht = "1.12.4",
        dt = function(e, t) {
            return new dt.fn.init(e, t)
        },
        ft = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        mt = /^-ms-/,
        gt = /-([\da-z])/gi,
        yt = function(e, t) {
            return t.toUpperCase()
        };
    dt.fn = dt.prototype = {
        jquery: ht,
        constructor: dt,
        selector: "",
        length: 0,
        toArray: function() {
            return it.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : it.call(this)
        },
        pushStack: function(e) {
            var t = dt.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e) {
            return dt.each(this, e)
        },
        map: function(e) {
            return this.pushStack(dt.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(it.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: at,
        sort: nt.sort,
        splice: nt.splice
    }, dt.extend = dt.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || dt.isFunction(a) || (a = {}), s === l && (a = this, s--); l > s; s++)
            if (null != (i = arguments[s]))
                for (r in i) e = a[r], n = i[r], a !== n && (u && n && (dt.isPlainObject(n) || (t = dt.isArray(n))) ? (t ? (t = !1, o = e && dt.isArray(e) ? e : []) : o = e && dt.isPlainObject(e) ? e : {}, a[r] = dt.extend(u, o, n)) : void 0 !== n && (a[r] = n));
        return a
    }, dt.extend({
        expando: "jQuery" + (ht + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === dt.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === dt.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            var t = e && e.toString();
            return !dt.isArray(e) && t - parseFloat(t) + 1 >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== dt.type(e) || e.nodeType || dt.isWindow(e)) return !1;
            try {
                if (e.constructor && !ct.call(e, "constructor") && !ct.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (!pt.ownFirst)
                for (t in e) return ct.call(e, t);
            for (t in e);
            return void 0 === t || ct.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? lt[ut.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && dt.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(mt, "ms-").replace(gt, yt)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t) {
            var r, i = 0;
            if (n(e))
                for (r = e.length; r > i && t.call(e[i], i, e[i]) !== !1; i++);
            else
                for (i in e)
                    if (t.call(e[i], i, e[i]) === !1) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(ft, "")
        },
        makeArray: function(e, t) {
            var r = t || [];
            return null != e && (n(Object(e)) ? dt.merge(r, "string" == typeof e ? [e] : e) : at.call(r, e)), r
        },
        inArray: function(e, t, n) {
            var r;
            if (t) {
                if (st) return st.call(t, e, n);
                for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; n > r;) e[i++] = t[r++];
            if (n !== n)
                for (; void 0 !== t[r];) e[i++] = t[r++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r, i = [], o = 0, a = e.length, s = !n; a > o; o++) r = !t(e[o], o), r !== s && i.push(e[o]);
            return i
        },
        map: function(e, t, r) {
            var i, o, a = 0,
                s = [];
            if (n(e))
                for (i = e.length; i > a; a++) o = t(e[a], a, r), null != o && s.push(o);
            else
                for (a in e) o = t(e[a], a, r), null != o && s.push(o);
            return ot.apply([], s)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            return "string" == typeof t && (i = e[t], t = e, e = i), dt.isFunction(e) ? (n = it.call(arguments, 2), r = function() {
                return e.apply(t || this, n.concat(it.call(arguments)))
            }, r.guid = e.guid = e.guid || dt.guid++, r) : void 0
        },
        now: function() {
            return +new Date
        },
        support: pt
    }), "function" == typeof Symbol && (dt.fn[Symbol.iterator] = nt[Symbol.iterator]), dt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        lt["[object " + t + "]"] = t.toLowerCase()
    });
    var vt = function(e) {
        function t(e, t, n, r) {
            var i, o, a, s, l, u, p, d, f = t && t.ownerDocument,
                m = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== m && 9 !== m && 11 !== m) return n;
            if (!r && ((t ? t.ownerDocument || t : F) !== L && H(t), t = t || L, O)) {
                if (11 !== m && (u = yt.exec(e)))
                    if (i = u[1]) {
                        if (9 === m) {
                            if (!(a = t.getElementById(i))) return n;
                            if (a.id === i) return n.push(a), n
                        } else if (f && (a = f.getElementById(i)) && M(t, a) && a.id === i) return n.push(a), n
                    } else {
                        if (u[2]) return Y.apply(n, t.getElementsByTagName(e)), n;
                        if ((i = u[3]) && w.getElementsByClassName && t.getElementsByClassName) return Y.apply(n, t.getElementsByClassName(i)), n
                    }
                if (!(!w.qsa || V[e + " "] || q && q.test(e))) {
                    if (1 !== m) f = t, d = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((s = t.getAttribute("id")) ? s = s.replace(bt, "\\$&") : t.setAttribute("id", s = $), p = E(e), o = p.length, l = ht.test(s) ? "#" + s : "[id='" + s + "']"; o--;) p[o] = l + " " + h(p[o]);
                        d = p.join(","), f = vt.test(e) && c(t.parentNode) || t
                    }
                    if (d) try {
                        return Y.apply(n, f.querySelectorAll(d)), n
                    } catch (g) {} finally {
                        s === $ && t.removeAttribute("id")
                    }
                }
            }
            return N(e.replace(st, "$1"), t, n, r)
        }

        function n() {
            function e(n, r) {
                return t.push(n + " ") > S.cacheLength && delete e[t.shift()], e[n + " "] = r
            }
            var t = [];
            return e
        }

        function r(e) {
            return e[$] = !0, e
        }

        function i(e) {
            var t = L.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), r = n.length; r--;) S.attrHandle[n[r]] = t
        }

        function a(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || X) - (~e.sourceIndex || X);
            if (r) return r;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function s(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function u(e) {
            return r(function(t) {
                return t = +t, r(function(n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function c(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }

        function p() {}

        function h(e) {
            for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
            return r
        }

        function d(e, t, n) {
            var r = t.dir,
                i = n && "parentNode" === r,
                o = B++;
            return t.first ? function(t, n, o) {
                for (; t = t[r];)
                    if (1 === t.nodeType || i) return e(t, n, o)
            } : function(t, n, a) {
                var s, l, u, c = [I, o];
                if (a) {
                    for (; t = t[r];)
                        if ((1 === t.nodeType || i) && e(t, n, a)) return !0
                } else
                    for (; t = t[r];)
                        if (1 === t.nodeType || i) {
                            if (u = t[$] || (t[$] = {}), l = u[t.uniqueID] || (u[t.uniqueID] = {}), (s = l[r]) && s[0] === I && s[1] === o) return c[2] = s[2];
                            if (l[r] = c, c[2] = e(t, n, a)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--;)
                    if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }

        function m(e, n, r) {
            for (var i = 0, o = n.length; o > i; i++) t(e, n[i], r);
            return r
        }

        function g(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; l > s; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), u && t.push(s)));
            return a
        }

        function y(e, t, n, i, o, a) {
            return i && !i[$] && (i = y(i)), o && !o[$] && (o = y(o, a)), r(function(r, a, s, l) {
                var u, c, p, h = [],
                    d = [],
                    f = a.length,
                    y = r || m(t || "*", s.nodeType ? [s] : s, []),
                    v = !e || !r && t ? y : g(y, h, e, s, l),
                    b = n ? o || (r ? e : f || i) ? [] : a : v;
                if (n && n(v, b, s, l), i)
                    for (u = g(b, d), i(u, [], s, l), c = u.length; c--;)(p = u[c]) && (b[d[c]] = !(v[d[c]] = p));
                if (r) {
                    if (o || e) {
                        if (o) {
                            for (u = [], c = b.length; c--;)(p = b[c]) && u.push(v[c] = p);
                            o(null, b = [], u, l)
                        }
                        for (c = b.length; c--;)(p = b[c]) && (u = o ? et(r, p) : h[c]) > -1 && (r[u] = !(a[u] = p))
                    }
                } else b = g(b === a ? b.splice(f, b.length) : b), o ? o(null, a, b, l) : Y.apply(a, b)
            })
        }

        function v(e) {
            for (var t, n, r, i = e.length, o = S.relative[e[0].type], a = o || S.relative[" "], s = o ? 1 : 0, l = d(function(e) {
                return e === t
            }, a, !0), u = d(function(e) {
                return et(t, e) > -1
            }, a, !0), c = [function(e, n, r) {
                var i = !o && (r || n !== _) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r));
                return t = null, i
            }]; i > s; s++)
                if (n = S.relative[e[s].type]) c = [d(f(c), n)];
                else {
                    if (n = S.filter[e[s].type].apply(null, e[s].matches), n[$]) {
                        for (r = ++s; i > r && !S.relative[e[r].type]; r++);
                        return y(s > 1 && f(c), s > 1 && h(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(st, "$1"), n, r > s && v(e.slice(s, r)), i > r && v(e = e.slice(r)), i > r && h(e))
                    }
                    c.push(n)
                }
            return f(c)
        }

        function b(e, n) {
            var i = n.length > 0,
                o = e.length > 0,
                a = function(r, a, s, l, u) {
                    var c, p, h, d = 0,
                        f = "0",
                        m = r && [],
                        y = [],
                        v = _,
                        b = r || o && S.find.TAG("*", u),
                        x = I += null == v ? 1 : Math.random() || .1,
                        w = b.length;
                    for (u && (_ = a === L || a || u); f !== w && null != (c = b[f]); f++) {
                        if (o && c) {
                            for (p = 0, a || c.ownerDocument === L || (H(c), s = !O); h = e[p++];)
                                if (h(c, a || L, s)) {
                                    l.push(c);
                                    break
                                }
                            u && (I = x)
                        }
                        i && ((c = !h && c) && d--, r && m.push(c))
                    }
                    if (d += f, i && f !== d) {
                        for (p = 0; h = n[p++];) h(m, y, a, s);
                        if (r) {
                            if (d > 0)
                                for (; f--;) m[f] || y[f] || (y[f] = G.call(l));
                            y = g(y)
                        }
                        Y.apply(l, y), u && !r && y.length > 0 && d + n.length > 1 && t.uniqueSort(l)
                    }
                    return u && (I = x, _ = v), m
                };
            return i ? r(a) : a
        }
        var x, w, S, k, T, E, C, N, _, A, j, H, L, D, O, q, R, P, M, $ = "sizzle" + 1 * new Date,
            F = e.document,
            I = 0,
            B = 0,
            z = n(),
            W = n(),
            V = n(),
            U = function(e, t) {
                return e === t && (j = !0), 0
            },
            X = 1 << 31,
            J = {}.hasOwnProperty,
            Q = [],
            G = Q.pop,
            K = Q.push,
            Y = Q.push,
            Z = Q.slice,
            et = function(e, t) {
                for (var n = 0, r = e.length; r > n; n++)
                    if (e[n] === t) return n;
                return -1
            },
            tt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            nt = "[\\x20\\t\\r\\n\\f]",
            rt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            it = "\\[" + nt + "*(" + rt + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + rt + "))|)" + nt + "*\\]",
            ot = ":(" + rt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + it + ")*)|.*)\\)|)",
            at = new RegExp(nt + "+", "g"),
            st = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
            lt = new RegExp("^" + nt + "*," + nt + "*"),
            ut = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
            ct = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
            pt = new RegExp(ot),
            ht = new RegExp("^" + rt + "$"),
            dt = {
                ID: new RegExp("^#(" + rt + ")"),
                CLASS: new RegExp("^\\.(" + rt + ")"),
                TAG: new RegExp("^(" + rt + "|[*])"),
                ATTR: new RegExp("^" + it),
                PSEUDO: new RegExp("^" + ot),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + tt + ")$", "i"),
                needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
            },
            ft = /^(?:input|select|textarea|button)$/i,
            mt = /^h\d$/i,
            gt = /^[^{]+\{\s*\[native \w/,
            yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            vt = /[+~]/,
            bt = /'|\\/g,
            xt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
            wt = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            St = function() {
                H()
            };
        try {
            Y.apply(Q = Z.call(F.childNodes), F.childNodes), Q[F.childNodes.length].nodeType
        } catch (kt) {
            Y = {
                apply: Q.length ? function(e, t) {
                    K.apply(e, Z.call(t))
                } : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];);
                    e.length = n - 1
                }
            }
        }
        w = t.support = {}, T = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, H = t.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : F;
            return r !== L && 9 === r.nodeType && r.documentElement ? (L = r, D = L.documentElement, O = !T(L), (n = L.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", St, !1) : n.attachEvent && n.attachEvent("onunload", St)), w.attributes = i(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), w.getElementsByTagName = i(function(e) {
                return e.appendChild(L.createComment("")), !e.getElementsByTagName("*").length
            }), w.getElementsByClassName = gt.test(L.getElementsByClassName), w.getById = i(function(e) {
                return D.appendChild(e).id = $, !L.getElementsByName || !L.getElementsByName($).length
            }), w.getById ? (S.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && O) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }, S.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete S.find.ID, S.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), S.find.TAG = w.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
            } : function(e, t) {
                var n, r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, S.find.CLASS = w.getElementsByClassName && function(e, t) {
                return "undefined" != typeof t.getElementsByClassName && O ? t.getElementsByClassName(e) : void 0
            }, R = [], q = [], (w.qsa = gt.test(L.querySelectorAll)) && (i(function(e) {
                D.appendChild(e).innerHTML = "<a id='" + $ + "'></a><select id='" + $ + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + nt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || q.push("\\[" + nt + "*(?:value|" + tt + ")"), e.querySelectorAll("[id~=" + $ + "-]").length || q.push("~="), e.querySelectorAll(":checked").length || q.push(":checked"), e.querySelectorAll("a#" + $ + "+*").length || q.push(".#.+[+~]")
            }), i(function(e) {
                var t = L.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && q.push("name" + nt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), q.push(",.*:")
            })), (w.matchesSelector = gt.test(P = D.matches || D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && i(function(e) {
                w.disconnectedMatch = P.call(e, "div"), P.call(e, "[s!='']:x"), R.push("!=", ot)
            }), q = q.length && new RegExp(q.join("|")), R = R.length && new RegExp(R.join("|")), t = gt.test(D.compareDocumentPosition), M = t || gt.test(D.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, U = t ? function(e, t) {
                if (e === t) return j = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === L || e.ownerDocument === F && M(F, e) ? -1 : t === L || t.ownerDocument === F && M(F, t) ? 1 : A ? et(A, e) - et(A, t) : 0 : 4 & n ? -1 : 1)
            } : function(e, t) {
                if (e === t) return j = !0, 0;
                var n, r = 0,
                    i = e.parentNode,
                    o = t.parentNode,
                    s = [e],
                    l = [t];
                if (!i || !o) return e === L ? -1 : t === L ? 1 : i ? -1 : o ? 1 : A ? et(A, e) - et(A, t) : 0;
                if (i === o) return a(e, t);
                for (n = e; n = n.parentNode;) s.unshift(n);
                for (n = t; n = n.parentNode;) l.unshift(n);
                for (; s[r] === l[r];) r++;
                return r ? a(s[r], l[r]) : s[r] === F ? -1 : l[r] === F ? 1 : 0
            }, L) : L
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== L && H(e), n = n.replace(ct, "='$1']"), !(!w.matchesSelector || !O || V[n + " "] || R && R.test(n) || q && q.test(n))) try {
                var r = P.call(e, n);
                if (r || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
            } catch (i) {}
            return t(n, L, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== L && H(e), M(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== L && H(e);
            var n = S.attrHandle[t.toLowerCase()],
                r = n && J.call(S.attrHandle, t.toLowerCase()) ? n(e, t, !O) : void 0;
            return void 0 !== r ? r : w.attributes || !O ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                r = 0,
                i = 0;
            if (j = !w.detectDuplicates, A = !w.sortStable && e.slice(0), e.sort(U), j) {
                for (; t = e[i++];) t === e[i] && (r = n.push(i));
                for (; r--;) e.splice(n[r], 1)
            }
            return A = null, e
        }, k = t.getText = function(e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += k(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[r++];) n += k(t);
            return n
        }, S = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: dt,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(xt, wt), e[3] = (e[3] || e[4] || e[5] || "").replace(xt, wt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return dt.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pt.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(xt, wt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = z[e + " "];
                    return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && z(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(at, " ") + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        a = "last" !== e.slice(-4),
                        s = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var u, c, p, h, d, f, m = o !== a ? "nextSibling" : "previousSibling",
                            g = t.parentNode,
                            y = s && t.nodeName.toLowerCase(),
                            v = !l && !s,
                            b = !1;
                        if (g) {
                            if (o) {
                                for (; m;) {
                                    for (h = t; h = h[m];)
                                        if (s ? h.nodeName.toLowerCase() === y : 1 === h.nodeType) return !1;
                                    f = m = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [a ? g.firstChild : g.lastChild], a && v) {
                                for (h = g, p = h[$] || (h[$] = {}), c = p[h.uniqueID] || (p[h.uniqueID] = {}), u = c[e] || [], d = u[0] === I && u[1], b = d && u[2], h = d && g.childNodes[d]; h = ++d && h && h[m] || (b = d = 0) || f.pop();)
                                    if (1 === h.nodeType && ++b && h === t) {
                                        c[e] = [I, d, b];
                                        break
                                    }
                            } else if (v && (h = t, p = h[$] || (h[$] = {}), c = p[h.uniqueID] || (p[h.uniqueID] = {}), u = c[e] || [], d = u[0] === I && u[1], b = d), b === !1)
                                for (;
                                    (h = ++d && h && h[m] || (b = d = 0) || f.pop()) && ((s ? h.nodeName.toLowerCase() !== y : 1 !== h.nodeType) || !++b || (v && (p = h[$] || (h[$] = {}), c = p[h.uniqueID] || (p[h.uniqueID] = {}), c[e] = [I, b]), h !== t)););
                            return b -= i, b === r || b % r === 0 && b / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = S.pseudos[e] || S.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[$] ? o(n) : o.length > 1 ? (i = [e, e, "", n], S.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), a = i.length; a--;) r = et(e, i[a]), e[r] = !(t[r] = i[a])
                    }) : function(e) {
                        return o(e, 0, i)
                    }) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = [],
                        n = [],
                        i = C(e.replace(st, "$1"));
                    return i[$] ? r(function(e, t, n, r) {
                        for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function(e, r, o) {
                        return t[0] = e, i(t, null, o, n), t[0] = null, !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function(e) {
                    return e = e.replace(xt, wt),
                        function(t) {
                            return (t.textContent || t.innerText || k(t)).indexOf(e) > -1
                        }
                }),
                lang: r(function(e) {
                    return ht.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xt, wt).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === D
                },
                focus: function(e) {
                    return e === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !S.pseudos.empty(e)
                },
                header: function(e) {
                    return mt.test(e.nodeName)
                },
                input: function(e) {
                    return ft.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: u(function() {
                    return [0]
                }),
                last: u(function(e, t) {
                    return [t - 1]
                }),
                eq: u(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: u(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: u(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                    return e
                }),
                gt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                    return e
                })
            }
        }, S.pseudos.nth = S.pseudos.eq;
        for (x in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) S.pseudos[x] = s(x);
        for (x in {
            submit: !0,
            reset: !0
        }) S.pseudos[x] = l(x);
        return p.prototype = S.filters = S.pseudos, S.setFilters = new p, E = t.tokenize = function(e, n) {
            var r, i, o, a, s, l, u, c = W[e + " "];
            if (c) return n ? 0 : c.slice(0);
            for (s = e, l = [], u = S.preFilter; s;) {
                r && !(i = lt.exec(s)) || (i && (s = s.slice(i[0].length) || s), l.push(o = [])), r = !1, (i = ut.exec(s)) && (r = i.shift(), o.push({
                    value: r,
                    type: i[0].replace(st, " ")
                }), s = s.slice(r.length));
                for (a in S.filter) !(i = dt[a].exec(s)) || u[a] && !(i = u[a](i)) || (r = i.shift(), o.push({
                    value: r,
                    type: a,
                    matches: i
                }), s = s.slice(r.length));
                if (!r) break
            }
            return n ? s.length : s ? t.error(e) : W(e, l).slice(0)
        }, C = t.compile = function(e, t) {
            var n, r = [],
                i = [],
                o = V[e + " "];
            if (!o) {
                for (t || (t = E(e)), n = t.length; n--;) o = v(t[n]), o[$] ? r.push(o) : i.push(o);
                o = V(e, b(i, r)), o.selector = e
            }
            return o
        }, N = t.select = function(e, t, n, r) {
            var i, o, a, s, l, u = "function" == typeof e && e,
                p = !r && E(e = u.selector || e);
            if (n = n || [], 1 === p.length) {
                if (o = p[0] = p[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && w.getById && 9 === t.nodeType && O && S.relative[o[1].type]) {
                    if (t = (S.find.ID(a.matches[0].replace(xt, wt), t) || [])[0], !t) return n;
                    u && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (i = dt.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !S.relative[s = a.type]);)
                    if ((l = S.find[s]) && (r = l(a.matches[0].replace(xt, wt), vt.test(o[0].type) && c(t.parentNode) || t))) {
                        if (o.splice(i, 1), e = r.length && h(o), !e) return Y.apply(n, r), n;
                        break
                    }
            }
            return (u || C(e, p))(r, t, !O, n, !t || vt.test(e) && c(t.parentNode) || t), n
        }, w.sortStable = $.split("").sort(U).join("") === $, w.detectDuplicates = !!j, H(), w.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(L.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), w.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(tt, function(e, t, n) {
            var r;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), t
    }(e);
    dt.find = vt, dt.expr = vt.selectors, dt.expr[":"] = dt.expr.pseudos, dt.uniqueSort = dt.unique = vt.uniqueSort, dt.text = vt.getText, dt.isXMLDoc = vt.isXML, dt.contains = vt.contains;
    var bt = function(e, t, n) {
            for (var r = [], i = void 0 !== n;
                 (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (i && dt(e).is(n)) break;
                    r.push(e)
                }
            return r
        },
        xt = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        wt = dt.expr.match.needsContext,
        St = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        kt = /^.[^:#\[\.,]*$/;
    dt.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? dt.find.matchesSelector(r, e) ? [r] : [] : dt.find.matches(e, dt.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, dt.fn.extend({
        find: function(e) {
            var t, n = [],
                r = this,
                i = r.length;
            if ("string" != typeof e) return this.pushStack(dt(e).filter(function() {
                for (t = 0; i > t; t++)
                    if (dt.contains(r[t], this)) return !0
            }));
            for (t = 0; i > t; t++) dt.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? dt.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(r(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(r(this, e || [], !0))
        },
        is: function(e) {
            return !!r(this, "string" == typeof e && wt.test(e) ? dt(e) : e || [], !1).length
        }
    });
    var Tt, Et = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        Ct = dt.fn.init = function(e, t, n) {
            var r, i;
            if (!e) return this;
            if (n = n || Tt, "string" == typeof e) {
                if (r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : Et.exec(e), !r || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                if (r[1]) {
                    if (t = t instanceof dt ? t[0] : t, dt.merge(this, dt.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : rt, !0)), St.test(r[1]) && dt.isPlainObject(t))
                        for (r in t) dt.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                    return this
                }
                if (i = rt.getElementById(r[2]), i && i.parentNode) {
                    if (i.id !== r[2]) return Tt.find(e);
                    this.length = 1, this[0] = i
                }
                return this.context = rt, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : dt.isFunction(e) ? "undefined" != typeof n.ready ? n.ready(e) : e(dt) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), dt.makeArray(e, this))
        };
    Ct.prototype = dt.fn, Tt = dt(rt);
    var Nt = /^(?:parents|prev(?:Until|All))/,
        _t = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    dt.fn.extend({
        has: function(e) {
            var t, n = dt(e, this),
                r = n.length;
            return this.filter(function() {
                for (t = 0; r > t; t++)
                    if (dt.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, r = 0, i = this.length, o = [], a = wt.test(e) || "string" != typeof e ? dt(e, t || this.context) : 0; i > r; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && dt.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? dt.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? dt.inArray(this[0], dt(e)) : dt.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(dt.uniqueSort(dt.merge(this.get(), dt(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), dt.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return bt(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return bt(e, "parentNode", n)
        },
        next: function(e) {
            return i(e, "nextSibling")
        },
        prev: function(e) {
            return i(e, "previousSibling")
        },
        nextAll: function(e) {
            return bt(e, "nextSibling")
        },
        prevAll: function(e) {
            return bt(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return bt(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return bt(e, "previousSibling", n)
        },
        siblings: function(e) {
            return xt((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return xt(e.firstChild)
        },
        contents: function(e) {
            return dt.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : dt.merge([], e.childNodes)
        }
    }, function(e, t) {
        dt.fn[e] = function(n, r) {
            var i = dt.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = dt.filter(r, i)), this.length > 1 && (_t[e] || (i = dt.uniqueSort(i)), Nt.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    });
    var At = /\S+/g;
    dt.Callbacks = function(e) {
        e = "string" == typeof e ? o(e) : dt.extend({}, e);
        var t, n, r, i, a = [],
            s = [],
            l = -1,
            u = function() {
                for (i = e.once, r = t = !0; s.length; l = -1)
                    for (n = s.shift(); ++l < a.length;) a[l].apply(n[0], n[1]) === !1 && e.stopOnFalse && (l = a.length, n = !1);
                e.memory || (n = !1), t = !1, i && (a = n ? [] : "")
            },
            c = {
                add: function() {
                    return a && (n && !t && (l = a.length - 1, s.push(n)), function r(t) {
                        dt.each(t, function(t, n) {
                            dt.isFunction(n) ? e.unique && c.has(n) || a.push(n) : n && n.length && "string" !== dt.type(n) && r(n)
                        })
                    }(arguments), n && !t && u()), this
                },
                remove: function() {
                    return dt.each(arguments, function(e, t) {
                        for (var n;
                             (n = dt.inArray(t, a, n)) > -1;) a.splice(n, 1), l >= n && l--
                    }), this
                },
                has: function(e) {
                    return e ? dt.inArray(e, a) > -1 : a.length > 0
                },
                empty: function() {
                    return a && (a = []), this
                },
                disable: function() {
                    return i = s = [], a = n = "", this
                },
                disabled: function() {
                    return !a
                },
                lock: function() {
                    return i = !0, n || c.disable(), this
                },
                locked: function() {
                    return !!i
                },
                fireWith: function(e, n) {
                    return i || (n = n || [], n = [e, n.slice ? n.slice() : n], s.push(n), t || u()), this
                },
                fire: function() {
                    return c.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return c
    }, dt.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", dt.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", dt.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", dt.Callbacks("memory")]
                ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return dt.Deferred(function(n) {
                            dt.each(t, function(t, o) {
                                var a = dt.isFunction(e[t]) && e[t];
                                i[o[1]](function() {
                                    var e = a && a.apply(this, arguments);
                                    e && dt.isFunction(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[o[0] + "With"](this === r ? n.promise() : this, a ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? dt.extend(e, r) : r
                    }
                },
                i = {};
            return r.pipe = r.then, dt.each(t, function(e, o) {
                var a = o[2],
                    s = o[3];
                r[o[1]] = a.add, s && a.add(function() {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                    return i[o[0] + "With"](this === i ? r : this, arguments), this
                }, i[o[0] + "With"] = a.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t, n, r, i = 0,
                o = it.call(arguments),
                a = o.length,
                s = 1 !== a || e && dt.isFunction(e.promise) ? a : 0,
                l = 1 === s ? e : dt.Deferred(),
                u = function(e, n, r) {
                    return function(i) {
                        n[e] = this, r[e] = arguments.length > 1 ? it.call(arguments) : i, r === t ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                    }
                };
            if (a > 1)
                for (t = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && dt.isFunction(o[i].promise) ? o[i].promise().progress(u(i, n, t)).done(u(i, r, o)).fail(l.reject) : --s;
            return s || l.resolveWith(r, o), l.promise()
        }
    });
    var jt;
    dt.fn.ready = function(e) {
        return dt.ready.promise().done(e), this
    }, dt.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? dt.readyWait++ : dt.ready(!0)
        },
        ready: function(e) {
            (e === !0 ? --dt.readyWait : dt.isReady) || (dt.isReady = !0, e !== !0 && --dt.readyWait > 0 || (jt.resolveWith(rt, [dt]), dt.fn.triggerHandler && (dt(rt).triggerHandler("ready"), dt(rt).off("ready"))))
        }
    }), dt.ready.promise = function(t) {
        if (!jt)
            if (jt = dt.Deferred(), "complete" === rt.readyState || "loading" !== rt.readyState && !rt.documentElement.doScroll) e.setTimeout(dt.ready);
            else if (rt.addEventListener) rt.addEventListener("DOMContentLoaded", s), e.addEventListener("load", s);
            else {
                rt.attachEvent("onreadystatechange", s), e.attachEvent("onload", s);
                var n = !1;
                try {
                    n = null == e.frameElement && rt.documentElement
                } catch (r) {}
                n && n.doScroll && ! function i() {
                    if (!dt.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (t) {
                            return e.setTimeout(i, 50)
                        }
                        a(), dt.ready()
                    }
                }()
            }
        return jt.promise(t)
    }, dt.ready.promise();
    var Ht;
    for (Ht in dt(pt)) break;
    pt.ownFirst = "0" === Ht, pt.inlineBlockNeedsLayout = !1, dt(function() {
        var e, t, n, r;
        n = rt.getElementsByTagName("body")[0], n && n.style && (t = rt.createElement("div"), r = rt.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(r).appendChild(t), "undefined" != typeof t.style.zoom && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", pt.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(r))
    }),
        function() {
            var e = rt.createElement("div");
            pt.deleteExpando = !0;
            try {
                delete e.test
            } catch (t) {
                pt.deleteExpando = !1
            }
            e = null
        }();
    var Lt = function(e) {
            var t = dt.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
        },
        Dt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Ot = /([A-Z])/g;
    dt.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? dt.cache[e[dt.expando]] : e[dt.expando], !!e && !u(e)
        },
        data: function(e, t, n) {
            return c(e, t, n)
        },
        removeData: function(e, t) {
            return p(e, t)
        },
        _data: function(e, t, n) {
            return c(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return p(e, t, !0)
        }
    }), dt.fn.extend({
        data: function(e, t) {
            var n, r, i, o = this[0],
                a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = dt.data(o), 1 === o.nodeType && !dt._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--;) a[n] && (r = a[n].name, 0 === r.indexOf("data-") && (r = dt.camelCase(r.slice(5)), l(o, r, i[r])));
                    dt._data(o, "parsedAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                dt.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                dt.data(this, e, t)
            }) : o ? l(o, e, dt.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                dt.removeData(this, e)
            })
        }
    }), dt.extend({
        queue: function(e, t, n) {
            var r;
            return e ? (t = (t || "fx") + "queue", r = dt._data(e, t), n && (!r || dt.isArray(n) ? r = dt._data(e, t, dt.makeArray(n)) : r.push(n)), r || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = dt.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = dt._queueHooks(e, t),
                a = function() {
                    dt.dequeue(e, t)
                };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return dt._data(e, n) || dt._data(e, n, {
                empty: dt.Callbacks("once memory").add(function() {
                    dt._removeData(e, t + "queue"), dt._removeData(e, n)
                })
            })
        }
    }), dt.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? dt.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = dt.queue(this, e, t);
                dt._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && dt.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                dt.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1,
                i = dt.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --r || i.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = dt._data(o[a], e + "queueHooks"), n && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    }),
        function() {
            var e;
            pt.shrinkWrapBlocks = function() {
                if (null != e) return e;
                e = !1;
                var t, n, r;
                return n = rt.getElementsByTagName("body")[0], n && n.style ? (t = rt.createElement("div"), r = rt.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(r).appendChild(t), "undefined" != typeof t.style.zoom && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(rt.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(r), e) : void 0
            }
        }();
    var qt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Rt = new RegExp("^(?:([+-])=|)(" + qt + ")([a-z%]*)$", "i"),
        Pt = ["Top", "Right", "Bottom", "Left"],
        Mt = function(e, t) {
            return e = t || e, "none" === dt.css(e, "display") || !dt.contains(e.ownerDocument, e)
        },
        $t = function(e, t, n, r, i, o, a) {
            var s = 0,
                l = e.length,
                u = null == n;
            if ("object" === dt.type(n)) {
                i = !0;
                for (s in n) $t(e, t, s, n[s], !0, o, a)
            } else if (void 0 !== r && (i = !0, dt.isFunction(r) || (a = !0), u && (a ? (t.call(e, r), t = null) : (u = t, t = function(e, t, n) {
                    return u.call(dt(e), n)
                })), t))
                for (; l > s; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
        },
        Ft = /^(?:checkbox|radio)$/i,
        It = /<([\w:-]+)/,
        Bt = /^$|\/(?:java|ecma)script/i,
        zt = /^\s+/,
        Wt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    ! function() {
        var e = rt.createElement("div"),
            t = rt.createDocumentFragment(),
            n = rt.createElement("input");
        e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", pt.leadingWhitespace = 3 === e.firstChild.nodeType, pt.tbody = !e.getElementsByTagName("tbody").length, pt.htmlSerialize = !!e.getElementsByTagName("link").length, pt.html5Clone = "<:nav></:nav>" !== rt.createElement("nav").cloneNode(!0).outerHTML, n.type = "checkbox", n.checked = !0, t.appendChild(n), pt.appendChecked = n.checked, e.innerHTML = "<textarea>x</textarea>", pt.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue, t.appendChild(e), n = rt.createElement("input"), n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), e.appendChild(n), pt.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, pt.noCloneEvent = !!e.addEventListener, e[dt.expando] = 1, pt.attributes = !e.getAttribute(dt.expando)
    }();
    var Vt = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: pt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Vt.optgroup = Vt.option, Vt.tbody = Vt.tfoot = Vt.colgroup = Vt.caption = Vt.thead, Vt.th = Vt.td;
    var Ut = /<|&#?\w+;/,
        Xt = /<tbody/i;
    ! function() {
        var t, n, r = rt.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        }) n = "on" + t, (pt[t] = n in e) || (r.setAttribute(n, "t"), pt[t] = r.attributes[n].expando === !1);
        r = null
    }();
    var Jt = /^(?:input|select|textarea)$/i,
        Qt = /^key/,
        Gt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        Kt = /^(?:focusinfocus|focusoutblur)$/,
        Yt = /^([^.]*)(?:\.(.+)|)/;
    dt.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, l, u, c, p, h, d, f, m, g = dt._data(e);
            if (g) {
                for (n.handler && (l = n, n = l.handler, i = l.selector), n.guid || (n.guid = dt.guid++), (a = g.events) || (a = g.events = {}), (c = g.handle) || (c = g.handle = function(e) {
                    return "undefined" == typeof dt || e && dt.event.triggered === e.type ? void 0 : dt.event.dispatch.apply(c.elem, arguments)
                }, c.elem = e), t = (t || "").match(At) || [""], s = t.length; s--;) o = Yt.exec(t[s]) || [], d = m = o[1], f = (o[2] || "").split(".").sort(), d && (u = dt.event.special[d] || {}, d = (i ? u.delegateType : u.bindType) || d, u = dt.event.special[d] || {}, p = dt.extend({
                    type: d,
                    origType: m,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && dt.expr.match.needsContext.test(i),
                    namespace: f.join(".")
                }, l), (h = a[d]) || (h = a[d] = [], h.delegateCount = 0, u.setup && u.setup.call(e, r, f, c) !== !1 || (e.addEventListener ? e.addEventListener(d, c, !1) : e.attachEvent && e.attachEvent("on" + d, c))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), i ? h.splice(h.delegateCount++, 0, p) : h.push(p), dt.event.global[d] = !0);
                e = null
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, l, u, c, p, h, d, f, m, g = dt.hasData(e) && dt._data(e);
            if (g && (c = g.events)) {
                for (t = (t || "").match(At) || [""], u = t.length; u--;)
                    if (s = Yt.exec(t[u]) || [], d = m = s[1], f = (s[2] || "").split(".").sort(), d) {
                        for (p = dt.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, h = c[d] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = h.length; o--;) a = h[o], !i && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (h.splice(o, 1), a.selector && h.delegateCount--, p.remove && p.remove.call(e, a));
                        l && !h.length && (p.teardown && p.teardown.call(e, f, g.handle) !== !1 || dt.removeEvent(e, d, g.handle), delete c[d])
                    } else
                        for (d in c) dt.event.remove(e, d + t[u], n, r, !0);
                dt.isEmptyObject(c) && (delete g.handle, dt._removeData(e, "events"))
            }
        },
        trigger: function(t, n, r, i) {
            var o, a, s, l, u, c, p, h = [r || rt],
                d = ct.call(t, "type") ? t.type : t,
                f = ct.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = c = r = r || rt, 3 !== r.nodeType && 8 !== r.nodeType && !Kt.test(d + dt.event.triggered) && (d.indexOf(".") > -1 && (f = d.split("."), d = f.shift(), f.sort()), a = d.indexOf(":") < 0 && "on" + d, t = t[dt.expando] ? t : new dt.Event(d, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = f.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : dt.makeArray(n, [t]), u = dt.event.special[d] || {}, i || !u.trigger || u.trigger.apply(r, n) !== !1)) {
                if (!i && !u.noBubble && !dt.isWindow(r)) {
                    for (l = u.delegateType || d, Kt.test(l + d) || (s = s.parentNode); s; s = s.parentNode) h.push(s), c = s;
                    c === (r.ownerDocument || rt) && h.push(c.defaultView || c.parentWindow || e)
                }
                for (p = 0;
                     (s = h[p++]) && !t.isPropagationStopped();) t.type = p > 1 ? l : u.bindType || d, o = (dt._data(s, "events") || {})[t.type] && dt._data(s, "handle"), o && o.apply(s, n), o = a && s[a], o && o.apply && Lt(s) && (t.result = o.apply(s, n), t.result === !1 && t.preventDefault());
                if (t.type = d, !i && !t.isDefaultPrevented() && (!u._default || u._default.apply(h.pop(), n) === !1) && Lt(r) && a && r[d] && !dt.isWindow(r)) {
                    c = r[a], c && (r[a] = null), dt.event.triggered = d;
                    try {
                        r[d]()
                    } catch (m) {}
                    dt.event.triggered = void 0, c && (r[a] = c)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = dt.event.fix(e);
            var t, n, r, i, o, a = [],
                s = it.call(arguments),
                l = (dt._data(this, "events") || {})[e.type] || [],
                u = dt.event.special[e.type] || {};
            if (s[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                for (a = dt.event.handlers.call(this, e, l), t = 0;
                     (i = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = i.elem, n = 0;
                         (o = i.handlers[n++]) && !e.isImmediatePropagationStopped();) e.rnamespace && !e.rnamespace.test(o.namespace) || (e.handleObj = o, e.data = o.data, r = ((dt.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s), void 0 !== r && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (r = [], n = 0; s > n; n++) o = t[n], i = o.selector + " ", void 0 === r[i] && (r[i] = o.needsContext ? dt(i, this).index(l) > -1 : dt.find(i, this, null, [l]).length), r[i] && r.push(o);
                        r.length && a.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function(e) {
            if (e[dt.expando]) return e;
            var t, n, r, i = e.type,
                o = e,
                a = this.fixHooks[i];
            for (a || (this.fixHooks[i] = a = Gt.test(i) ? this.mouseHooks : Qt.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new dt.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || rt), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (r = e.target.ownerDocument || rt, i = r.documentElement, n = r.body, e.pageX = t.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== x() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === x() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return dt.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return dt.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n) {
            var r = dt.extend(new dt.Event, n, {
                type: e,
                isSimulated: !0
            });
            dt.event.trigger(r, null, t), r.isDefaultPrevented() && n.preventDefault()
        }
    }, dt.removeEvent = rt.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    } : function(e, t, n) {
        var r = "on" + t;
        e.detachEvent && ("undefined" == typeof e[r] && (e[r] = null), e.detachEvent(r, n))
    }, dt.Event = function(e, t) {
        return this instanceof dt.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? v : b) : this.type = e, t && dt.extend(this, t), this.timeStamp = e && e.timeStamp || dt.now(), void(this[dt.expando] = !0)) : new dt.Event(e, t)
    }, dt.Event.prototype = {
        constructor: dt.Event,
        isDefaultPrevented: b,
        isPropagationStopped: b,
        isImmediatePropagationStopped: b,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = v, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = v, e && !this.isSimulated && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = v, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, dt.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        dt.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = this,
                    i = e.relatedTarget,
                    o = e.handleObj;
                return i && (i === r || dt.contains(r, i)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), pt.submit || (dt.event.special.submit = {
        setup: function() {
            return dt.nodeName(this, "form") ? !1 : void dt.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = dt.nodeName(t, "input") || dt.nodeName(t, "button") ? dt.prop(t, "form") : void 0;
                n && !dt._data(n, "submit") && (dt.event.add(n, "submit._submit", function(e) {
                    e._submitBubble = !0
                }), dt._data(n, "submit", !0))
            })
        },
        postDispatch: function(e) {
            e._submitBubble && (delete e._submitBubble, this.parentNode && !e.isTrigger && dt.event.simulate("submit", this.parentNode, e))
        },
        teardown: function() {
            return dt.nodeName(this, "form") ? !1 : void dt.event.remove(this, "._submit")
        }
    }), pt.change || (dt.event.special.change = {
        setup: function() {
            return Jt.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (dt.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._justChanged = !0)
            }), dt.event.add(this, "click._change", function(e) {
                this._justChanged && !e.isTrigger && (this._justChanged = !1), dt.event.simulate("change", this, e)
            })), !1) : void dt.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Jt.test(t.nodeName) && !dt._data(t, "change") && (dt.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || dt.event.simulate("change", this.parentNode, e)
                }), dt._data(t, "change", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return dt.event.remove(this, "._change"), !Jt.test(this.nodeName)
        }
    }), pt.focusin || dt.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            dt.event.simulate(t, e.target, dt.event.fix(e))
        };
        dt.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this,
                    i = dt._data(r, t);
                i || r.addEventListener(e, n, !0), dt._data(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this,
                    i = dt._data(r, t) - 1;
                i ? dt._data(r, t, i) : (r.removeEventListener(e, n, !0), dt._removeData(r, t))
            }
        }
    }), dt.fn.extend({
        on: function(e, t, n, r) {
            return w(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return w(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj, dt(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return t !== !1 && "function" != typeof t || (n = t, t = void 0), n === !1 && (n = b), this.each(function() {
                dt.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                dt.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? dt.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Zt = / jQuery\d+="(?:null|\d+)"/g,
        en = new RegExp("<(?:" + Wt + ")[\\s/>]", "i"),
        tn = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        nn = /<script|<style|<link/i,
        rn = /checked\s*(?:[^=]|=\s*.checked.)/i,
        on = /^true\/(.*)/,
        an = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        sn = d(rt),
        ln = sn.appendChild(rt.createElement("div"));
    dt.extend({
        htmlPrefilter: function(e) {
            return e.replace(tn, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, l = dt.contains(e.ownerDocument, e);
            if (pt.html5Clone || dt.isXMLDoc(e) || !en.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (ln.innerHTML = e.outerHTML, ln.removeChild(o = ln.firstChild)), !(pt.noCloneEvent && pt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || dt.isXMLDoc(e)))
                for (r = f(o), s = f(e), a = 0; null != (i = s[a]); ++a) r[a] && C(i, r[a]);
            if (t)
                if (n)
                    for (s = s || f(e), r = r || f(o), a = 0; null != (i = s[a]); a++) E(i, r[a]);
                else E(e, o);
            return r = f(o, "script"), r.length > 0 && m(r, !l && f(e, "script")), r = s = i = null, o
        },
        cleanData: function(e, t) {
            for (var n, r, i, o, a = 0, s = dt.expando, l = dt.cache, u = pt.attributes, c = dt.event.special; null != (n = e[a]); a++)
                if ((t || Lt(n)) && (i = n[s], o = i && l[i])) {
                    if (o.events)
                        for (r in o.events) c[r] ? dt.event.remove(n, r) : dt.removeEvent(n, r, o.handle);
                    l[i] && (delete l[i], u || "undefined" == typeof n.removeAttribute ? n[s] = void 0 : n.removeAttribute(s), nt.push(i))
                }
        }
    }), dt.fn.extend({
        domManip: N,
        detach: function(e) {
            return _(this, e, !0)
        },
        remove: function(e) {
            return _(this, e)
        },
        text: function(e) {
            return $t(this, function(e) {
                return void 0 === e ? dt.text(this) : this.empty().append((this[0] && this[0].ownerDocument || rt).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return N(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = S(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return N(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = S(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return N(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return N(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && dt.cleanData(f(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && dt.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return dt.clone(this, e, t)
            })
        },
        html: function(e) {
            return $t(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    r = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Zt, "") : void 0;
                if (!("string" != typeof e || nn.test(e) || !pt.htmlSerialize && en.test(e) || !pt.leadingWhitespace && zt.test(e) || Vt[(It.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = dt.htmlPrefilter(e);
                    try {
                        for (; r > n; n++) t = this[n] || {}, 1 === t.nodeType && (dt.cleanData(f(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (i) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return N(this, arguments, function(t) {
                var n = this.parentNode;
                dt.inArray(this, e) < 0 && (dt.cleanData(f(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), dt.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        dt.fn[e] = function(e) {
            for (var n, r = 0, i = [], o = dt(e), a = o.length - 1; a >= r; r++) n = r === a ? this : this.clone(!0), dt(o[r])[t](n), at.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var un, cn = {
            HTML: "block",
            BODY: "block"
        },
        pn = /^margin/,
        hn = new RegExp("^(" + qt + ")(?!px)[a-z%]+$", "i"),
        dn = function(e, t, n, r) {
            var i, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t) e.style[o] = a[o];
            return i
        },
        fn = rt.documentElement;
    ! function() {
        function t() {
            var t, c, p = rt.documentElement;
            p.appendChild(l), u.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", n = i = s = !1, r = a = !0, e.getComputedStyle && (c = e.getComputedStyle(u), n = "1%" !== (c || {}).top, s = "2px" === (c || {}).marginLeft, i = "4px" === (c || {
                width: "4px"
            }).width, u.style.marginRight = "50%", r = "4px" === (c || {
                marginRight: "4px"
            }).marginRight, t = u.appendChild(rt.createElement("div")), t.style.cssText = u.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", u.style.width = "1px", a = !parseFloat((e.getComputedStyle(t) || {}).marginRight), u.removeChild(t)), u.style.display = "none", o = 0 === u.getClientRects().length, o && (u.style.display = "", u.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", u.childNodes[0].style.borderCollapse = "separate", t = u.getElementsByTagName("td"), t[0].style.cssText = "margin:0;border:0;padding:0;display:none", o = 0 === t[0].offsetHeight, o && (t[0].style.display = "", t[1].style.display = "none", o = 0 === t[0].offsetHeight)), p.removeChild(l)
        }
        var n, r, i, o, a, s, l = rt.createElement("div"),
            u = rt.createElement("div");
        u.style && (u.style.cssText = "float:left;opacity:.5", pt.opacity = "0.5" === u.style.opacity, pt.cssFloat = !!u.style.cssFloat, u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", pt.clearCloneStyle = "content-box" === u.style.backgroundClip, l = rt.createElement("div"), l.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", u.innerHTML = "", l.appendChild(u), pt.boxSizing = "" === u.style.boxSizing || "" === u.style.MozBoxSizing || "" === u.style.WebkitBoxSizing, dt.extend(pt, {
            reliableHiddenOffsets: function() {
                return null == n && t(), o
            },
            boxSizingReliable: function() {
                return null == n && t(), i
            },
            pixelMarginRight: function() {
                return null == n && t(), r
            },
            pixelPosition: function() {
                return null == n && t(), n
            },
            reliableMarginRight: function() {
                return null == n && t(), a
            },
            reliableMarginLeft: function() {
                return null == n && t(), s
            }
        }))
    }();
    var mn, gn, yn = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (mn = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e), n.getComputedStyle(t)
    }, gn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || mn(e), a = n ? n.getPropertyValue(t) || n[t] : void 0, "" !== a && void 0 !== a || dt.contains(e.ownerDocument, e) || (a = dt.style(e, t)), n && !pt.pixelMarginRight() && hn.test(a) && pn.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o), void 0 === a ? a : a + ""
    }) : fn.currentStyle && (mn = function(e) {
        return e.currentStyle
    }, gn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || mn(e), a = n ? n[t] : void 0, null == a && s && s[t] && (a = s[t]), hn.test(a) && !yn.test(t) && (r = s.left, i = e.runtimeStyle, o = i && i.left, o && (i.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = r, o && (i.left = o)), void 0 === a ? a : a + "" || "auto"
    });
    var vn = /alpha\([^)]*\)/i,
        bn = /opacity\s*=\s*([^)]*)/i,
        xn = /^(none|table(?!-c[ea]).+)/,
        wn = new RegExp("^(" + qt + ")(.*)$", "i"),
        Sn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        kn = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Tn = ["Webkit", "O", "Moz", "ms"],
        En = rt.createElement("div").style;
    dt.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = gn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": pt.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = dt.camelCase(t),
                    l = e.style;
                if (t = dt.cssProps[s] || (dt.cssProps[s] = L(s) || s), a = dt.cssHooks[t] || dt.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                if (o = typeof n, "string" === o && (i = Rt.exec(n)) && i[1] && (n = h(e, t, i), o = "number"), null != n && n === n && ("number" === o && (n += i && i[3] || (dt.cssNumber[s] ? "" : "px")), pt.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && void 0 === (n = a.set(e, n, r))))) try {
                    l[t] = n
                } catch (u) {}
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = dt.camelCase(t);
            return t = dt.cssProps[s] || (dt.cssProps[s] = L(s) || s), a = dt.cssHooks[t] || dt.cssHooks[s], a && "get" in a && (o = a.get(e, !0, n)), void 0 === o && (o = gn(e, t, r)), "normal" === o && t in kn && (o = kn[t]), "" === n || n ? (i = parseFloat(o), n === !0 || isFinite(i) ? i || 0 : o) : o
        }
    }), dt.each(["height", "width"], function(e, t) {
        dt.cssHooks[t] = {
            get: function(e, n, r) {
                return n ? xn.test(dt.css(e, "display")) && 0 === e.offsetWidth ? dn(e, Sn, function() {
                    return R(e, t, r)
                }) : R(e, t, r) : void 0
            },
            set: function(e, n, r) {
                var i = r && mn(e);
                return O(e, n, r ? q(e, t, r, pt.boxSizing && "border-box" === dt.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), pt.opacity || (dt.cssHooks.opacity = {
        get: function(e, t) {
            return bn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = dt.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = r && r.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === dt.trim(o.replace(vn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = vn.test(o) ? o.replace(vn, i) : o + " " + i)
        }
    }), dt.cssHooks.marginRight = H(pt.reliableMarginRight, function(e, t) {
        return t ? dn(e, {
            display: "inline-block"
        }, gn, [e, "marginRight"]) : void 0
    }), dt.cssHooks.marginLeft = H(pt.reliableMarginLeft, function(e, t) {
        return t ? (parseFloat(gn(e, "marginLeft")) || (dt.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - dn(e, {
            marginLeft: 0
        }, function() {
            return e.getBoundingClientRect().left
        }) : 0)) + "px" : void 0
    }), dt.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        dt.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + Pt[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, pn.test(e) || (dt.cssHooks[e + t].set = O)
    }), dt.fn.extend({
        css: function(e, t) {
            return $t(this, function(e, t, n) {
                var r, i, o = {},
                    a = 0;
                if (dt.isArray(t)) {
                    for (r = mn(e), i = t.length; i > a; a++) o[t[a]] = dt.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? dt.style(e, t, n) : dt.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return D(this, !0)
        },
        hide: function() {
            return D(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Mt(this) ? dt(this).show() : dt(this).hide()
            })
        }
    }), dt.Tween = P, P.prototype = {
        constructor: P,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || dt.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (dt.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = P.propHooks[this.prop];
            return e && e.get ? e.get(this) : P.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = P.propHooks[this.prop];
            return this.pos = t = this.options.duration ? dt.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : P.propHooks._default.set(this), this
        }
    }, P.prototype.init.prototype = P.prototype, P.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = dt.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0)
            },
            set: function(e) {
                dt.fx.step[e.prop] ? dt.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[dt.cssProps[e.prop]] && !dt.cssHooks[e.prop] ? e.elem[e.prop] = e.now : dt.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, P.propHooks.scrollTop = P.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, dt.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, dt.fx = P.prototype.init, dt.fx.step = {};
    var Cn, Nn, _n = /^(?:toggle|show|hide)$/,
        An = /queueHooks$/;
    dt.Animation = dt.extend(z, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return h(n.elem, e, Rt.exec(t), n), n
            }]
        },
        tweener: function(e, t) {
            dt.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(At);
            for (var n, r = 0, i = e.length; i > r; r++) n = e[r], z.tweeners[n] = z.tweeners[n] || [], z.tweeners[n].unshift(t)
        },
        prefilters: [I],
        prefilter: function(e, t) {
            t ? z.prefilters.unshift(e) : z.prefilters.push(e)
        }
    }), dt.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? dt.extend({}, e) : {
            complete: n || !n && t || dt.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !dt.isFunction(t) && t
        };
        return r.duration = dt.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in dt.fx.speeds ? dt.fx.speeds[r.duration] : dt.fx.speeds._default, null != r.queue && r.queue !== !0 || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            dt.isFunction(r.old) && r.old.call(this), r.queue && dt.dequeue(this, r.queue)
        }, r
    }, dt.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Mt).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = dt.isEmptyObject(e),
                o = dt.speed(t, n, r),
                a = function() {
                    var t = z(this, dt.extend({}, e), o);
                    (i || dt._data(this, "finish")) && t.stop(!0)
                };
            return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    i = null != e && e + "queueHooks",
                    o = dt.timers,
                    a = dt._data(this);
                if (i) a[i] && a[i].stop && r(a[i]);
                else
                    for (i in a) a[i] && a[i].stop && An.test(i) && r(a[i]);
                for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                !t && n || dt.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"), this.each(function() {
                var t, n = dt._data(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    o = dt.timers,
                    a = r ? r.length : 0;
                for (n.finish = !0, dt.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), dt.each(["toggle", "show", "hide"], function(e, t) {
        var n = dt.fn[t];
        dt.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate($(t, !0), e, r, i)
        }
    }), dt.each({
        slideDown: $("show"),
        slideUp: $("hide"),
        slideToggle: $("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        dt.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), dt.timers = [], dt.fx.tick = function() {
        var e, t = dt.timers,
            n = 0;
        for (Cn = dt.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
        t.length || dt.fx.stop(), Cn = void 0
    }, dt.fx.timer = function(e) {
        dt.timers.push(e), e() ? dt.fx.start() : dt.timers.pop()
    }, dt.fx.interval = 13, dt.fx.start = function() {
        Nn || (Nn = e.setInterval(dt.fx.tick, dt.fx.interval))
    }, dt.fx.stop = function() {
        e.clearInterval(Nn), Nn = null
    }, dt.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, dt.fn.delay = function(t, n) {
        return t = dt.fx ? dt.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function(n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function() {
                e.clearTimeout(i)
            }
        })
    },
        function() {
            var e, t = rt.createElement("input"),
                n = rt.createElement("div"),
                r = rt.createElement("select"),
                i = r.appendChild(rt.createElement("option"));
            n = rt.createElement("div"), n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = n.getElementsByTagName("a")[0], t.setAttribute("type", "checkbox"), n.appendChild(t), e = n.getElementsByTagName("a")[0], e.style.cssText = "top:1px", pt.getSetAttribute = "t" !== n.className, pt.style = /top/.test(e.getAttribute("style")), pt.hrefNormalized = "/a" === e.getAttribute("href"), pt.checkOn = !!t.value, pt.optSelected = i.selected, pt.enctype = !!rt.createElement("form").enctype, r.disabled = !0, pt.optDisabled = !i.disabled, t = rt.createElement("input"), t.setAttribute("value", ""), pt.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), pt.radioValue = "t" === t.value
        }();
    var jn = /\r/g,
        Hn = /[\x20\t\r\n\f]+/g;
    dt.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0];
            return arguments.length ? (r = dt.isFunction(e), this.each(function(n) {
                var i;
                1 === this.nodeType && (i = r ? e.call(this, n, dt(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : dt.isArray(i) && (i = dt.map(i, function(e) {
                    return null == e ? "" : e + ""
                })), t = dt.valHooks[this.type] || dt.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            })) : i ? (t = dt.valHooks[i.type] || dt.valHooks[i.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(jn, "") : null == n ? "" : n)) : void 0
        }
    }), dt.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = dt.find.attr(e, "value");
                    return null != t ? t : dt.trim(dt.text(e)).replace(Hn, " ")
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0; s > l; l++)
                        if (n = r[l], !(!n.selected && l !== i || (pt.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && dt.nodeName(n.parentNode, "optgroup"))) {
                            if (t = dt(n).val(), o) return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = dt.makeArray(t), a = i.length; a--;)
                        if (r = i[a], dt.inArray(dt.valHooks.option.get(r), o) > -1) try {
                            r.selected = n = !0
                        } catch (s) {
                            r.scrollHeight
                        } else r.selected = !1;
                    return n || (e.selectedIndex = -1), i
                }
            }
        }
    }), dt.each(["radio", "checkbox"], function() {
        dt.valHooks[this] = {
            set: function(e, t) {
                return dt.isArray(t) ? e.checked = dt.inArray(dt(e).val(), t) > -1 : void 0
            }
        }, pt.checkOn || (dt.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var Ln, Dn, On = dt.expr.attrHandle,
        qn = /^(?:checked|selected)$/i,
        Rn = pt.getSetAttribute,
        Pn = pt.input;
    dt.fn.extend({
        attr: function(e, t) {
            return $t(this, dt.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                dt.removeAttr(this, e)
            })
        }
    }), dt.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            return 3 !== o && 8 !== o && 2 !== o ? "undefined" == typeof e.getAttribute ? dt.prop(e, t, n) : (1 === o && dt.isXMLDoc(e) || (t = t.toLowerCase(), i = dt.attrHooks[t] || (dt.expr.match.bool.test(t) ? Dn : Ln)), void 0 !== n ? null === n ? void dt.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : (r = dt.find.attr(e, t), null == r ? void 0 : r)) : void 0
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!pt.radioValue && "radio" === t && dt.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r, i = 0,
                o = t && t.match(At);
            if (o && 1 === e.nodeType)
                for (; n = o[i++];) r = dt.propFix[n] || n, dt.expr.match.bool.test(n) ? Pn && Rn || !qn.test(n) ? e[r] = !1 : e[dt.camelCase("default-" + n)] = e[r] = !1 : dt.attr(e, n, ""), e.removeAttribute(Rn ? n : r)
        }
    }), Dn = {
        set: function(e, t, n) {
            return t === !1 ? dt.removeAttr(e, n) : Pn && Rn || !qn.test(n) ? e.setAttribute(!Rn && dt.propFix[n] || n, n) : e[dt.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, dt.each(dt.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = On[t] || dt.find.attr;
        On[t] = Pn && Rn || !qn.test(t) ? function(e, t, r) {
            var i, o;
            return r || (o = On[t], On[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, On[t] = o), i
        } : function(e, t, n) {
            return n ? void 0 : e[dt.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), Pn && Rn || (dt.attrHooks.value = {
        set: function(e, t, n) {
            return dt.nodeName(e, "input") ? void(e.defaultValue = t) : Ln && Ln.set(e, t, n)
        }
    }), Rn || (Ln = {
        set: function(e, t, n) {
            var r = e.getAttributeNode(n);
            return r || e.setAttributeNode(r = e.ownerDocument.createAttribute(n)), r.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, On.id = On.name = On.coords = function(e, t, n) {
        var r;
        return n ? void 0 : (r = e.getAttributeNode(t)) && "" !== r.value ? r.value : null
    }, dt.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: Ln.set
    }, dt.attrHooks.contenteditable = {
        set: function(e, t, n) {
            Ln.set(e, "" === t ? !1 : t, n)
        }
    }, dt.each(["width", "height"], function(e, t) {
        dt.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
            }
        }
    })), pt.style || (dt.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Mn = /^(?:input|select|textarea|button|object)$/i,
        $n = /^(?:a|area)$/i;
    dt.fn.extend({
        prop: function(e, t) {
            return $t(this, dt.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = dt.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (t) {}
            })
        }
    }), dt.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            return 3 !== o && 8 !== o && 2 !== o ? (1 === o && dt.isXMLDoc(e) || (t = dt.propFix[t] || t, i = dt.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = dt.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Mn.test(e.nodeName) || $n.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), pt.hrefNormalized || dt.each(["href", "src"], function(e, t) {
        dt.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), pt.optSelected || (dt.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), dt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        dt.propFix[this.toLowerCase()] = this
    }), pt.enctype || (dt.propFix.enctype = "encoding");
    var Fn = /[\t\r\n\f]/g;
    dt.fn.extend({
        addClass: function(e) {
            var t, n, r, i, o, a, s, l = 0;
            if (dt.isFunction(e)) return this.each(function(t) {
                dt(this).addClass(e.call(this, t, W(this)))
            });
            if ("string" == typeof e && e)
                for (t = e.match(At) || []; n = this[l++];)
                    if (i = W(n), r = 1 === n.nodeType && (" " + i + " ").replace(Fn, " ")) {
                        for (a = 0; o = t[a++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        s = dt.trim(r), i !== s && dt.attr(n, "class", s)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, a, s, l = 0;
            if (dt.isFunction(e)) return this.each(function(t) {
                dt(this).removeClass(e.call(this, t, W(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof e && e)
                for (t = e.match(At) || []; n = this[l++];)
                    if (i = W(n), r = 1 === n.nodeType && (" " + i + " ").replace(Fn, " ")) {
                        for (a = 0; o = t[a++];)
                            for (; r.indexOf(" " + o + " ") > -1;) r = r.replace(" " + o + " ", " ");
                        s = dt.trim(r), i !== s && dt.attr(n, "class", s)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(dt.isFunction(e) ? function(n) {
                dt(this).toggleClass(e.call(this, n, W(this), t), t)
            } : function() {
                var t, r, i, o;
                if ("string" === n)
                    for (r = 0, i = dt(this), o = e.match(At) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                else void 0 !== e && "boolean" !== n || (t = W(this), t && dt._data(this, "__className__", t), dt.attr(this, "class", t || e === !1 ? "" : dt._data(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++];)
                if (1 === n.nodeType && (" " + W(n) + " ").replace(Fn, " ").indexOf(t) > -1) return !0;
            return !1
        }
    }), dt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        dt.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), dt.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    });
    var In = e.location,
        Bn = dt.now(),
        zn = /\?/,
        Wn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    dt.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, r = null,
            i = dt.trim(t + "");
        return i && !dt.trim(i.replace(Wn, function(e, t, i, o) {
            return n && t && (r = 0), 0 === r ? e : (n = i || t, r += !o - !i, "")
        })) ? Function("return " + i)() : dt.error("Invalid JSON: " + t)
    }, dt.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (r = new e.DOMParser, n = r.parseFromString(t, "text/xml")) : (n = new e.ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (i) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || dt.error("Invalid XML: " + t), n
    };
    var Vn = /#.*$/,
        Un = /([?&])_=[^&]*/,
        Xn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Jn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Qn = /^(?:GET|HEAD)$/,
        Gn = /^\/\//,
        Kn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Yn = {},
        Zn = {},
        er = "*/".concat("*"),
        tr = In.href,
        nr = Kn.exec(tr.toLowerCase()) || [];
    dt.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: tr,
            type: "GET",
            isLocal: Jn.test(nr[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": er,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": dt.parseJSON,
                "text xml": dt.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? X(X(e, dt.ajaxSettings), t) : X(dt.ajaxSettings, e)
        },
        ajaxPrefilter: V(Yn),
        ajaxTransport: V(Zn),
        ajax: function(t, n) {
            function r(t, n, r, i) {
                var o, p, v, b, w, k = n;
                2 !== x && (x = 2, l && e.clearTimeout(l), c = void 0, s = i || "", S.readyState = t > 0 ? 4 : 0, o = t >= 200 && 300 > t || 304 === t, r && (b = J(h, S, r)), b = Q(h, b, S, o), o ? (h.ifModified && (w = S.getResponseHeader("Last-Modified"), w && (dt.lastModified[a] = w), w = S.getResponseHeader("etag"), w && (dt.etag[a] = w)), 204 === t || "HEAD" === h.type ? k = "nocontent" : 304 === t ? k = "notmodified" : (k = b.state, p = b.data, v = b.error, o = !v)) : (v = k, !t && k || (k = "error", 0 > t && (t = 0))), S.status = t, S.statusText = (n || k) + "", o ? m.resolveWith(d, [p, k, S]) : m.rejectWith(d, [S, k, v]), S.statusCode(y), y = void 0, u && f.trigger(o ? "ajaxSuccess" : "ajaxError", [S, h, o ? p : v]), g.fireWith(d, [S, k]), u && (f.trigger("ajaxComplete", [S, h]), --dt.active || dt.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = void 0), n = n || {};
            var i, o, a, s, l, u, c, p, h = dt.ajaxSetup({}, n),
                d = h.context || h,
                f = h.context && (d.nodeType || d.jquery) ? dt(d) : dt.event,
                m = dt.Deferred(),
                g = dt.Callbacks("once memory"),
                y = h.statusCode || {},
                v = {},
                b = {},
                x = 0,
                w = "canceled",
                S = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === x) {
                            if (!p)
                                for (p = {}; t = Xn.exec(s);) p[t[1].toLowerCase()] = t[2];
                            t = p[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === x ? s : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return x || (e = b[n] = b[n] || e, v[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return x || (h.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > x)
                                for (t in e) y[t] = [y[t], e[t]];
                            else S.always(e[S.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || w;
                        return c && c.abort(t), r(0, t), this
                    }
                };
            if (m.promise(S).complete = g.add, S.success = S.done, S.error = S.fail, h.url = ((t || h.url || tr) + "").replace(Vn, "").replace(Gn, nr[1] + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = dt.trim(h.dataType || "*").toLowerCase().match(At) || [""], null == h.crossDomain && (i = Kn.exec(h.url.toLowerCase()), h.crossDomain = !(!i || i[1] === nr[1] && i[2] === nr[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (nr[3] || ("http:" === nr[1] ? "80" : "443")))), h.data && h.processData && "string" != typeof h.data && (h.data = dt.param(h.data, h.traditional)), U(Yn, h, n, S), 2 === x) return S;
            u = dt.event && h.global, u && 0 === dt.active++ && dt.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Qn.test(h.type), a = h.url, h.hasContent || (h.data && (a = h.url += (zn.test(a) ? "&" : "?") + h.data, delete h.data), h.cache === !1 && (h.url = Un.test(a) ? a.replace(Un, "$1_=" + Bn++) : a + (zn.test(a) ? "&" : "?") + "_=" + Bn++)), h.ifModified && (dt.lastModified[a] && S.setRequestHeader("If-Modified-Since", dt.lastModified[a]), dt.etag[a] && S.setRequestHeader("If-None-Match", dt.etag[a])), (h.data && h.hasContent && h.contentType !== !1 || n.contentType) && S.setRequestHeader("Content-Type", h.contentType), S.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + er + "; q=0.01" : "") : h.accepts["*"]);
            for (o in h.headers) S.setRequestHeader(o, h.headers[o]);
            if (h.beforeSend && (h.beforeSend.call(d, S, h) === !1 || 2 === x)) return S.abort();
            w = "abort";
            for (o in {
                success: 1,
                error: 1,
                complete: 1
            }) S[o](h[o]);
            if (c = U(Zn, h, n, S)) {
                if (S.readyState = 1, u && f.trigger("ajaxSend", [S, h]), 2 === x) return S;
                h.async && h.timeout > 0 && (l = e.setTimeout(function() {
                    S.abort("timeout")
                }, h.timeout));
                try {
                    x = 1, c.send(v, r)
                } catch (k) {
                    if (!(2 > x)) throw k;
                    r(-1, k)
                }
            } else r(-1, "No Transport");
            return S
        },
        getJSON: function(e, t, n) {
            return dt.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return dt.get(e, void 0, t, "script")
        }
    }), dt.each(["get", "post"], function(e, t) {
        dt[t] = function(e, n, r, i) {
            return dt.isFunction(n) && (i = i || r, r = n, n = void 0), dt.ajax(dt.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, dt.isPlainObject(e) && e))
        }
    }), dt._evalUrl = function(e) {
        return dt.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }, dt.fn.extend({
        wrapAll: function(e) {
            if (dt.isFunction(e)) return this.each(function(t) {
                dt(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = dt(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(dt.isFunction(e) ? function(t) {
                dt(this).wrapInner(e.call(this, t))
            } : function() {
                var t = dt(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = dt.isFunction(e);
            return this.each(function(n) {
                dt(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                dt.nodeName(this, "body") || dt(this).replaceWith(this.childNodes)
            }).end()
        }
    }), dt.expr.filters.hidden = function(e) {
        return pt.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : K(e)
    }, dt.expr.filters.visible = function(e) {
        return !dt.expr.filters.hidden(e)
    };
    var rr = /%20/g,
        ir = /\[\]$/,
        or = /\r?\n/g,
        ar = /^(?:submit|button|image|reset|file)$/i,
        sr = /^(?:input|select|textarea|keygen)/i;
    dt.param = function(e, t) {
        var n, r = [],
            i = function(e, t) {
                t = dt.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = dt.ajaxSettings && dt.ajaxSettings.traditional), dt.isArray(e) || e.jquery && !dt.isPlainObject(e)) dt.each(e, function() {
            i(this.name, this.value)
        });
        else
            for (n in e) Y(n, e[n], t, i);
        return r.join("&").replace(rr, "+")
    }, dt.fn.extend({
        serialize: function() {
            return dt.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = dt.prop(this, "elements");
                return e ? dt.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !dt(this).is(":disabled") && sr.test(this.nodeName) && !ar.test(e) && (this.checked || !Ft.test(e))
            }).map(function(e, t) {
                var n = dt(this).val();
                return null == n ? null : dt.isArray(n) ? dt.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(or, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(or, "\r\n")
                }
            }).get()
        }
    }), dt.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return this.isLocal ? et() : rt.documentMode > 8 ? Z() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Z() || et()
    } : Z;
    var lr = 0,
        ur = {},
        cr = dt.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var e in ur) ur[e](void 0, !0)
    }), pt.cors = !!cr && "withCredentials" in cr, cr = pt.ajax = !!cr, cr && dt.ajaxTransport(function(t) {
        if (!t.crossDomain || pt.cors) {
            var n;
            return {
                send: function(r, i) {
                    var o, a = t.xhr(),
                        s = ++lr;
                    if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                        for (o in t.xhrFields) a[o] = t.xhrFields[o];
                    t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                    for (o in r) void 0 !== r[o] && a.setRequestHeader(o, r[o] + "");
                    a.send(t.hasContent && t.data || null), n = function(e, r) {
                        var o, l, u;
                        if (n && (r || 4 === a.readyState))
                            if (delete ur[s], n = void 0, a.onreadystatechange = dt.noop, r) 4 !== a.readyState && a.abort();
                            else {
                                u = {}, o = a.status, "string" == typeof a.responseText && (u.text = a.responseText);
                                try {
                                    l = a.statusText
                                } catch (c) {
                                    l = ""
                                }
                                o || !t.isLocal || t.crossDomain ? 1223 === o && (o = 204) : o = u.text ? 200 : 404
                            }
                        u && i(o, l, u, a.getAllResponseHeaders())
                    }, t.async ? 4 === a.readyState ? e.setTimeout(n) : a.onreadystatechange = ur[s] = n : n()
                },
                abort: function() {
                    n && n(void 0, !0)
                }
            }
        }
    }), dt.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return dt.globalEval(e), e
            }
        }
    }), dt.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), dt.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = rt.head || dt("head")[0] || rt.documentElement;
            return {
                send: function(r, i) {
                    t = rt.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || i(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var pr = [],
        hr = /(=)\?(?=&|$)|\?\?/;
    dt.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = pr.pop() || dt.expando + "_" + Bn++;
            return this[e] = !0, e
        }
    }), dt.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, a, s = t.jsonp !== !1 && (hr.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && hr.test(t.data) && "data");
        return s || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback = dt.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(hr, "$1" + i) : t.jsonp !== !1 && (t.url += (zn.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
            return a || dt.error(i + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
            a = arguments
        }, r.always(function() {
            void 0 === o ? dt(e).removeProp(i) : e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, pr.push(i)), a && dt.isFunction(o) && o(a[0]), a = o = void 0
        }), "script") : void 0
    }), dt.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || rt;
        var r = St.exec(e),
            i = !n && [];
        return r ? [t.createElement(r[1])] : (r = y([e], t, i), i && i.length && dt(i).remove(), dt.merge([], r.childNodes))
    };
    var dr = dt.fn.load;
    dt.fn.load = function(e, t, n) {
        if ("string" != typeof e && dr) return dr.apply(this, arguments);
        var r, i, o, a = this,
            s = e.indexOf(" ");
        return s > -1 && (r = dt.trim(e.slice(s, e.length)), e = e.slice(0, s)), dt.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), a.length > 0 && dt.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, a.html(r ? dt("<div>").append(dt.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, dt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        dt.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), dt.expr.filters.animated = function(e) {
        return dt.grep(dt.timers, function(t) {
            return e === t.elem
        }).length
    }, dt.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, l, u, c = dt.css(e, "position"),
                p = dt(e),
                h = {};
            "static" === c && (e.style.position = "relative"), s = p.offset(), o = dt.css(e, "top"), l = dt.css(e, "left"), u = ("absolute" === c || "fixed" === c) && dt.inArray("auto", [o, l]) > -1, u ? (r = p.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(l) || 0), dt.isFunction(t) && (t = t.call(e, n, dt.extend({}, s))), null != t.top && (h.top = t.top - s.top + a), null != t.left && (h.left = t.left - s.left + i), "using" in t ? t.using.call(e, h) : p.css(h)
        }
    }, dt.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                dt.offset.setOffset(this, e, t)
            });
            var t, n, r = {
                    top: 0,
                    left: 0
                },
                i = this[0],
                o = i && i.ownerDocument;
            return o ? (t = o.documentElement, dt.contains(t, i) ? ("undefined" != typeof i.getBoundingClientRect && (r = i.getBoundingClientRect()), n = tt(o), {
                top: r.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: r.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : r) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    r = this[0];
                return "fixed" === dt.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), dt.nodeName(e[0], "html") || (n = e.offset()), n.top += dt.css(e[0], "borderTopWidth", !0), n.left += dt.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - dt.css(r, "marginTop", !0),
                    left: t.left - n.left - dt.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && !dt.nodeName(e, "html") && "static" === dt.css(e, "position");) e = e.offsetParent;
                return e || fn
            })
        }
    }), dt.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        dt.fn[e] = function(r) {
            return $t(this, function(e, r, i) {
                var o = tt(e);
                return void 0 === i ? o ? t in o ? o[t] : o.document.documentElement[r] : e[r] : void(o ? o.scrollTo(n ? dt(o).scrollLeft() : i, n ? i : dt(o).scrollTop()) : e[r] = i)
            }, e, r, arguments.length, null)
        }
    }), dt.each(["top", "left"], function(e, t) {
        dt.cssHooks[t] = H(pt.pixelPosition, function(e, n) {
            return n ? (n = gn(e, t), hn.test(n) ? dt(e).position()[t] + "px" : n) : void 0
        })
    }), dt.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        dt.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            dt.fn[r] = function(r, i) {
                var o = arguments.length && (n || "boolean" != typeof r),
                    a = n || (r === !0 || i === !0 ? "margin" : "border");
                return $t(this, function(t, n, r) {
                    var i;
                    return dt.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? dt.css(t, n, a) : dt.style(t, n, r, a)
                }, t, o ? r : void 0, o, null)
            }
        })
    }), dt.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), dt.fn.size = function() {
        return this.length
    }, dt.fn.andSelf = dt.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return dt
    });
    var fr = e.jQuery,
        mr = e.$;
    return dt.noConflict = function(t) {
        return e.$ === dt && (e.$ = mr), t && e.jQuery === dt && (e.jQuery = fr), dt
    }, t || (e.jQuery = e.$ = dt), dt
}),
    function(e) {
        e.fn.slideto = function(t) {
            return t = e.extend({
                slide_duration: "slow",
                highlight_duration: 3e3,
                highlight: !0,
                highlight_color: "#FFFF99"
            }, t), this.each(function() {
                obj = e(this), e("body").animate({
                    scrollTop: obj.offset().top
                }, t.slide_duration, function() {
                    t.highlight && e.ui.version && obj.effect("highlight", {
                        color: t.highlight_color
                    }, t.highlight_duration)
                })
            })
        }
    }(jQuery), jQuery.fn.wiggle = function(e) {
    var t = {
            speed: 50,
            wiggles: 3,
            travel: 5,
            callback: null
        },
        e = jQuery.extend(t, e);
    return this.each(function() {
        var t = this,
            n = (jQuery(this).wrap('<div class="wiggle-wrap"></div>').css("position", "relative"), 0);
        for (i = 1; i <= e.wiggles; i++) jQuery(this).animate({
            left: "-=" + e.travel
        }, e.speed).animate({
            left: "+=" + 2 * e.travel
        }, 2 * e.speed).animate({
            left: "-=" + e.travel
        }, e.speed, function() {
            n++, jQuery(t).parent().hasClass("wiggle-wrap") && jQuery(t).parent().replaceWith(t), n == e.wiggles && jQuery.isFunction(e.callback) && e.callback()
        })
    })
}, jQuery.browser = {},
    function() {
        jQuery.browser.msie = !1, jQuery.browser.version = 0, navigator.userAgent.match(/MSIE ([0-9]+)\./) && (jQuery.browser.msie = !0, jQuery.browser.version = RegExp.$1)
    }(),
    function(e, t) {
        function n(e) {
            return "string" == typeof e
        }

        function r(e) {
            var t = y.call(arguments, 1);
            return function() {
                return e.apply(this, t.concat(y.call(arguments)))
            }
        }

        function i(e) {
            return e.replace(/^[^#]*#?(.*)$/, "$1")
        }

        function o(e) {
            return e.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1")
        }

        function a(r, i, o, a, s) {
            var l, c, h, d, f;
            return a !== u ? (h = o.match(r ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/), f = h[3] || "", 2 === s && n(a) ? c = a.replace(r ? j : A, "") : (d = p(h[2]), a = n(a) ? p[r ? T : k](a) : a, c = 2 === s ? a : 1 === s ? e.extend({}, a, d) : e.extend({}, d, a), c = b(c), r && (c = c.replace(g, v))), l = h[1] + (r ? "#" : c || !h[1] ? "?" : "") + c + f) : l = i(o !== u ? o : t[C][N]), l
        }

        function s(e, t, r) {
            return t === u || "boolean" == typeof t ? (r = t, t = b[e ? T : k]()) : t = n(t) ? t.replace(e ? j : A, "") : t, p(t, r)
        }

        function l(t, r, i, o) {
            return n(i) || "object" == typeof i || (o = i, i = r, r = u), this.each(function() {
                var n = e(this),
                    a = r || m()[(this.nodeName || "").toLowerCase()] || "",
                    s = a && n.attr(a) || "";
                n.attr(a, b[t](s, i, o))
            })
        }
        var u, c, p, h, d, f, m, g, y = Array.prototype.slice,
            v = decodeURIComponent,
            b = e.param,
            x = e.bbq = e.bbq || {},
            w = e.event.special,
            S = "hashchange",
            k = "querystring",
            T = "fragment",
            E = "elemUrlAttr",
            C = "location",
            N = "href",
            _ = "src",
            A = /^.*\?|#.*$/g,
            j = /^.*\#/,
            H = {};
        b[k] = r(a, 0, o), b[T] = c = r(a, 1, i), c.noEscape = function(t) {
            t = t || "";
            var n = e.map(t.split(""), encodeURIComponent);
            g = new RegExp(n.join("|"), "g")
        }, c.noEscape(",/"), e.deparam = p = function(t, n) {
            var r = {},
                i = {
                    "true": !0,
                    "false": !1,
                    "null": null
                };
            return e.each(t.replace(/\+/g, " ").split("&"), function(t, o) {
                var a, s = o.split("="),
                    l = v(s[0]),
                    c = r,
                    p = 0,
                    h = l.split("]["),
                    d = h.length - 1;
                if (/\[/.test(h[0]) && /\]$/.test(h[d]) ? (h[d] = h[d].replace(/\]$/, ""), h = h.shift().split("[").concat(h), d = h.length - 1) : d = 0, 2 === s.length)
                    if (a = v(s[1]), n && (a = a && !isNaN(a) ? +a : "undefined" === a ? u : i[a] !== u ? i[a] : a), d)
                        for (; d >= p; p++) l = "" === h[p] ? c.length : h[p], c = c[l] = d > p ? c[l] || (h[p + 1] && isNaN(h[p + 1]) ? {} : []) : a;
                    else e.isArray(r[l]) ? r[l].push(a) : r[l] = r[l] !== u ? [r[l], a] : a;
                else l && (r[l] = n ? u : "")
            }), r
        }, p[k] = r(s, 0), p[T] = h = r(s, 1), e[E] || (e[E] = function(t) {
            return e.extend(H, t)
        })({
            a: N,
            base: N,
            iframe: _,
            img: _,
            input: _,
            form: "action",
            link: N,
            script: _
        }), m = e[E], e.fn[k] = r(l, k), e.fn[T] = r(l, T), x.pushState = d = function(e, r) {
            n(e) && /^#/.test(e) && r === u && (r = 2);
            var i = e !== u,
                o = c(t[C][N], i ? e : {}, i ? r : 2);
            t[C][N] = o + (/#/.test(o) ? "" : "#")
        }, x.getState = f = function(e, t) {
            return e === u || "boolean" == typeof e ? h(e) : h(t)[e]
        }, x.removeState = function(t) {
            var n = {};
            t !== u && (n = f(), e.each(e.isArray(t) ? t : arguments, function(e, t) {
                delete n[t]
            })), d(n, 2)
        }, w[S] = e.extend(w[S], {
            add: function(t) {
                function n(e) {
                    var t = e[T] = c();
                    e.getState = function(e, n) {
                        return e === u || "boolean" == typeof e ? p(t, e) : p(t, n)[e]
                    }, r.apply(this, arguments)
                }
                var r;
                return e.isFunction(t) ? (r = t, n) : (r = t.handler, void(t.handler = n))
            }
        })
    }(jQuery, this),
    function(e, t, n) {
        function r(e) {
            return e = e || t[a][l], e.replace(/^[^#]*#?(.*)$/, "$1")
        }
        var i, o = e.event.special,
            a = "location",
            s = "hashchange",
            l = "href",
            u = e.browser,
            c = document.documentMode,
            p = u.msie && (c === n || 8 > c),
            h = "on" + s in t && !p;
        e[s + "Delay"] = 100, o[s] = e.extend(o[s], {
            setup: function() {
                return h ? !1 : void e(i.start)
            },
            teardown: function() {
                return h ? !1 : void e(i.stop)
            }
        }), i = function() {
            function n() {
                u = c = function(e) {
                    return e
                }, p && (o = e('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow, c = function() {
                    return r(o.document[a][l])
                }, (u = function(e, t) {
                    if (e !== t) {
                        var n = o.document;
                        n.open().close(), n[a].hash = "#" + e
                    }
                })(r()))
            }
            var i, o, u, c, h = {};
            return h.start = function() {
                if (!i) {
                    var o = r();
                    u || n(),
                        function p() {
                            var n = r(),
                                h = c(o);
                            n !== o ? (u(o = n, h), e(t).trigger(s)) : h !== o && (t[a][l] = t[a][l].replace(/#.*/, "") + "#" + h), i = setTimeout(p, e[s + "Delay"])
                        }()
                }
            }, h.stop = function() {
                o || (i && clearTimeout(i), i = 0)
            }, h
        }()
    }(jQuery, this);
var Handlebars = {};
! function(e, t) {
    e.VERSION = "1.0.0", e.COMPILER_REVISION = 4, e.REVISION_CHANGES = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: ">= 1.0.0"
    }, e.helpers = {}, e.partials = {};
    var n = Object.prototype.toString,
        r = "[object Function]",
        i = "[object Object]";
    e.registerHelper = function(t, r, o) {
        if (n.call(t) === i) {
            if (o || r) throw new e.Exception("Arg not supported with multiple helpers");
            e.Utils.extend(this.helpers, t)
        } else o && (r.not = o), this.helpers[t] = r
    }, e.registerPartial = function(t, r) {
        n.call(t) === i ? e.Utils.extend(this.partials, t) : this.partials[t] = r
    }, e.registerHelper("helperMissing", function(e) {
        if (2 === arguments.length) return t;
        throw new Error("Missing helper: '" + e + "'")
    }), e.registerHelper("blockHelperMissing", function(t, i) {
        var o = i.inverse || function() {},
            a = i.fn,
            s = n.call(t);
        return s === r && (t = t.call(this)), t === !0 ? a(this) : t === !1 || null == t ? o(this) : "[object Array]" === s ? t.length > 0 ? e.helpers.each(t, i) : o(this) : a(t)
    }), e.K = function() {}, e.createFrame = Object.create || function(t) {
        e.K.prototype = t;
        var n = new e.K;
        return e.K.prototype = null, n
    }, e.logger = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        level: 3,
        methodMap: {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
        },
        log: function(t, n) {
            if (e.logger.level <= t) {
                var r = e.logger.methodMap[t];
                "undefined" != typeof console && console[r] && console[r].call(console, n)
            }
        }
    }, e.log = function(t, n) {
        e.logger.log(t, n)
    }, e.registerHelper("each", function(t, i) {
        var o, a = i.fn,
            s = i.inverse,
            l = 0,
            u = "",
            c = n.call(t);
        if (c === r && (t = t.call(this)), i.data && (o = e.createFrame(i.data)), t && "object" == typeof t)
            if (t instanceof Array)
                for (var p = t.length; p > l; l++) o && (o.index = l), u += a(t[l], {
                    data: o
                });
            else
                for (var h in t) t.hasOwnProperty(h) && (o && (o.key = h), u += a(t[h], {
                    data: o
                }), l++);
        return 0 === l && (u = s(this)), u
    }), e.registerHelper("if", function(t, i) {
        var o = n.call(t);
        return o === r && (t = t.call(this)), !t || e.Utils.isEmpty(t) ? i.inverse(this) : i.fn(this)
    }), e.registerHelper("unless", function(t, n) {
        return e.helpers["if"].call(this, t, {
            fn: n.inverse,
            inverse: n.fn
        })
    }), e.registerHelper("with", function(t, i) {
        var o = n.call(t);
        return o === r && (t = t.call(this)), e.Utils.isEmpty(t) ? void 0 : i.fn(t)
    }), e.registerHelper("log", function(t, n) {
        var r = n.data && null != n.data.level ? parseInt(n.data.level, 10) : 1;
        e.log(r, t)
    });
    var o = function() {
        function e() {
            this.yy = {}
        }
        var t = {
                trace: function() {},
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    simpleInverse: 6,
                    statements: 7,
                    statement: 8,
                    openInverse: 9,
                    closeBlock: 10,
                    openBlock: 11,
                    mustache: 12,
                    partial: 13,
                    CONTENT: 14,
                    COMMENT: 15,
                    OPEN_BLOCK: 16,
                    inMustache: 17,
                    CLOSE: 18,
                    OPEN_INVERSE: 19,
                    OPEN_ENDBLOCK: 20,
                    path: 21,
                    OPEN: 22,
                    OPEN_UNESCAPED: 23,
                    CLOSE_UNESCAPED: 24,
                    OPEN_PARTIAL: 25,
                    partialName: 26,
                    params: 27,
                    hash: 28,
                    dataName: 29,
                    param: 30,
                    STRING: 31,
                    INTEGER: 32,
                    BOOLEAN: 33,
                    hashSegments: 34,
                    hashSegment: 35,
                    ID: 36,
                    EQUALS: 37,
                    DATA: 38,
                    pathSegments: 39,
                    SEP: 40,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    14: "CONTENT",
                    15: "COMMENT",
                    16: "OPEN_BLOCK",
                    18: "CLOSE",
                    19: "OPEN_INVERSE",
                    20: "OPEN_ENDBLOCK",
                    22: "OPEN",
                    23: "OPEN_UNESCAPED",
                    24: "CLOSE_UNESCAPED",
                    25: "OPEN_PARTIAL",
                    31: "STRING",
                    32: "INTEGER",
                    33: "BOOLEAN",
                    36: "ID",
                    37: "EQUALS",
                    38: "DATA",
                    40: "SEP"
                },
                productions_: [0, [3, 2],
                    [4, 2],
                    [4, 3],
                    [4, 2],
                    [4, 1],
                    [4, 1],
                    [4, 0],
                    [7, 1],
                    [7, 2],
                    [8, 3],
                    [8, 3],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [11, 3],
                    [9, 3],
                    [10, 3],
                    [12, 3],
                    [12, 3],
                    [13, 3],
                    [13, 4],
                    [6, 2],
                    [17, 3],
                    [17, 2],
                    [17, 2],
                    [17, 1],
                    [17, 1],
                    [27, 2],
                    [27, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [28, 1],
                    [34, 2],
                    [34, 1],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [26, 1],
                    [26, 1],
                    [26, 1],
                    [29, 2],
                    [21, 1],
                    [39, 3],
                    [39, 1]
                ],
                performAction: function(e, t, n, r, i, o) {
                    var a = o.length - 1;
                    switch (i) {
                        case 1:
                            return o[a - 1];
                        case 2:
                            this.$ = new r.ProgramNode([], o[a]);
                            break;
                        case 3:
                            this.$ = new r.ProgramNode(o[a - 2], o[a]);
                            break;
                        case 4:
                            this.$ = new r.ProgramNode(o[a - 1], []);
                            break;
                        case 5:
                            this.$ = new r.ProgramNode(o[a]);
                            break;
                        case 6:
                            this.$ = new r.ProgramNode([], []);
                            break;
                        case 7:
                            this.$ = new r.ProgramNode([]);
                            break;
                        case 8:
                            this.$ = [o[a]];
                            break;
                        case 9:
                            o[a - 1].push(o[a]), this.$ = o[a - 1];
                            break;
                        case 10:
                            this.$ = new r.BlockNode(o[a - 2], o[a - 1].inverse, o[a - 1], o[a]);
                            break;
                        case 11:
                            this.$ = new r.BlockNode(o[a - 2], o[a - 1], o[a - 1].inverse, o[a]);
                            break;
                        case 12:
                            this.$ = o[a];
                            break;
                        case 13:
                            this.$ = o[a];
                            break;
                        case 14:
                            this.$ = new r.ContentNode(o[a]);
                            break;
                        case 15:
                            this.$ = new r.CommentNode(o[a]);
                            break;
                        case 16:
                            this.$ = new r.MustacheNode(o[a - 1][0], o[a - 1][1]);
                            break;
                        case 17:
                            this.$ = new r.MustacheNode(o[a - 1][0], o[a - 1][1]);
                            break;
                        case 18:
                            this.$ = o[a - 1];
                            break;
                        case 19:
                            this.$ = new r.MustacheNode(o[a - 1][0], o[a - 1][1], "&" === o[a - 2][2]);
                            break;
                        case 20:
                            this.$ = new r.MustacheNode(o[a - 1][0], o[a - 1][1], !0);
                            break;
                        case 21:
                            this.$ = new r.PartialNode(o[a - 1]);
                            break;
                        case 22:
                            this.$ = new r.PartialNode(o[a - 2], o[a - 1]);
                            break;
                        case 23:
                            break;
                        case 24:
                            this.$ = [
                                [o[a - 2]].concat(o[a - 1]), o[a]
                            ];
                            break;
                        case 25:
                            this.$ = [
                                [o[a - 1]].concat(o[a]), null
                            ];
                            break;
                        case 26:
                            this.$ = [
                                [o[a - 1]], o[a]
                            ];
                            break;
                        case 27:
                            this.$ = [
                                [o[a]], null
                            ];
                            break;
                        case 28:
                            this.$ = [
                                [o[a]], null
                            ];
                            break;
                        case 29:
                            o[a - 1].push(o[a]), this.$ = o[a - 1];
                            break;
                        case 30:
                            this.$ = [o[a]];
                            break;
                        case 31:
                            this.$ = o[a];
                            break;
                        case 32:
                            this.$ = new r.StringNode(o[a]);
                            break;
                        case 33:
                            this.$ = new r.IntegerNode(o[a]);
                            break;
                        case 34:
                            this.$ = new r.BooleanNode(o[a]);
                            break;
                        case 35:
                            this.$ = o[a];
                            break;
                        case 36:
                            this.$ = new r.HashNode(o[a]);
                            break;
                        case 37:
                            o[a - 1].push(o[a]), this.$ = o[a - 1];
                            break;
                        case 38:
                            this.$ = [o[a]];
                            break;
                        case 39:
                            this.$ = [o[a - 2], o[a]];
                            break;
                        case 40:
                            this.$ = [o[a - 2], new r.StringNode(o[a])];
                            break;
                        case 41:
                            this.$ = [o[a - 2], new r.IntegerNode(o[a])];
                            break;
                        case 42:
                            this.$ = [o[a - 2], new r.BooleanNode(o[a])];
                            break;
                        case 43:
                            this.$ = [o[a - 2], o[a]];
                            break;
                        case 44:
                            this.$ = new r.PartialNameNode(o[a]);
                            break;
                        case 45:
                            this.$ = new r.PartialNameNode(new r.StringNode(o[a]));
                            break;
                        case 46:
                            this.$ = new r.PartialNameNode(new r.IntegerNode(o[a]));
                            break;
                        case 47:
                            this.$ = new r.DataNode(o[a]);
                            break;
                        case 48:
                            this.$ = new r.IdNode(o[a]);
                            break;
                        case 49:
                            o[a - 2].push({
                                part: o[a],
                                separator: o[a - 1]
                            }), this.$ = o[a - 2];
                            break;
                        case 50:
                            this.$ = [{
                                part: o[a]
                            }]
                    }
                },
                table: [{
                    3: 1,
                    4: 2,
                    5: [2, 7],
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    1: [3]
                }, {
                    5: [1, 17]
                }, {
                    5: [2, 6],
                    7: 18,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 6],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 5],
                    6: 20,
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    18: [1, 22],
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 8],
                    14: [2, 8],
                    15: [2, 8],
                    16: [2, 8],
                    19: [2, 8],
                    20: [2, 8],
                    22: [2, 8],
                    23: [2, 8],
                    25: [2, 8]
                }, {
                    4: 29,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    4: 30,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 12],
                    14: [2, 12],
                    15: [2, 12],
                    16: [2, 12],
                    19: [2, 12],
                    20: [2, 12],
                    22: [2, 12],
                    23: [2, 12],
                    25: [2, 12]
                }, {
                    5: [2, 13],
                    14: [2, 13],
                    15: [2, 13],
                    16: [2, 13],
                    19: [2, 13],
                    20: [2, 13],
                    22: [2, 13],
                    23: [2, 13],
                    25: [2, 13]
                }, {
                    5: [2, 14],
                    14: [2, 14],
                    15: [2, 14],
                    16: [2, 14],
                    19: [2, 14],
                    20: [2, 14],
                    22: [2, 14],
                    23: [2, 14],
                    25: [2, 14]
                }, {
                    5: [2, 15],
                    14: [2, 15],
                    15: [2, 15],
                    16: [2, 15],
                    19: [2, 15],
                    20: [2, 15],
                    22: [2, 15],
                    23: [2, 15],
                    25: [2, 15]
                }, {
                    17: 31,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 32,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 33,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    21: 35,
                    26: 34,
                    31: [1, 36],
                    32: [1, 37],
                    36: [1, 28],
                    39: 26
                }, {
                    1: [2, 1]
                }, {
                    5: [2, 2],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 2],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 4],
                    7: 38,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 4],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 9],
                    14: [2, 9],
                    15: [2, 9],
                    16: [2, 9],
                    19: [2, 9],
                    20: [2, 9],
                    22: [2, 9],
                    23: [2, 9],
                    25: [2, 9]
                }, {
                    5: [2, 23],
                    14: [2, 23],
                    15: [2, 23],
                    16: [2, 23],
                    19: [2, 23],
                    20: [2, 23],
                    22: [2, 23],
                    23: [2, 23],
                    25: [2, 23]
                }, {
                    18: [1, 39]
                }, {
                    18: [2, 27],
                    21: 44,
                    24: [2, 27],
                    27: 40,
                    28: 41,
                    29: 48,
                    30: 42,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 28],
                    24: [2, 28]
                }, {
                    18: [2, 48],
                    24: [2, 48],
                    31: [2, 48],
                    32: [2, 48],
                    33: [2, 48],
                    36: [2, 48],
                    38: [2, 48],
                    40: [1, 51]
                }, {
                    21: 52,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    10: 53,
                    20: [1, 54]
                }, {
                    10: 55,
                    20: [1, 54]
                }, {
                    18: [1, 56]
                }, {
                    18: [1, 57]
                }, {
                    24: [1, 58]
                }, {
                    18: [1, 59],
                    21: 60,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 44],
                    36: [2, 44]
                }, {
                    18: [2, 45],
                    36: [2, 45]
                }, {
                    18: [2, 46],
                    36: [2, 46]
                }, {
                    5: [2, 3],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 3],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    14: [2, 17],
                    15: [2, 17],
                    16: [2, 17],
                    19: [2, 17],
                    20: [2, 17],
                    22: [2, 17],
                    23: [2, 17],
                    25: [2, 17]
                }, {
                    18: [2, 25],
                    21: 44,
                    24: [2, 25],
                    28: 61,
                    29: 48,
                    30: 62,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 26],
                    24: [2, 26]
                }, {
                    18: [2, 30],
                    24: [2, 30],
                    31: [2, 30],
                    32: [2, 30],
                    33: [2, 30],
                    36: [2, 30],
                    38: [2, 30]
                }, {
                    18: [2, 36],
                    24: [2, 36],
                    35: 63,
                    36: [1, 64]
                }, {
                    18: [2, 31],
                    24: [2, 31],
                    31: [2, 31],
                    32: [2, 31],
                    33: [2, 31],
                    36: [2, 31],
                    38: [2, 31]
                }, {
                    18: [2, 32],
                    24: [2, 32],
                    31: [2, 32],
                    32: [2, 32],
                    33: [2, 32],
                    36: [2, 32],
                    38: [2, 32]
                }, {
                    18: [2, 33],
                    24: [2, 33],
                    31: [2, 33],
                    32: [2, 33],
                    33: [2, 33],
                    36: [2, 33],
                    38: [2, 33]
                }, {
                    18: [2, 34],
                    24: [2, 34],
                    31: [2, 34],
                    32: [2, 34],
                    33: [2, 34],
                    36: [2, 34],
                    38: [2, 34]
                }, {
                    18: [2, 35],
                    24: [2, 35],
                    31: [2, 35],
                    32: [2, 35],
                    33: [2, 35],
                    36: [2, 35],
                    38: [2, 35]
                }, {
                    18: [2, 38],
                    24: [2, 38],
                    36: [2, 38]
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    37: [1, 65],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    36: [1, 66]
                }, {
                    18: [2, 47],
                    24: [2, 47],
                    31: [2, 47],
                    32: [2, 47],
                    33: [2, 47],
                    36: [2, 47],
                    38: [2, 47]
                }, {
                    5: [2, 10],
                    14: [2, 10],
                    15: [2, 10],
                    16: [2, 10],
                    19: [2, 10],
                    20: [2, 10],
                    22: [2, 10],
                    23: [2, 10],
                    25: [2, 10]
                }, {
                    21: 67,
                    36: [1, 28],
                    39: 26
                }, {
                    5: [2, 11],
                    14: [2, 11],
                    15: [2, 11],
                    16: [2, 11],
                    19: [2, 11],
                    20: [2, 11],
                    22: [2, 11],
                    23: [2, 11],
                    25: [2, 11]
                }, {
                    14: [2, 16],
                    15: [2, 16],
                    16: [2, 16],
                    19: [2, 16],
                    20: [2, 16],
                    22: [2, 16],
                    23: [2, 16],
                    25: [2, 16]
                }, {
                    5: [2, 19],
                    14: [2, 19],
                    15: [2, 19],
                    16: [2, 19],
                    19: [2, 19],
                    20: [2, 19],
                    22: [2, 19],
                    23: [2, 19],
                    25: [2, 19]
                }, {
                    5: [2, 20],
                    14: [2, 20],
                    15: [2, 20],
                    16: [2, 20],
                    19: [2, 20],
                    20: [2, 20],
                    22: [2, 20],
                    23: [2, 20],
                    25: [2, 20]
                }, {
                    5: [2, 21],
                    14: [2, 21],
                    15: [2, 21],
                    16: [2, 21],
                    19: [2, 21],
                    20: [2, 21],
                    22: [2, 21],
                    23: [2, 21],
                    25: [2, 21]
                }, {
                    18: [1, 68]
                }, {
                    18: [2, 24],
                    24: [2, 24]
                }, {
                    18: [2, 29],
                    24: [2, 29],
                    31: [2, 29],
                    32: [2, 29],
                    33: [2, 29],
                    36: [2, 29],
                    38: [2, 29]
                }, {
                    18: [2, 37],
                    24: [2, 37],
                    36: [2, 37]
                }, {
                    37: [1, 65]
                }, {
                    21: 69,
                    29: 73,
                    31: [1, 70],
                    32: [1, 71],
                    33: [1, 72],
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 49],
                    24: [2, 49],
                    31: [2, 49],
                    32: [2, 49],
                    33: [2, 49],
                    36: [2, 49],
                    38: [2, 49],
                    40: [2, 49]
                }, {
                    18: [1, 74]
                }, {
                    5: [2, 22],
                    14: [2, 22],
                    15: [2, 22],
                    16: [2, 22],
                    19: [2, 22],
                    20: [2, 22],
                    22: [2, 22],
                    23: [2, 22],
                    25: [2, 22]
                }, {
                    18: [2, 39],
                    24: [2, 39],
                    36: [2, 39]
                }, {
                    18: [2, 40],
                    24: [2, 40],
                    36: [2, 40]
                }, {
                    18: [2, 41],
                    24: [2, 41],
                    36: [2, 41]
                }, {
                    18: [2, 42],
                    24: [2, 42],
                    36: [2, 42]
                }, {
                    18: [2, 43],
                    24: [2, 43],
                    36: [2, 43]
                }, {
                    5: [2, 18],
                    14: [2, 18],
                    15: [2, 18],
                    16: [2, 18],
                    19: [2, 18],
                    20: [2, 18],
                    22: [2, 18],
                    23: [2, 18],
                    25: [2, 18]
                }],
                defaultActions: {
                    17: [2, 1]
                },
                parseError: function(e) {
                    throw new Error(e)
                },
                parse: function(e) {
                    function t() {
                        var e;
                        return e = n.lexer.lex() || 1, "number" != typeof e && (e = n.symbols_[e] || e), e
                    }
                    var n = this,
                        r = [0],
                        i = [null],
                        o = [],
                        a = this.table,
                        s = "",
                        l = 0,
                        u = 0,
                        c = 0;
                    this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
                    var p = this.lexer.yylloc;
                    o.push(p);
                    var h = this.lexer.options && this.lexer.options.ranges;
                    "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
                    for (var d, f, m, g, y, v, b, x, w, S = {};;) {
                        if (m = r[r.length - 1], this.defaultActions[m] ? g = this.defaultActions[m] : ((null === d || "undefined" == typeof d) && (d = t()), g = a[m] && a[m][d]), "undefined" == typeof g || !g.length || !g[0]) {
                            var k = "";
                            if (!c) {
                                w = [];
                                for (v in a[m]) this.terminals_[v] && v > 2 && w.push("'" + this.terminals_[v] + "'");
                                k = this.lexer.showPosition ? "Parse error on line " + (l + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + w.join(", ") + ", got '" + (this.terminals_[d] || d) + "'" : "Parse error on line " + (l + 1) + ": Unexpected " + (1 == d ? "end of input" : "'" + (this.terminals_[d] || d) + "'"), this.parseError(k, {
                                    text: this.lexer.match,
                                    token: this.terminals_[d] || d,
                                    line: this.lexer.yylineno,
                                    loc: p,
                                    expected: w
                                })
                            }
                        }
                        if (g[0] instanceof Array && g.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + m + ", token: " + d);
                        switch (g[0]) {
                            case 1:
                                r.push(d), i.push(this.lexer.yytext), o.push(this.lexer.yylloc), r.push(g[1]), d = null, f ? (d = f, f = null) : (u = this.lexer.yyleng, s = this.lexer.yytext, l = this.lexer.yylineno, p = this.lexer.yylloc, c > 0 && c--);
                                break;
                            case 2:
                                if (b = this.productions_[g[1]][1], S.$ = i[i.length - b], S._$ = {
                                        first_line: o[o.length - (b || 1)].first_line,
                                        last_line: o[o.length - 1].last_line,
                                        first_column: o[o.length - (b || 1)].first_column,
                                        last_column: o[o.length - 1].last_column
                                    }, h && (S._$.range = [o[o.length - (b || 1)].range[0], o[o.length - 1].range[1]]), y = this.performAction.call(S, s, u, l, this.yy, g[1], i, o), "undefined" != typeof y) return y;
                                b && (r = r.slice(0, -1 * b * 2), i = i.slice(0, -1 * b), o = o.slice(0, -1 * b)), r.push(this.productions_[g[1]][0]), i.push(S.$), o.push(S._$), x = a[r[r.length - 2]][r[r.length - 1]], r.push(x);
                                break;
                            case 3:
                                return !0
                        }
                    }
                    return !0
                }
            },
            n = function() {
                var e = {
                    EOF: 1,
                    parseError: function(e, t) {
                        if (!this.yy.parser) throw new Error(e);
                        this.yy.parser.parseError(e, t)
                    },
                    setInput: function(e) {
                        return this._input = e, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this
                    },
                    input: function() {
                        var e = this._input[0];
                        this.yytext += e, this.yyleng++, this.offset++, this.match += e, this.matched += e;
                        var t = e.match(/(?:\r\n?|\n).*/g);
                        return t ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), e
                    },
                    unput: function(e) {
                        var t = e.length,
                            n = e.split(/(?:\r\n?|\n)/g);
                        this._input = e + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - t - 1), this.offset -= t;
                        var r = this.match.split(/(?:\r\n?|\n)/g);
                        this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), n.length - 1 && (this.yylineno -= n.length - 1);
                        var i = this.yylloc.range;
                        return this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: n ? (n.length === r.length ? this.yylloc.first_column : 0) + r[r.length - n.length].length - n[0].length : this.yylloc.first_column - t
                        }, this.options.ranges && (this.yylloc.range = [i[0], i[0] + this.yyleng - t]), this
                    },
                    more: function() {
                        return this._more = !0, this
                    },
                    less: function(e) {
                        this.unput(this.match.slice(e))
                    },
                    pastInput: function() {
                        var e = this.matched.substr(0, this.matched.length - this.match.length);
                        return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "")
                    },
                    upcomingInput: function() {
                        var e = this.match;
                        return e.length < 20 && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "")
                    },
                    showPosition: function() {
                        var e = this.pastInput(),
                            t = new Array(e.length + 1).join("-");
                        return e + this.upcomingInput() + "\n" + t + "^"
                    },
                    next: function() {
                        if (this.done) return this.EOF;
                        this._input || (this.done = !0);
                        var e, t, n, r, i;
                        this._more || (this.yytext = "", this.match = "");
                        for (var o = this._currentRules(), a = 0; a < o.length && (n = this._input.match(this.rules[o[a]]), !n || t && !(n[0].length > t[0].length) || (t = n, r = a, this.options.flex)); a++);
                        return t ? (i = t[0].match(/(?:\r\n?|\n).*/g), i && (this.yylineno += i.length), this.yylloc = {
                            first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: i ? i[i.length - 1].length - i[i.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + t[0].length
                        }, this.yytext += t[0], this.match += t[0], this.matches = t, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._input = this._input.slice(t[0].length), this.matched += t[0], e = this.performAction.call(this, this.yy, this, o[r], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), e ? e : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        })
                    },
                    lex: function() {
                        var e = this.next();
                        return "undefined" != typeof e ? e : this.lex()
                    },
                    begin: function(e) {
                        this.conditionStack.push(e)
                    },
                    popState: function() {
                        return this.conditionStack.pop()
                    },
                    _currentRules: function() {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                    },
                    topState: function() {
                        return this.conditionStack[this.conditionStack.length - 2]
                    },
                    pushState: function(e) {
                        this.begin(e)
                    }
                };
                return e.options = {}, e.performAction = function(e, t, n, r) {
                    switch (n) {
                        case 0:
                            return t.yytext = "\\", 14;
                        case 1:
                            if ("\\" !== t.yytext.slice(-1) && this.begin("mu"), "\\" === t.yytext.slice(-1) && (t.yytext = t.yytext.substr(0, t.yyleng - 1), this.begin("emu")), t.yytext) return 14;
                            break;
                        case 2:
                            return 14;
                        case 3:
                            return "\\" !== t.yytext.slice(-1) && this.popState(), "\\" === t.yytext.slice(-1) && (t.yytext = t.yytext.substr(0, t.yyleng - 1)), 14;
                        case 4:
                            return t.yytext = t.yytext.substr(0, t.yyleng - 4), this.popState(), 15;
                        case 5:
                            return 25;
                        case 6:
                            return 16;
                        case 7:
                            return 20;
                        case 8:
                            return 19;
                        case 9:
                            return 19;
                        case 10:
                            return 23;
                        case 11:
                            return 22;
                        case 12:
                            this.popState(), this.begin("com");
                            break;
                        case 13:
                            return t.yytext = t.yytext.substr(3, t.yyleng - 5), this.popState(), 15;
                        case 14:
                            return 22;
                        case 15:
                            return 37;
                        case 16:
                            return 36;
                        case 17:
                            return 36;
                        case 18:
                            return 40;
                        case 19:
                            break;
                        case 20:
                            return this.popState(), 24;
                        case 21:
                            return this.popState(), 18;
                        case 22:
                            return t.yytext = t.yytext.substr(1, t.yyleng - 2).replace(/\\"/g, '"'), 31;
                        case 23:
                            return t.yytext = t.yytext.substr(1, t.yyleng - 2).replace(/\\'/g, "'"), 31;
                        case 24:
                            return 38;
                        case 25:
                            return 33;
                        case 26:
                            return 33;
                        case 27:
                            return 32;
                        case 28:
                            return 36;
                        case 29:
                            return t.yytext = t.yytext.substr(1, t.yyleng - 2), 36;
                        case 30:
                            return "INVALID";
                        case 31:
                            return 5
                    }
                }, e.rules = [/^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}\/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/], e.conditions = {
                    mu: {
                        rules: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                        inclusive: !1
                    },
                    emu: {
                        rules: [3],
                        inclusive: !1
                    },
                    com: {
                        rules: [4],
                        inclusive: !1
                    },
                    INITIAL: {
                        rules: [0, 1, 2, 31],
                        inclusive: !0
                    }
                }, e
            }();
        return t.lexer = n, e.prototype = t, t.Parser = e, new e
    }();
    e.Parser = o, e.parse = function(t) {
        return t.constructor === e.AST.ProgramNode ? t : (e.Parser.yy = e.AST, e.Parser.parse(t))
    }, e.AST = {}, e.AST.ProgramNode = function(t, n) {
        this.type = "program", this.statements = t, n && (this.inverse = new e.AST.ProgramNode(n))
    }, e.AST.MustacheNode = function(e, t, n) {
        this.type = "mustache", this.escaped = !n, this.hash = t;
        var r = this.id = e[0],
            i = this.params = e.slice(1),
            o = this.eligibleHelper = r.isSimple;
        this.isHelper = o && (i.length || t)
    }, e.AST.PartialNode = function(e, t) {
        this.type = "partial", this.partialName = e, this.context = t
    }, e.AST.BlockNode = function(t, n, r, i) {
        var o = function(t, n) {
            if (t.original !== n.original) throw new e.Exception(t.original + " doesn't match " + n.original)
        };
        o(t.id, i), this.type = "block", this.mustache = t, this.program = n, this.inverse = r, this.inverse && !this.program && (this.isInverse = !0)
    }, e.AST.ContentNode = function(e) {
        this.type = "content", this.string = e
    }, e.AST.HashNode = function(e) {
        this.type = "hash", this.pairs = e
    }, e.AST.IdNode = function(t) {
        this.type = "ID";
        for (var n = "", r = [], i = 0, o = 0, a = t.length; a > o; o++) {
            var s = t[o].part;
            if (n += (t[o].separator || "") + s, ".." === s || "." === s || "this" === s) {
                if (r.length > 0) throw new e.Exception("Invalid path: " + n);
                ".." === s ? i++ : this.isScoped = !0
            } else r.push(s)
        }
        this.original = n, this.parts = r, this.string = r.join("."), this.depth = i, this.isSimple = 1 === t.length && !this.isScoped && 0 === i, this.stringModeValue = this.string
    }, e.AST.PartialNameNode = function(e) {
        this.type = "PARTIAL_NAME", this.name = e.original
    }, e.AST.DataNode = function(e) {
        this.type = "DATA", this.id = e
    }, e.AST.StringNode = function(e) {
        this.type = "STRING", this.original = this.string = this.stringModeValue = e
    }, e.AST.IntegerNode = function(e) {
        this.type = "INTEGER", this.original = this.integer = e, this.stringModeValue = Number(e)
    }, e.AST.BooleanNode = function(e) {
        this.type = "BOOLEAN", this.bool = e, this.stringModeValue = "true" === e
    }, e.AST.CommentNode = function(e) {
        this.type = "comment", this.comment = e
    };
    var a = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
    e.Exception = function() {
        for (var e = Error.prototype.constructor.apply(this, arguments), t = 0; t < a.length; t++) this[a[t]] = e[a[t]]
    }, e.Exception.prototype = new Error, e.SafeString = function(e) {
        this.string = e
    }, e.SafeString.prototype.toString = function() {
        return this.string.toString()
    };
    var s = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        l = /[&<>"'`]/g,
        u = /[&<>"'`]/,
        c = function(e) {
            return s[e] || "&amp;"
        };
    e.Utils = {
        extend: function(e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
        },
        escapeExpression: function(t) {
            return t instanceof e.SafeString ? t.toString() : null == t || t === !1 ? "" : (t = t.toString(), u.test(t) ? t.replace(l, c) : t)
        },
        isEmpty: function(e) {
            return e || 0 === e ? "[object Array]" === n.call(e) && 0 === e.length ? !0 : !1 : !0
        }
    };
    var p = e.Compiler = function() {},
        h = e.JavaScriptCompiler = function() {};
    p.prototype = {
        compiler: p,
        disassemble: function() {
            for (var e, t, n, r = this.opcodes, i = [], o = 0, a = r.length; a > o; o++)
                if (e = r[o], "DECLARE" === e.opcode) i.push("DECLARE " + e.name + "=" + e.value);
                else {
                    t = [];
                    for (var s = 0; s < e.args.length; s++) n = e.args[s], "string" == typeof n && (n = '"' + n.replace("\n", "\\n") + '"'), t.push(n);
                    i.push(e.opcode + " " + t.join(" "))
                }
            return i.join("\n")
        },
        equals: function(e) {
            var t = this.opcodes.length;
            if (e.opcodes.length !== t) return !1;
            for (var n = 0; t > n; n++) {
                var r = this.opcodes[n],
                    i = e.opcodes[n];
                if (r.opcode !== i.opcode || r.args.length !== i.args.length) return !1;
                for (var o = 0; o < r.args.length; o++)
                    if (r.args[o] !== i.args[o]) return !1
            }
            if (t = this.children.length, e.children.length !== t) return !1;
            for (n = 0; t > n; n++)
                if (!this.children[n].equals(e.children[n])) return !1;
            return !0
        },
        guid: 0,
        compile: function(e, t) {
            this.children = [], this.depths = {
                list: []
            }, this.options = t;
            var n = this.options.knownHelpers;
            if (this.options.knownHelpers = {
                    helperMissing: !0,
                    blockHelperMissing: !0,
                    each: !0,
                    "if": !0,
                    unless: !0,
                    "with": !0,
                    log: !0
                }, n)
                for (var r in n) this.options.knownHelpers[r] = n[r];
            return this.program(e)
        },
        accept: function(e) {
            return this[e.type](e)
        },
        program: function(e) {
            var t, n = e.statements;
            this.opcodes = [];
            for (var r = 0, i = n.length; i > r; r++) t = n[r], this[t.type](t);
            return this.isSimple = 1 === i, this.depths.list = this.depths.list.sort(function(e, t) {
                return e - t
            }), this
        },
        compileProgram: function(e) {
            var t, n = (new this.compiler).compile(e, this.options),
                r = this.guid++;
            this.usePartial = this.usePartial || n.usePartial, this.children[r] = n;
            for (var i = 0, o = n.depths.list.length; o > i; i++) t = n.depths.list[i], 2 > t || this.addDepth(t - 1);
            return r
        },
        block: function(e) {
            var t = e.mustache,
                n = e.program,
                r = e.inverse;
            n && (n = this.compileProgram(n)), r && (r = this.compileProgram(r));
            var i = this.classifyMustache(t);
            "helper" === i ? this.helperMustache(t, n, r) : "simple" === i ? (this.simpleMustache(t), this.opcode("pushProgram", n), this.opcode("pushProgram", r), this.opcode("emptyHash"), this.opcode("blockValue")) : (this.ambiguousMustache(t, n, r), this.opcode("pushProgram", n), this.opcode("pushProgram", r), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append")
        },
        hash: function(e) {
            var t, n, r = e.pairs;
            this.opcode("pushHash");
            for (var i = 0, o = r.length; o > i; i++) t = r[i], n = t[1], this.options.stringParams ? (n.depth && this.addDepth(n.depth), this.opcode("getContext", n.depth || 0), this.opcode("pushStringParam", n.stringModeValue, n.type)) : this.accept(n), this.opcode("assignToHash", t[0]);
            this.opcode("popHash")
        },
        partial: function(e) {
            var t = e.partialName;
            this.usePartial = !0, e.context ? this.ID(e.context) : this.opcode("push", "depth0"), this.opcode("invokePartial", t.name), this.opcode("append")
        },
        content: function(e) {
            this.opcode("appendContent", e.string)
        },
        mustache: function(e) {
            var t = this.options,
                n = this.classifyMustache(e);
            "simple" === n ? this.simpleMustache(e) : "helper" === n ? this.helperMustache(e) : this.ambiguousMustache(e), this.opcode(e.escaped && !t.noEscape ? "appendEscaped" : "append")
        },
        ambiguousMustache: function(e, t, n) {
            var r = e.id,
                i = r.parts[0],
                o = null != t || null != n;
            this.opcode("getContext", r.depth), this.opcode("pushProgram", t), this.opcode("pushProgram", n), this.opcode("invokeAmbiguous", i, o)
        },
        simpleMustache: function(e) {
            var t = e.id;
            "DATA" === t.type ? this.DATA(t) : t.parts.length ? this.ID(t) : (this.addDepth(t.depth), this.opcode("getContext", t.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda")
        },
        helperMustache: function(e, t, n) {
            var r = this.setupFullMustacheParams(e, t, n),
                i = e.id.parts[0];
            if (this.options.knownHelpers[i]) this.opcode("invokeKnownHelper", r.length, i);
            else {
                if (this.options.knownHelpersOnly) throw new Error("You specified knownHelpersOnly, but used the unknown helper " + i);
                this.opcode("invokeHelper", r.length, i)
            }
        },
        ID: function(e) {
            this.addDepth(e.depth), this.opcode("getContext", e.depth);
            var t = e.parts[0];
            t ? this.opcode("lookupOnContext", e.parts[0]) : this.opcode("pushContext");
            for (var n = 1, r = e.parts.length; r > n; n++) this.opcode("lookup", e.parts[n])
        },
        DATA: function(t) {
            if (this.options.data = !0, t.id.isScoped || t.id.depth) throw new e.Exception("Scoped data references are not supported: " + t.original);
            this.opcode("lookupData");
            for (var n = t.id.parts, r = 0, i = n.length; i > r; r++) this.opcode("lookup", n[r])
        },
        STRING: function(e) {
            this.opcode("pushString", e.string)
        },
        INTEGER: function(e) {
            this.opcode("pushLiteral", e.integer)
        },
        BOOLEAN: function(e) {
            this.opcode("pushLiteral", e.bool)
        },
        comment: function() {},
        opcode: function(e) {
            this.opcodes.push({
                opcode: e,
                args: [].slice.call(arguments, 1)
            })
        },
        declare: function(e, t) {
            this.opcodes.push({
                opcode: "DECLARE",
                name: e,
                value: t
            })
        },
        addDepth: function(e) {
            if (isNaN(e)) throw new Error("EWOT");
            0 !== e && (this.depths[e] || (this.depths[e] = !0, this.depths.list.push(e)))
        },
        classifyMustache: function(e) {
            var t = e.isHelper,
                n = e.eligibleHelper,
                r = this.options;
            if (n && !t) {
                var i = e.id.parts[0];
                r.knownHelpers[i] ? t = !0 : r.knownHelpersOnly && (n = !1)
            }
            return t ? "helper" : n ? "ambiguous" : "simple"
        },
        pushParams: function(e) {
            for (var t, n = e.length; n--;) t = e[n], this.options.stringParams ? (t.depth && this.addDepth(t.depth), this.opcode("getContext", t.depth || 0), this.opcode("pushStringParam", t.stringModeValue, t.type)) : this[t.type](t)
        },
        setupMustacheParams: function(e) {
            var t = e.params;
            return this.pushParams(t), e.hash ? this.hash(e.hash) : this.opcode("emptyHash"), t
        },
        setupFullMustacheParams: function(e, t, n) {
            var r = e.params;
            return this.pushParams(r), this.opcode("pushProgram", t), this.opcode("pushProgram", n), e.hash ? this.hash(e.hash) : this.opcode("emptyHash"), r
        }
    };
    var d = function(e) {
        this.value = e
    };
    h.prototype = {
        nameLookup: function(e, t) {
            return /^[0-9]+$/.test(t) ? e + "[" + t + "]" : h.isValidJavaScriptVariableName(t) ? e + "." + t : e + "['" + t + "']"
        },
        appendToBuffer: function(e) {
            return this.environment.isSimple ? "return " + e + ";" : {
                appendToBuffer: !0,
                content: e,
                toString: function() {
                    return "buffer += " + e + ";"
                }
            }
        },
        initializeBuffer: function() {
            return this.quotedString("")
        },
        namespace: "Handlebars",
        compile: function(t, n, r, i) {
            this.environment = t, this.options = n || {}, e.log(e.logger.DEBUG, this.environment.disassemble() + "\n\n"), this.name = this.environment.name, this.isChild = !!r, this.context = r || {
                programs: [],
                environments: [],
                aliases: {}
            }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
                list: []
            }, this.compileStack = [], this.inlineStack = [], this.compileChildren(t, n);
            var o, a = t.opcodes;
            for (this.i = 0, y = a.length; this.i < y; this.i++) o = a[this.i], "DECLARE" === o.opcode ? this[o.name] = o.value : this[o.opcode].apply(this, o.args);
            return this.createFunctionContext(i)
        },
        nextOpcode: function() {
            var e = this.environment.opcodes;
            return e[this.i + 1]
        },
        eat: function() {
            this.i = this.i + 1
        },
        preamble: function() {
            var e = [];
            if (this.isChild) e.push("");
            else {
                var t = this.namespace,
                    n = "helpers = this.merge(helpers, " + t + ".helpers);";
                this.environment.usePartial && (n = n + " partials = this.merge(partials, " + t + ".partials);"), this.options.data && (n += " data = data || {};"), e.push(n)
            }
            e.push(this.environment.isSimple ? "" : ", buffer = " + this.initializeBuffer()), this.lastContext = 0, this.source = e
        },
        createFunctionContext: function(t) {
            var n = this.stackVars.concat(this.registers.list);
            if (n.length > 0 && (this.source[1] = this.source[1] + ", " + n.join(", ")), !this.isChild)
                for (var r in this.context.aliases) this.context.aliases.hasOwnProperty(r) && (this.source[1] = this.source[1] + ", " + r + "=" + this.context.aliases[r]);
            this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), this.environment.isSimple || this.source.push("return buffer;");
            for (var i = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"], o = 0, a = this.environment.depths.list.length; a > o; o++) i.push("depth" + this.environment.depths.list[o]);
            var s = this.mergeSource();
            if (!this.isChild) {
                var l = e.COMPILER_REVISION,
                    u = e.REVISION_CHANGES[l];
                s = "this.compilerInfo = [" + l + ",'" + u + "'];\n" + s
            }
            if (t) return i.push(s), Function.apply(this, i);
            var c = "function " + (this.name || "") + "(" + i.join(",") + ") {\n  " + s + "}";
            return e.log(e.logger.DEBUG, c + "\n\n"), c
        },
        mergeSource: function() {
            for (var e, n = "", r = 0, i = this.source.length; i > r; r++) {
                var o = this.source[r];
                o.appendToBuffer ? e = e ? e + "\n    + " + o.content : o.content : (e && (n += "buffer += " + e + ";\n  ", e = t), n += o + "\n  ")
            }
            return n
        },
        blockValue: function() {
            this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
            var e = ["depth0"];
            this.setupParams(0, e), this.replaceStack(function(t) {
                return e.splice(1, 0, t), "blockHelperMissing.call(" + e.join(", ") + ")"
            })
        },
        ambiguousBlockValue: function() {
            this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
            var e = ["depth0"];
            this.setupParams(0, e);
            var t = this.topStack();
            e.splice(1, 0, t), e[e.length - 1] = "options", this.source.push("if (!" + this.lastHelper + ") { " + t + " = blockHelperMissing.call(" + e.join(", ") + "); }")
        },
        appendContent: function(e) {
            this.source.push(this.appendToBuffer(this.quotedString(e)))
        },
        append: function() {
            this.flushInline();
            var e = this.popStack();
            this.source.push("if(" + e + " || " + e + " === 0) { " + this.appendToBuffer(e) + " }"), this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }")
        },
        appendEscaped: function() {
            this.context.aliases.escapeExpression = "this.escapeExpression", this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
        },
        getContext: function(e) {
            this.lastContext !== e && (this.lastContext = e)
        },
        lookupOnContext: function(e) {
            this.push(this.nameLookup("depth" + this.lastContext, e, "context"))
        },
        pushContext: function() {
            this.pushStackLiteral("depth" + this.lastContext)
        },
        resolvePossibleLambda: function() {
            this.context.aliases.functionType = '"function"', this.replaceStack(function(e) {
                return "typeof " + e + " === functionType ? " + e + ".apply(depth0) : " + e
            })
        },
        lookup: function(e) {
            this.replaceStack(function(t) {
                return t + " == null || " + t + " === false ? " + t + " : " + this.nameLookup(t, e, "context")
            })
        },
        lookupData: function() {
            this.push("data")
        },
        pushStringParam: function(e, t) {
            this.pushStackLiteral("depth" + this.lastContext), this.pushString(t), "string" == typeof e ? this.pushString(e) : this.pushStackLiteral(e)
        },
        emptyHash: function() {
            this.pushStackLiteral("{}"), this.options.stringParams && (this.register("hashTypes", "{}"), this.register("hashContexts", "{}"))
        },
        pushHash: function() {
            this.hash = {
                values: [],
                types: [],
                contexts: []
            }
        },
        popHash: function() {
            var e = this.hash;
            this.hash = t, this.options.stringParams && (this.register("hashContexts", "{" + e.contexts.join(",") + "}"), this.register("hashTypes", "{" + e.types.join(",") + "}")), this.push("{\n    " + e.values.join(",\n    ") + "\n  }")
        },
        pushString: function(e) {
            this.pushStackLiteral(this.quotedString(e))
        },
        push: function(e) {
            return this.inlineStack.push(e), e
        },
        pushLiteral: function(e) {
            this.pushStackLiteral(e)
        },
        pushProgram: function(e) {
            this.pushStackLiteral(null != e ? this.programExpression(e) : null)
        },
        invokeHelper: function(e, t) {
            this.context.aliases.helperMissing = "helpers.helperMissing";
            var n = this.lastHelper = this.setupHelper(e, t, !0),
                r = this.nameLookup("depth" + this.lastContext, t, "context");
            this.push(n.name + " || " + r), this.replaceStack(function(e) {
                return e + " ? " + e + ".call(" + n.callParams + ") : helperMissing.call(" + n.helperMissingParams + ")"
            })
        },
        invokeKnownHelper: function(e, t) {
            var n = this.setupHelper(e, t);
            this.push(n.name + ".call(" + n.callParams + ")")
        },
        invokeAmbiguous: function(e, t) {
            this.context.aliases.functionType = '"function"', this.pushStackLiteral("{}");
            var n = this.setupHelper(0, e, t),
                r = this.lastHelper = this.nameLookup("helpers", e, "helper"),
                i = this.nameLookup("depth" + this.lastContext, e, "context"),
                o = this.nextStack();
            this.source.push("if (" + o + " = " + r + ") { " + o + " = " + o + ".call(" + n.callParams + "); }"), this.source.push("else { " + o + " = " + i + "; " + o + " = typeof " + o + " === functionType ? " + o + ".apply(depth0) : " + o + "; }")
        },
        invokePartial: function(e) {
            var t = [this.nameLookup("partials", e, "partial"), "'" + e + "'", this.popStack(), "helpers", "partials"];
            this.options.data && t.push("data"), this.context.aliases.self = "this", this.push("self.invokePartial(" + t.join(", ") + ")")
        },
        assignToHash: function(e) {
            var t, n, r = this.popStack();
            this.options.stringParams && (n = this.popStack(), t = this.popStack());
            var i = this.hash;
            t && i.contexts.push("'" + e + "': " + t), n && i.types.push("'" + e + "': " + n), i.values.push("'" + e + "': (" + r + ")")
        },
        compiler: h,
        compileChildren: function(e, t) {
            for (var n, r, i = e.children, o = 0, a = i.length; a > o; o++) {
                n = i[o], r = new this.compiler;
                var s = this.matchExistingProgram(n);
                null == s ? (this.context.programs.push(""), s = this.context.programs.length, n.index = s, n.name = "program" + s, this.context.programs[s] = r.compile(n, t, this.context), this.context.environments[s] = n) : (n.index = s, n.name = "program" + s)
            }
        },
        matchExistingProgram: function(e) {
            for (var t = 0, n = this.context.environments.length; n > t; t++) {
                var r = this.context.environments[t];
                if (r && r.equals(e)) return t
            }
        },
        programExpression: function(e) {
            if (this.context.aliases.self = "this", null == e) return "self.noop";
            for (var t, n = this.environment.children[e], r = n.depths.list, i = [n.index, n.name, "data"], o = 0, a = r.length; a > o; o++) t = r[o], i.push(1 === t ? "depth0" : "depth" + (t - 1));
            return (0 === r.length ? "self.program(" : "self.programWithDepth(") + i.join(", ") + ")"
        },
        register: function(e, t) {
            this.useRegister(e), this.source.push(e + " = " + t + ";")
        },
        useRegister: function(e) {
            this.registers[e] || (this.registers[e] = !0, this.registers.list.push(e))
        },
        pushStackLiteral: function(e) {
            return this.push(new d(e))
        },
        pushStack: function(e) {
            this.flushInline();
            var t = this.incrStack();
            return e && this.source.push(t + " = " + e + ";"), this.compileStack.push(t), t
        },
        replaceStack: function(e) {
            var t, n = "",
                r = this.isInline();
            if (r) {
                var i = this.popStack(!0);
                if (i instanceof d) t = i.value;
                else {
                    var o = this.stackSlot ? this.topStackName() : this.incrStack();
                    n = "(" + this.push(o) + " = " + i + "),", t = this.topStack()
                }
            } else t = this.topStack();
            var a = e.call(this, t);
            return r ? ((this.inlineStack.length || this.compileStack.length) && this.popStack(), this.push("(" + n + a + ")")) : (/^stack/.test(t) || (t = this.nextStack()), this.source.push(t + " = (" + n + a + ");")), t
        },
        nextStack: function() {
            return this.pushStack()
        },
        incrStack: function() {
            return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName()
        },
        topStackName: function() {
            return "stack" + this.stackSlot
        },
        flushInline: function() {
            var e = this.inlineStack;
            if (e.length) {
                this.inlineStack = [];
                for (var t = 0, n = e.length; n > t; t++) {
                    var r = e[t];
                    r instanceof d ? this.compileStack.push(r) : this.pushStack(r)
                }
            }
        },
        isInline: function() {
            return this.inlineStack.length
        },
        popStack: function(e) {
            var t = this.isInline(),
                n = (t ? this.inlineStack : this.compileStack).pop();
            return !e && n instanceof d ? n.value : (t || this.stackSlot--, n)
        },
        topStack: function(e) {
            var t = this.isInline() ? this.inlineStack : this.compileStack,
                n = t[t.length - 1];
            return !e && n instanceof d ? n.value : n
        },
        quotedString: function(e) {
            return '"' + e.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
        },
        setupHelper: function(e, t, n) {
            var r = [];
            this.setupParams(e, r, n);
            var i = this.nameLookup("helpers", t, "helper");
            return {
                params: r,
                name: i,
                callParams: ["depth0"].concat(r).join(", "),
                helperMissingParams: n && ["depth0", this.quotedString(t)].concat(r).join(", ")
            }
        },
        setupParams: function(e, t, n) {
            var r, i, o, a = [],
                s = [],
                l = [];
            a.push("hash:" + this.popStack()), i = this.popStack(), o = this.popStack(), (o || i) && (o || (this.context.aliases.self = "this", o = "self.noop"), i || (this.context.aliases.self = "this", i = "self.noop"), a.push("inverse:" + i), a.push("fn:" + o));
            for (var u = 0; e > u; u++) r = this.popStack(), t.push(r), this.options.stringParams && (l.push(this.popStack()), s.push(this.popStack()));
            return this.options.stringParams && (a.push("contexts:[" + s.join(",") + "]"), a.push("types:[" + l.join(",") + "]"), a.push("hashContexts:hashContexts"), a.push("hashTypes:hashTypes")), this.options.data && a.push("data:data"), a = "{" + a.join(",") + "}", n ? (this.register("options", a), t.push("options")) : t.push(a), t.join(", ")
        }
    };
    for (var f = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), m = h.RESERVED_WORDS = {}, g = 0, y = f.length; y > g; g++) m[f[g]] = !0;
    h.isValidJavaScriptVariableName = function(e) {
        return !h.RESERVED_WORDS[e] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(e) ? !0 : !1
    }, e.precompile = function(t, n) {
        if (null == t || "string" != typeof t && t.constructor !== e.AST.ProgramNode) throw new e.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + t);
        n = n || {}, "data" in n || (n.data = !0);
        var r = e.parse(t),
            i = (new p).compile(r, n);
        return (new h).compile(i, n)
    }, e.compile = function(n, r) {
        function i() {
            var i = e.parse(n),
                o = (new p).compile(i, r),
                a = (new h).compile(o, r, t, !0);
            return e.template(a)
        }
        if (null == n || "string" != typeof n && n.constructor !== e.AST.ProgramNode) throw new e.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + n);
        r = r || {}, "data" in r || (r.data = !0);
        var o;
        return function(e, t) {
            return o || (o = i()), o.call(this, e, t)
        }
    }, e.VM = {
        template: function(t) {
            var n = {
                escapeExpression: e.Utils.escapeExpression,
                invokePartial: e.VM.invokePartial,
                programs: [],
                program: function(t, n, r) {
                    var i = this.programs[t];
                    return r ? i = e.VM.program(t, n, r) : i || (i = this.programs[t] = e.VM.program(t, n)), i
                },
                merge: function(t, n) {
                    var r = t || n;
                    return t && n && (r = {}, e.Utils.extend(r, n), e.Utils.extend(r, t)), r
                },
                programWithDepth: e.VM.programWithDepth,
                noop: e.VM.noop,
                compilerInfo: null
            };
            return function(r, i) {
                i = i || {};
                var o = t.call(n, e, r, i.helpers, i.partials, i.data),
                    a = n.compilerInfo || [],
                    s = a[0] || 1,
                    l = e.COMPILER_REVISION;
                if (s !== l) {
                    if (l > s) {
                        var u = e.REVISION_CHANGES[l],
                            c = e.REVISION_CHANGES[s];
                        throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + u + ") or downgrade your runtime to an older version (" + c + ")."
                    }
                    throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + a[1] + ")."
                }
                return o
            }
        },
        programWithDepth: function(e, t, n) {
            var r = Array.prototype.slice.call(arguments, 3),
                i = function(e, i) {
                    return i = i || {}, t.apply(this, [e, i.data || n].concat(r))
                };
            return i.program = e, i.depth = r.length, i
        },
        program: function(e, t, n) {
            var r = function(e, r) {
                return r = r || {}, t(e, r.data || n)
            };
            return r.program = e, r.depth = 0, r
        },
        noop: function() {
            return ""
        },
        invokePartial: function(n, r, i, o, a, s) {
            var l = {
                helpers: o,
                partials: a,
                data: s
            };
            if (n === t) throw new e.Exception("The partial " + r + " could not be found");
            if (n instanceof Function) return n(i, l);
            if (e.compile) return a[r] = e.compile(n, {
                data: s !== t
            }), a[r](i, l);
            throw new e.Exception("The partial " + r + " could not be compiled when running in runtime-only mode")
        }
    }, e.template = e.VM.template
}(Handlebars),
    function() {
        function e(t, n, r) {
            if (t === n) return 0 !== t || 1 / t == 1 / n;
            if (null == t || null == n) return t === n;
            if (t._chain && (t = t._wrapped), n._chain && (n = n._wrapped), t.isEqual && w.isFunction(t.isEqual)) return t.isEqual(n);
            if (n.isEqual && w.isFunction(n.isEqual)) return n.isEqual(t);
            var i = l.call(t);
            if (i != l.call(n)) return !1;
            switch (i) {
                case "[object String]":
                    return t == "" + n;
                case "[object Number]":
                    return t != +t ? n != +n : 0 == t ? 1 / t == 1 / n : t == +n;
                case "[object Date]":
                case "[object Boolean]":
                    return +t == +n;
                case "[object RegExp]":
                    return t.source == n.source && t.global == n.global && t.multiline == n.multiline && t.ignoreCase == n.ignoreCase
            }
            if ("object" != typeof t || "object" != typeof n) return !1;
            for (var o = r.length; o--;)
                if (r[o] == t) return !0;
            r.push(t);
            var o = 0,
                a = !0;
            if ("[object Array]" == i) {
                if (o = t.length, a = o == n.length)
                    for (; o-- && (a = o in t == o in n && e(t[o], n[o], r)););
            } else {
                if ("constructor" in t != "constructor" in n || t.constructor != n.constructor) return !1;
                for (var s in t)
                    if (w.has(t, s) && (o++, !(a = w.has(n, s) && e(t[s], n[s], r)))) break;
                if (a) {
                    for (s in n)
                        if (w.has(n, s) && !o--) break;
                    a = !o
                }
            }
            return r.pop(), a
        }
        var t = this,
            n = t._,
            r = {},
            i = Array.prototype,
            o = Object.prototype,
            a = i.slice,
            s = i.unshift,
            l = o.toString,
            u = o.hasOwnProperty,
            c = i.forEach,
            p = i.map,
            h = i.reduce,
            d = i.reduceRight,
            f = i.filter,
            m = i.every,
            g = i.some,
            y = i.indexOf,
            v = i.lastIndexOf,
            o = Array.isArray,
            b = Object.keys,
            x = Function.prototype.bind,
            w = function(e) {
                return new L(e)
            };
        "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = w), exports._ = w) : t._ = w, w.VERSION = "1.3.3";
        var S = w.each = w.forEach = function(e, t, n) {
            if (null != e)
                if (c && e.forEach === c) e.forEach(t, n);
                else if (e.length === +e.length)
                    for (var i = 0, o = e.length; o > i && !(i in e && t.call(n, e[i], i, e) === r); i++);
                else
                    for (i in e)
                        if (w.has(e, i) && t.call(n, e[i], i, e) === r) break
        };
        w.map = w.collect = function(e, t, n) {
            var r = [];
            return null == e ? r : p && e.map === p ? e.map(t, n) : (S(e, function(e, i, o) {
                r[r.length] = t.call(n, e, i, o)
            }), e.length === +e.length && (r.length = e.length), r)
        }, w.reduce = w.foldl = w.inject = function(e, t, n, r) {
            var i = arguments.length > 2;
            if (null == e && (e = []), h && e.reduce === h) return r && (t = w.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
            if (S(e, function(e, o, a) {
                    i ? n = t.call(r, n, e, o, a) : (n = e, i = !0)
                }), !i) throw new TypeError("Reduce of empty array with no initial value");
            return n
        }, w.reduceRight = w.foldr = function(e, t, n, r) {
            var i = arguments.length > 2;
            if (null == e && (e = []), d && e.reduceRight === d) return r && (t = w.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
            var o = w.toArray(e).reverse();
            return r && !i && (t = w.bind(t, r)), i ? w.reduce(o, t, n, r) : w.reduce(o, t)
        }, w.find = w.detect = function(e, t, n) {
            var r;
            return k(e, function(e, i, o) {
                return t.call(n, e, i, o) ? (r = e, !0) : void 0
            }), r
        }, w.filter = w.select = function(e, t, n) {
            var r = [];
            return null == e ? r : f && e.filter === f ? e.filter(t, n) : (S(e, function(e, i, o) {
                t.call(n, e, i, o) && (r[r.length] = e)
            }), r)
        }, w.reject = function(e, t, n) {
            var r = [];
            return null == e ? r : (S(e, function(e, i, o) {
                t.call(n, e, i, o) || (r[r.length] = e)
            }), r)
        }, w.every = w.all = function(e, t, n) {
            var i = !0;
            return null == e ? i : m && e.every === m ? e.every(t, n) : (S(e, function(e, o, a) {
                return (i = i && t.call(n, e, o, a)) ? void 0 : r
            }), !!i)
        };
        var k = w.some = w.any = function(e, t, n) {
            t || (t = w.identity);
            var i = !1;
            return null == e ? i : g && e.some === g ? e.some(t, n) : (S(e, function(e, o, a) {
                return i || (i = t.call(n, e, o, a)) ? r : void 0
            }), !!i)
        };
        w.include = w.contains = function(e, t) {
            var n = !1;
            return null == e ? n : y && e.indexOf === y ? -1 != e.indexOf(t) : n = k(e, function(e) {
                return e === t
            })
        }, w.invoke = function(e, t) {
            var n = a.call(arguments, 2);
            return w.map(e, function(e) {
                return (w.isFunction(t) ? t || e : e[t]).apply(e, n)
            })
        }, w.pluck = function(e, t) {
            return w.map(e, function(e) {
                return e[t]
            })
        }, w.max = function(e, t, n) {
            if (!t && w.isArray(e) && e[0] === +e[0]) return Math.max.apply(Math, e);
            if (!t && w.isEmpty(e)) return -1 / 0;
            var r = {
                computed: -1 / 0
            };
            return S(e, function(e, i, o) {
                i = t ? t.call(n, e, i, o) : e, i >= r.computed && (r = {
                    value: e,
                    computed: i
                })
            }), r.value
        }, w.min = function(e, t, n) {
            if (!t && w.isArray(e) && e[0] === +e[0]) return Math.min.apply(Math, e);
            if (!t && w.isEmpty(e)) return 1 / 0;
            var r = {
                computed: 1 / 0
            };
            return S(e, function(e, i, o) {
                i = t ? t.call(n, e, i, o) : e, i < r.computed && (r = {
                    value: e,
                    computed: i
                })
            }), r.value
        }, w.shuffle = function(e) {
            var t, n = [];
            return S(e, function(e, r) {
                t = Math.floor(Math.random() * (r + 1)), n[r] = n[t], n[t] = e
            }), n
        }, w.sortBy = function(e, t, n) {
            var r = w.isFunction(t) ? t : function(e) {
                return e[t]
            };
            return w.pluck(w.map(e, function(e, t, i) {
                return {
                    value: e,
                    criteria: r.call(n, e, t, i)
                }
            }).sort(function(e, t) {
                var n = e.criteria,
                    r = t.criteria;
                return void 0 === n ? 1 : void 0 === r ? -1 : r > n ? -1 : n > r ? 1 : 0
            }), "value")
        }, w.groupBy = function(e, t) {
            var n = {},
                r = w.isFunction(t) ? t : function(e) {
                    return e[t]
                };
            return S(e, function(e, t) {
                var i = r(e, t);
                (n[i] || (n[i] = [])).push(e)
            }), n
        }, w.sortedIndex = function(e, t, n) {
            n || (n = w.identity);
            for (var r = 0, i = e.length; i > r;) {
                var o = r + i >> 1;
                n(e[o]) < n(t) ? r = o + 1 : i = o
            }
            return r
        }, w.toArray = function(e) {
            return e ? w.isArray(e) || w.isArguments(e) ? a.call(e) : e.toArray && w.isFunction(e.toArray) ? e.toArray() : w.values(e) : []
        }, w.size = function(e) {
            return w.isArray(e) ? e.length : w.keys(e).length
        }, w.first = w.head = w.take = function(e, t, n) {
            return null == t || n ? e[0] : a.call(e, 0, t)
        }, w.initial = function(e, t, n) {
            return a.call(e, 0, e.length - (null == t || n ? 1 : t))
        }, w.last = function(e, t, n) {
            return null == t || n ? e[e.length - 1] : a.call(e, Math.max(e.length - t, 0))
        }, w.rest = w.tail = function(e, t, n) {
            return a.call(e, null == t || n ? 1 : t)
        }, w.compact = function(e) {
            return w.filter(e, function(e) {
                return !!e
            })
        }, w.flatten = function(e, t) {
            return w.reduce(e, function(e, n) {
                return w.isArray(n) ? e.concat(t ? n : w.flatten(n)) : (e[e.length] = n, e)
            }, [])
        }, w.without = function(e) {
            return w.difference(e, a.call(arguments, 1))
        }, w.uniq = w.unique = function(e, t, n) {
            var n = n ? w.map(e, n) : e,
                r = [];
            return e.length < 3 && (t = !0), w.reduce(n, function(n, i, o) {
                return (t ? w.last(n) === i && n.length : w.include(n, i)) || (n.push(i), r.push(e[o])), n
            }, []), r
        }, w.union = function() {
            return w.uniq(w.flatten(arguments, !0))
        }, w.intersection = w.intersect = function(e) {
            var t = a.call(arguments, 1);
            return w.filter(w.uniq(e), function(e) {
                return w.every(t, function(t) {
                    return w.indexOf(t, e) >= 0
                })
            })
        }, w.difference = function(e) {
            var t = w.flatten(a.call(arguments, 1), !0);
            return w.filter(e, function(e) {
                return !w.include(t, e)
            })
        }, w.zip = function() {
            for (var e = a.call(arguments), t = w.max(w.pluck(e, "length")), n = Array(t), r = 0; t > r; r++) n[r] = w.pluck(e, "" + r);
            return n
        }, w.indexOf = function(e, t, n) {
            if (null == e) return -1;
            var r;
            if (n) return n = w.sortedIndex(e, t), e[n] === t ? n : -1;
            if (y && e.indexOf === y) return e.indexOf(t);
            for (n = 0, r = e.length; r > n; n++)
                if (n in e && e[n] === t) return n;
            return -1
        }, w.lastIndexOf = function(e, t) {
            if (null == e) return -1;
            if (v && e.lastIndexOf === v) return e.lastIndexOf(t);
            for (var n = e.length; n--;)
                if (n in e && e[n] === t) return n;
            return -1
        }, w.range = function(e, t, n) {
            arguments.length <= 1 && (t = e || 0, e = 0);
            for (var n = arguments[2] || 1, r = Math.max(Math.ceil((t - e) / n), 0), i = 0, o = Array(r); r > i;) o[i++] = e, e += n;
            return o
        };
        var T = function() {};
        w.bind = function(e, t) {
            var n, r;
            if (e.bind === x && x) return x.apply(e, a.call(arguments, 1));
            if (!w.isFunction(e)) throw new TypeError;
            return r = a.call(arguments, 2), n = function() {
                if (!(this instanceof n)) return e.apply(t, r.concat(a.call(arguments)));
                T.prototype = e.prototype;
                var i = new T,
                    o = e.apply(i, r.concat(a.call(arguments)));
                return Object(o) === o ? o : i
            }
        }, w.bindAll = function(e) {
            var t = a.call(arguments, 1);
            return 0 == t.length && (t = w.functions(e)), S(t, function(t) {
                e[t] = w.bind(e[t], e)
            }), e
        }, w.memoize = function(e, t) {
            var n = {};
            return t || (t = w.identity),
                function() {
                    var r = t.apply(this, arguments);
                    return w.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
                }
        }, w.delay = function(e, t) {
            var n = a.call(arguments, 2);
            return setTimeout(function() {
                return e.apply(null, n)
            }, t)
        }, w.defer = function(e) {
            return w.delay.apply(w, [e, 1].concat(a.call(arguments, 1)))
        }, w.throttle = function(e, t) {
            var n, r, i, o, a, s, l = w.debounce(function() {
                a = o = !1
            }, t);
            return function() {
                return n = this, r = arguments, i || (i = setTimeout(function() {
                    i = null, a && e.apply(n, r), l()
                }, t)), o ? a = !0 : s = e.apply(n, r), l(), o = !0, s
            }
        }, w.debounce = function(e, t, n) {
            var r;
            return function() {
                var i = this,
                    o = arguments;
                n && !r && e.apply(i, o), clearTimeout(r), r = setTimeout(function() {
                    r = null, n || e.apply(i, o)
                }, t)
            }
        }, w.once = function(e) {
            var t, n = !1;
            return function() {
                return n ? t : (n = !0, t = e.apply(this, arguments))
            }
        }, w.wrap = function(e, t) {
            return function() {
                var n = [e].concat(a.call(arguments, 0));
                return t.apply(this, n)
            }
        }, w.compose = function() {
            var e = arguments;
            return function() {
                for (var t = arguments, n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
                return t[0]
            }
        }, w.after = function(e, t) {
            return 0 >= e ? t() : function() {
                return --e < 1 ? t.apply(this, arguments) : void 0
            }
        }, w.keys = b || function(e) {
            if (e !== Object(e)) throw new TypeError("Invalid object");
            var t, n = [];
            for (t in e) w.has(e, t) && (n[n.length] = t);
            return n
        }, w.values = function(e) {
            return w.map(e, w.identity)
        }, w.functions = w.methods = function(e) {
            var t, n = [];
            for (t in e) w.isFunction(e[t]) && n.push(t);
            return n.sort()
        }, w.extend = function(e) {
            return S(a.call(arguments, 1), function(t) {
                for (var n in t) e[n] = t[n]
            }), e
        }, w.pick = function(e) {
            var t = {};
            return S(w.flatten(a.call(arguments, 1)), function(n) {
                n in e && (t[n] = e[n])
            }), t
        }, w.defaults = function(e) {
            return S(a.call(arguments, 1), function(t) {
                for (var n in t) null == e[n] && (e[n] = t[n])
            }), e
        }, w.clone = function(e) {
            return w.isObject(e) ? w.isArray(e) ? e.slice() : w.extend({}, e) : e
        }, w.tap = function(e, t) {
            return t(e), e
        }, w.isEqual = function(t, n) {
            return e(t, n, [])
        }, w.isEmpty = function(e) {
            if (null == e) return !0;
            if (w.isArray(e) || w.isString(e)) return 0 === e.length;
            for (var t in e)
                if (w.has(e, t)) return !1;
            return !0
        }, w.isElement = function(e) {
            return !(!e || 1 != e.nodeType)
        }, w.isArray = o || function(e) {
            return "[object Array]" == l.call(e)
        }, w.isObject = function(e) {
            return e === Object(e)
        }, w.isArguments = function(e) {
            return "[object Arguments]" == l.call(e)
        }, w.isArguments(arguments) || (w.isArguments = function(e) {
            return !(!e || !w.has(e, "callee"))
        }), w.isFunction = function(e) {
            return "[object Function]" == l.call(e)
        }, w.isString = function(e) {
            return "[object String]" == l.call(e)
        }, w.isNumber = function(e) {
            return "[object Number]" == l.call(e)
        }, w.isFinite = function(e) {
            return w.isNumber(e) && isFinite(e)
        }, w.isNaN = function(e) {
            return e !== e
        }, w.isBoolean = function(e) {
            return e === !0 || e === !1 || "[object Boolean]" == l.call(e)
        }, w.isDate = function(e) {
            return "[object Date]" == l.call(e)
        }, w.isRegExp = function(e) {
            return "[object RegExp]" == l.call(e)
        }, w.isNull = function(e) {
            return null === e
        }, w.isUndefined = function(e) {
            return void 0 === e
        }, w.has = function(e, t) {
            return u.call(e, t)
        }, w.noConflict = function() {
            return t._ = n, this
        }, w.identity = function(e) {
            return e
        }, w.times = function(e, t, n) {
            for (var r = 0; e > r; r++) t.call(n, r)
        }, w.escape = function(e) {
            return ("" + e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
        }, w.result = function(e, t) {
            if (null == e) return null;
            var n = e[t];
            return w.isFunction(n) ? n.call(e) : n
        }, w.mixin = function(e) {
            S(w.functions(e), function(t) {
                O(t, w[t] = e[t])
            })
        };
        var E = 0;
        w.uniqueId = function(e) {
            var t = E++;
            return e ? e + t : t
        }, w.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var C, N = /.^/,
            _ = {
                "\\": "\\",
                "'": "'",
                r: "\r",
                n: "\n",
                t: "	",
                u2028: "\u2028",
                u2029: "\u2029"
            };
        for (C in _) _[_[C]] = C;
        var A = /\\|'|\r|\n|\t|\u2028|\u2029/g,
            j = /\\(\\|'|r|n|t|u2028|u2029)/g,
            H = function(e) {
                return e.replace(j, function(e, t) {
                    return _[t]
                })
            };
        w.template = function(e, t, n) {
            n = w.defaults(n || {}, w.templateSettings), e = "__p+='" + e.replace(A, function(e) {
                return "\\" + _[e]
            }).replace(n.escape || N, function(e, t) {
                return "'+\n_.escape(" + H(t) + ")+\n'"
            }).replace(n.interpolate || N, function(e, t) {
                return "'+\n(" + H(t) + ")+\n'"
            }).replace(n.evaluate || N, function(e, t) {
                return "';\n" + H(t) + "\n;__p+='"
            }) + "';\n", n.variable || (e = "with(obj||{}){\n" + e + "}\n");
            var e = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + e + "return __p;\n",
                r = new Function(n.variable || "obj", "_", e);
            return t ? r(t, w) : (t = function(e) {
                return r.call(this, e, w)
            }, t.source = "function(" + (n.variable || "obj") + "){\n" + e + "}", t)
        }, w.chain = function(e) {
            return w(e).chain()
        };
        var L = function(e) {
            this._wrapped = e
        };
        w.prototype = L.prototype;
        var D = function(e, t) {
                return t ? w(e).chain() : e
            },
            O = function(e, t) {
                L.prototype[e] = function() {
                    var e = a.call(arguments);
                    return s.call(e, this._wrapped), D(t.apply(w, e), this._chain)
                }
            };
        w.mixin(w), S("pop,push,reverse,shift,sort,splice,unshift".split(","), function(e) {
            var t = i[e];
            L.prototype[e] = function() {
                var n = this._wrapped;
                t.apply(n, arguments);
                var r = n.length;
                return ("shift" == e || "splice" == e) && 0 === r && delete n[0], D(n, this._chain)
            }
        }), S(["concat", "join", "slice"], function(e) {
            var t = i[e];
            L.prototype[e] = function() {
                return D(t.apply(this._wrapped, arguments), this._chain)
            }
        }), L.prototype.chain = function() {
            return this._chain = !0, this
        }, L.prototype.value = function() {
            return this._wrapped
        }
    }.call(this),
    function() {
        var e, t = this,
            n = t.Backbone,
            r = Array.prototype.slice,
            i = Array.prototype.splice;
        e = "undefined" != typeof exports ? exports : t.Backbone = {}, e.VERSION = "0.9.2";
        var o = t._;
        !o && "undefined" != typeof require && (o = require("underscore"));
        var a = t.jQuery || t.Zepto || t.ender;
        e.setDomLibrary = function(e) {
            a = e
        }, e.noConflict = function() {
            return t.Backbone = n, this
        }, e.emulateHTTP = !1, e.emulateJSON = !1;
        var s = /\s+/,
            l = e.Events = {
                on: function(e, t, n) {
                    var r, i, o, a, l;
                    if (!t) return this;
                    for (e = e.split(s), r = this._callbacks || (this._callbacks = {}); i = e.shift();) o = (l = r[i]) ? l.tail : {}, o.next = a = {}, o.context = n, o.callback = t, r[i] = {
                        tail: a,
                        next: l ? l.next : o
                    };
                    return this
                },
                off: function(e, t, n) {
                    var r, i, a, l, u, c;
                    if (i = this._callbacks) {
                        if (!e && !t && !n) return delete this._callbacks, this;
                        for (e = e ? e.split(s) : o.keys(i); r = e.shift();)
                            if (a = i[r], delete i[r], a && (t || n))
                                for (l = a.tail;
                                     (a = a.next) !== l;) u = a.callback, c = a.context, (t && u !== t || n && c !== n) && this.on(r, u, c);
                        return this
                    }
                },
                trigger: function(e) {
                    var t, n, i, o, a, l;
                    if (!(i = this._callbacks)) return this;
                    for (a = i.all, e = e.split(s), l = r.call(arguments, 1); t = e.shift();) {
                        if (n = i[t])
                            for (o = n.tail;
                                 (n = n.next) !== o;) n.callback.apply(n.context || this, l);
                        if (n = a)
                            for (o = n.tail, t = [t].concat(l);
                                 (n = n.next) !== o;) n.callback.apply(n.context || this, t)
                    }
                    return this
                }
            };
        l.bind = l.on, l.unbind = l.off;
        var u = e.Model = function(e, t) {
            var n;
            e || (e = {}), t && t.parse && (e = this.parse(e)), (n = T(this, "defaults")) && (e = o.extend({}, n, e)), t && t.collection && (this.collection = t.collection), this.attributes = {}, this._escapedAttributes = {}, this.cid = o.uniqueId("c"), this.changed = {}, this._silent = {}, this._pending = {}, this.set(e, {
                silent: !0
            }), this.changed = {}, this._silent = {}, this._pending = {}, this._previousAttributes = o.clone(this.attributes), this.initialize.apply(this, arguments)
        };
        o.extend(u.prototype, l, {
            changed: null,
            _silent: null,
            _pending: null,
            idAttribute: "id",
            initialize: function() {},
            toJSON: function() {
                return o.clone(this.attributes)
            },
            get: function(e) {
                return this.attributes[e]
            },
            escape: function(e) {
                var t;
                return (t = this._escapedAttributes[e]) ? t : (t = this.get(e), this._escapedAttributes[e] = o.escape(null == t ? "" : "" + t))
            },
            has: function(e) {
                return null != this.get(e)
            },
            set: function(e, t, n) {
                var r, i;
                if (o.isObject(e) || null == e ? (r = e, n = t) : (r = {}, r[e] = t), n || (n = {}), !r) return this;
                if (r instanceof u && (r = r.attributes), n.unset)
                    for (i in r) r[i] = void 0;
                if (!this._validate(r, n)) return !1;
                this.idAttribute in r && (this.id = r[this.idAttribute]);
                var t = n.changes = {},
                    a = this.attributes,
                    s = this._escapedAttributes,
                    l = this._previousAttributes || {};
                for (i in r) e = r[i], (!o.isEqual(a[i], e) || n.unset && o.has(a, i)) && (delete s[i], (n.silent ? this._silent : t)[i] = !0), n.unset ? delete a[i] : a[i] = e, o.isEqual(l[i], e) && o.has(a, i) == o.has(l, i) ? (delete this.changed[i], delete this._pending[i]) : (this.changed[i] = e, n.silent || (this._pending[i] = !0));
                return n.silent || this.change(n), this
            },
            unset: function(e, t) {
                return (t || (t = {})).unset = !0, this.set(e, null, t)
            },
            clear: function(e) {
                return (e || (e = {})).unset = !0, this.set(o.clone(this.attributes), e)
            },
            fetch: function(t) {
                var t = t ? o.clone(t) : {},
                    n = this,
                    r = t.success;
                return t.success = function(e, i, o) {
                    return n.set(n.parse(e, o), t) ? void(r && r(n, e)) : !1
                }, t.error = e.wrapError(t.error, n, t), (this.sync || e.sync).call(this, "read", this, t)
            },
            save: function(t, n, r) {
                var i, a;
                if (o.isObject(t) || null == t ? (i = t, r = n) : (i = {}, i[t] = n), r = r ? o.clone(r) : {}, r.wait) {
                    if (!this._validate(i, r)) return !1;
                    a = o.clone(this.attributes)
                }
                if (t = o.extend({}, r, {
                        silent: !0
                    }), i && !this.set(i, r.wait ? t : r)) return !1;
                var s = this,
                    l = r.success;
                return r.success = function(e, t, n) {
                    return t = s.parse(e, n), r.wait && (delete r.wait, t = o.extend(i || {}, t)), s.set(t, r) ? void(l ? l(s, e) : s.trigger("sync", s, e, r)) : !1
                }, r.error = e.wrapError(r.error, s, r), n = this.isNew() ? "create" : "update", n = (this.sync || e.sync).call(this, n, this, r), r.wait && this.set(a, t), n
            },
            destroy: function(t) {
                var t = t ? o.clone(t) : {},
                    n = this,
                    r = t.success,
                    i = function() {
                        n.trigger("destroy", n, n.collection, t)
                    };
                if (this.isNew()) return i(), !1;
                t.success = function(e) {
                    t.wait && i(), r ? r(n, e) : n.trigger("sync", n, e, t)
                }, t.error = e.wrapError(t.error, n, t);
                var a = (this.sync || e.sync).call(this, "delete", this, t);
                return t.wait || i(), a
            },
            url: function() {
                var e = T(this, "urlRoot") || T(this.collection, "url") || E();
                return this.isNew() ? e : e + ("/" == e.charAt(e.length - 1) ? "" : "/") + encodeURIComponent(this.id)
            },
            parse: function(e) {
                return e
            },
            clone: function() {
                return new this.constructor(this.attributes)
            },
            isNew: function() {
                return null == this.id
            },
            change: function(e) {
                e || (e = {});
                var t = this._changing;
                this._changing = !0;
                for (var n in this._silent) this._pending[n] = !0;
                var r = o.extend({}, e.changes, this._silent);
                this._silent = {};
                for (n in r) this.trigger("change:" + n, this, this.get(n), e);
                if (t) return this;
                for (; !o.isEmpty(this._pending);) {
                    this._pending = {}, this.trigger("change", this, e);
                    for (n in this.changed) !this._pending[n] && !this._silent[n] && delete this.changed[n];
                    this._previousAttributes = o.clone(this.attributes)
                }
                return this._changing = !1, this
            },
            hasChanged: function(e) {
                return arguments.length ? o.has(this.changed, e) : !o.isEmpty(this.changed)
            },
            changedAttributes: function(e) {
                if (!e) return this.hasChanged() ? o.clone(this.changed) : !1;
                var t, n, r = !1,
                    i = this._previousAttributes;
                for (n in e) o.isEqual(i[n], t = e[n]) || ((r || (r = {}))[n] = t);
                return r
            },
            previous: function(e) {
                return arguments.length && this._previousAttributes ? this._previousAttributes[e] : null
            },
            previousAttributes: function() {
                return o.clone(this._previousAttributes)
            },
            isValid: function() {
                return !this.validate(this.attributes)
            },
            _validate: function(e, t) {
                if (t.silent || !this.validate) return !0;
                var e = o.extend({}, this.attributes, e),
                    n = this.validate(e, t);
                return n ? (t && t.error ? t.error(this, n, t) : this.trigger("error", this, n, t), !1) : !0
            }
        });
        var c = e.Collection = function(e, t) {
            t || (t = {}), t.model && (this.model = t.model), t.comparator && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && this.reset(e, {
                silent: !0,
                parse: t.parse
            })
        };
        o.extend(c.prototype, l, {
            model: u,
            initialize: function() {},
            toJSON: function(e) {
                return this.map(function(t) {
                    return t.toJSON(e)
                })
            },
            add: function(e, t) {
                var n, r, a, s, l, u = {},
                    c = {},
                    p = [];
                for (t || (t = {}), e = o.isArray(e) ? e.slice() : [e], n = 0, r = e.length; r > n; n++) {
                    if (!(a = e[n] = this._prepareModel(e[n], t))) throw Error("Can't add an invalid model to a collection");
                    s = a.cid, l = a.id, u[s] || this._byCid[s] || null != l && (c[l] || this._byId[l]) ? p.push(n) : u[s] = c[l] = a
                }
                for (n = p.length; n--;) e.splice(p[n], 1);
                for (n = 0, r = e.length; r > n; n++)(a = e[n]).on("all", this._onModelEvent, this), this._byCid[a.cid] = a, null != a.id && (this._byId[a.id] = a);
                if (this.length += r, i.apply(this.models, [null != t.at ? t.at : this.models.length, 0].concat(e)), this.comparator && this.sort({
                        silent: !0
                    }), t.silent) return this;
                for (n = 0, r = this.models.length; r > n; n++) u[(a = this.models[n]).cid] && (t.index = n, a.trigger("add", a, this, t));
                return this
            },
            remove: function(e, t) {
                var n, r, i, a;
                for (t || (t = {}), e = o.isArray(e) ? e.slice() : [e], n = 0, r = e.length; r > n; n++)(a = this.getByCid(e[n]) || this.get(e[n])) && (delete this._byId[a.id], delete this._byCid[a.cid], i = this.indexOf(a), this.models.splice(i, 1), this.length--, t.silent || (t.index = i, a.trigger("remove", a, this, t)), this._removeReference(a));
                return this
            },
            push: function(e, t) {
                return e = this._prepareModel(e, t), this.add(e, t), e
            },
            pop: function(e) {
                var t = this.at(this.length - 1);
                return this.remove(t, e), t
            },
            unshift: function(e, t) {
                return e = this._prepareModel(e, t), this.add(e, o.extend({
                    at: 0
                }, t)), e
            },
            shift: function(e) {
                var t = this.at(0);
                return this.remove(t, e), t
            },
            get: function(e) {
                return null == e ? void 0 : this._byId[null != e.id ? e.id : e]
            },
            getByCid: function(e) {
                return e && this._byCid[e.cid || e]
            },
            at: function(e) {
                return this.models[e]
            },
            where: function(e) {
                return o.isEmpty(e) ? [] : this.filter(function(t) {
                    for (var n in e)
                        if (e[n] !== t.get(n)) return !1;
                    return !0
                })
            },
            sort: function(e) {
                if (e || (e = {}), !this.comparator) throw Error("Cannot sort a set without a comparator");
                var t = o.bind(this.comparator, this);
                return 1 == this.comparator.length ? this.models = this.sortBy(t) : this.models.sort(t), e.silent || this.trigger("reset", this, e), this
            },
            pluck: function(e) {
                return o.map(this.models, function(t) {
                    return t.get(e)
                })
            },
            reset: function(e, t) {
                e || (e = []), t || (t = {});
                for (var n = 0, r = this.models.length; r > n; n++) this._removeReference(this.models[n]);
                return this._reset(), this.add(e, o.extend({
                    silent: !0
                }, t)), t.silent || this.trigger("reset", this, t), this
            },
            fetch: function(t) {
                t = t ? o.clone(t) : {}, void 0 === t.parse && (t.parse = !0);
                var n = this,
                    r = t.success;
                return t.success = function(e, i, o) {
                    n[t.add ? "add" : "reset"](n.parse(e, o), t), r && r(n, e)
                }, t.error = e.wrapError(t.error, n, t), (this.sync || e.sync).call(this, "read", this, t)
            },
            create: function(e, t) {
                var n = this,
                    t = t ? o.clone(t) : {},
                    e = this._prepareModel(e, t);
                if (!e) return !1;
                t.wait || n.add(e, t);
                var r = t.success;
                return t.success = function(i, o) {
                    t.wait && n.add(i, t), r ? r(i, o) : i.trigger("sync", e, o, t)
                }, e.save(null, t), e
            },
            parse: function(e) {
                return e
            },
            chain: function() {
                return o(this.models).chain()
            },
            _reset: function() {
                this.length = 0, this.models = [], this._byId = {}, this._byCid = {}
            },
            _prepareModel: function(e, t) {
                return t || (t = {}), e instanceof u ? e.collection || (e.collection = this) : (t.collection = this, e = new this.model(e, t), e._validate(e.attributes, t) || (e = !1)), e
            },
            _removeReference: function(e) {
                this == e.collection && delete e.collection, e.off("all", this._onModelEvent, this)
            },
            _onModelEvent: function(e, t, n, r) {
                ("add" == e || "remove" == e) && n != this || ("destroy" == e && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], this._byId[t.id] = t), this.trigger.apply(this, arguments))
            }
        }), o.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","), function(e) {
            c.prototype[e] = function() {
                return o[e].apply(o, [this.models].concat(o.toArray(arguments)))
            }
        });
        var p = e.Router = function(e) {
                e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
            },
            h = /:\w+/g,
            d = /\*\w+/g,
            f = /[-[\]{}()+?.,\\^$|#\s]/g;
        o.extend(p.prototype, l, {
            initialize: function() {},
            route: function(t, n, r) {
                return e.history || (e.history = new m), o.isRegExp(t) || (t = this._routeToRegExp(t)), r || (r = this[n]), e.history.route(t, o.bind(function(i) {
                    i = this._extractParameters(t, i), r && r.apply(this, i), this.trigger.apply(this, ["route:" + n].concat(i)), e.history.trigger("route", this, n, i)
                }, this)), this
            },
            navigate: function(t, n) {
                e.history.navigate(t, n)
            },
            _bindRoutes: function() {
                if (this.routes) {
                    var e, t = [];
                    for (e in this.routes) t.unshift([e, this.routes[e]]);
                    e = 0;
                    for (var n = t.length; n > e; e++) this.route(t[e][0], t[e][1], this[t[e][1]])
                }
            },
            _routeToRegExp: function(e) {
                return e = e.replace(f, "\\$&").replace(h, "([^/]+)").replace(d, "(.*?)"), RegExp("^" + e + "$")
            },
            _extractParameters: function(e, t) {
                return e.exec(t).slice(1)
            }
        });
        var m = e.History = function() {
                this.handlers = [], o.bindAll(this, "checkUrl")
            },
            g = /^[#\/]/,
            y = /msie [\w.]+/;
        m.started = !1, o.extend(m.prototype, l, {
            interval: 50,
            getHash: function(e) {
                return (e = (e ? e.location : window.location).href.match(/#(.*)$/)) ? e[1] : ""
            },
            getFragment: function(e, t) {
                if (null == e)
                    if (this._hasPushState || t) {
                        var e = window.location.pathname,
                            n = window.location.search;
                        n && (e += n)
                    } else e = this.getHash();
                return e.indexOf(this.options.root) || (e = e.substr(this.options.root.length)), e.replace(g, "")
            },
            start: function(e) {
                if (m.started) throw Error("Backbone.history has already been started");
                m.started = !0, this.options = o.extend({}, {
                    root: "/"
                }, this.options, e), this._wantsHashChange = !1 !== this.options.hashChange, this._wantsPushState = !!this.options.pushState, this._hasPushState = !(!this.options.pushState || !window.history || !window.history.pushState);
                var e = this.getFragment(),
                    t = document.documentMode;
                return (t = y.exec(navigator.userAgent.toLowerCase()) && (!t || 7 >= t)) && (this.iframe = a('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(e)), this._hasPushState ? a(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !t ? a(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = e, e = window.location, t = e.pathname == this.options.root, this._wantsHashChange && this._wantsPushState && !this._hasPushState && !t ? (this.fragment = this.getFragment(null, !0), window.location.replace(this.options.root + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && t && e.hash && (this.fragment = this.getHash().replace(g, ""), window.history.replaceState({}, document.title, e.protocol + "//" + e.host + this.options.root + this.fragment)), this.options.silent ? void 0 : this.loadUrl())
            },
            stop: function() {
                a(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), m.started = !1
            },
            route: function(e, t) {
                this.handlers.unshift({
                    route: e,
                    callback: t
                })
            },
            checkUrl: function() {
                var e = this.getFragment();
                return e == this.fragment && this.iframe && (e = this.getFragment(this.getHash(this.iframe))), e == this.fragment ? !1 : (this.iframe && this.navigate(e), void(this.loadUrl() || this.loadUrl(this.getHash())))
            },
            loadUrl: function(e) {
                var t = this.fragment = this.getFragment(e);
                return o.any(this.handlers, function(e) {
                    return e.route.test(t) ? (e.callback(t), !0) : void 0
                })
            },
            navigate: function(e, t) {
                if (!m.started) return !1;
                t && !0 !== t || (t = {
                    trigger: t
                });
                var n = (e || "").replace(g, "");
                this.fragment != n && (this._hasPushState ? (0 != n.indexOf(this.options.root) && (n = this.options.root + n), this.fragment = n, window.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n)) : this._wantsHashChange ? (this.fragment = n, this._updateHash(window.location, n, t.replace), this.iframe && n != this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, n, t.replace))) : window.location.assign(this.options.root + e), t.trigger && this.loadUrl(e))
            },
            _updateHash: function(e, t, n) {
                n ? e.replace(e.toString().replace(/(javascript:|#).*$/, "") + "#" + t) : e.hash = t
            }
        });
        var v = e.View = function(e) {
                this.cid = o.uniqueId("view"), this._configure(e || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
            },
            b = /^(\S+)\s*(.*)$/,
            x = "model,collection,el,id,attributes,className,tagName".split(",");
        o.extend(v.prototype, l, {
            tagName: "div",
            $: function(e) {
                return this.$el.find(e)
            },
            initialize: function() {},
            render: function() {
                return this
            },
            remove: function() {
                return this.$el.remove(), this
            },
            make: function(e, t, n) {
                return e = document.createElement(e), t && a(e).attr(t), n && a(e).html(n), e
            },
            setElement: function(e, t) {
                return this.$el && this.undelegateEvents(), this.$el = e instanceof a ? e : a(e), this.el = this.$el[0], !1 !== t && this.delegateEvents(), this
            },
            delegateEvents: function(e) {
                if (e || (e = T(this, "events"))) {
                    this.undelegateEvents();
                    for (var t in e) {
                        var n = e[t];
                        if (o.isFunction(n) || (n = this[e[t]]), !n) throw Error('Method "' + e[t] + '" does not exist');
                        var r = t.match(b),
                            i = r[1],
                            r = r[2],
                            n = o.bind(n, this),
                            i = i + (".delegateEvents" + this.cid);
                        "" === r ? this.$el.bind(i, n) : this.$el.delegate(r, i, n)
                    }
                }
            },
            undelegateEvents: function() {
                this.$el.unbind(".delegateEvents" + this.cid)
            },
            _configure: function(e) {
                this.options && (e = o.extend({}, this.options, e));
                for (var t = 0, n = x.length; n > t; t++) {
                    var r = x[t];
                    e[r] && (this[r] = e[r])
                }
                this.options = e
            },
            _ensureElement: function() {
                if (this.el) this.setElement(this.el, !1);
                else {
                    var e = T(this, "attributes") || {};
                    this.id && (e.id = this.id), this.className && (e["class"] = this.className), this.setElement(this.make(this.tagName, e), !1)
                }
            }
        }), u.extend = c.extend = p.extend = v.extend = function(e, t) {
            var n = k(this, e, t);
            return n.extend = this.extend, n
        };
        var w = {
            create: "POST",
            update: "PUT",
            "delete": "DELETE",
            read: "GET"
        };
        e.sync = function(t, n, r) {
            var i = w[t];
            r || (r = {});
            var s = {
                type: i,
                dataType: "json"
            };
            return r.url || (s.url = T(n, "url") || E()), r.data || !n || "create" != t && "update" != t || (s.contentType = "application/json", s.data = JSON.stringify(n.toJSON())), e.emulateJSON && (s.contentType = "application/x-www-form-urlencoded", s.data = s.data ? {
                model: s.data
            } : {}), !e.emulateHTTP || "PUT" !== i && "DELETE" !== i || (e.emulateJSON && (s.data._method = i), s.type = "POST", s.beforeSend = function(e) {
                e.setRequestHeader("X-HTTP-Method-Override", i)
            }), "GET" !== s.type && !e.emulateJSON && (s.processData = !1), a.ajax(o.extend(s, r))
        }, e.wrapError = function(e, t, n) {
            return function(r, i) {
                i = r === t ? i : r, e ? e(t, i, n) : t.trigger("error", t, i, n)
            }
        };
        var S = function() {},
            k = function(e, t, n) {
                var r;
                return r = t && t.hasOwnProperty("constructor") ? t.constructor : function() {
                    e.apply(this, arguments)
                }, o.extend(r, e), S.prototype = e.prototype, r.prototype = new S, t && o.extend(r.prototype, t), n && o.extend(r, n), r.prototype.constructor = r, r.__super__ = e.prototype, r
            },
            T = function(e, t) {
                return e && e[t] ? o.isFunction(e[t]) ? e[t]() : e[t] : null
            },
            E = function() {
                throw Error('A "url" property or function must be specified')
            }
    }.call(this);
var __bind = function(e, t) {
    return function() {
        return e.apply(t, arguments)
    }
};
log = function() {
    log.history = log.history || [], log.history.push(arguments), this.console && console.log(Array.prototype.slice.call(arguments)[0])
}, parameterMacro = function(e) {
    return e
}, modelPropertyMacro = function(e) {
    return e
}, Array.prototype.indexOf || (Array.prototype.indexOf = function(e, t) {
    for (var n = t || 0, r = this.length; r > n; n++)
        if (this[n] === e) return n;
    return -1
}), "filter" in Array.prototype || (Array.prototype.filter = function(e, t) {
    for (var n, r = [], i = 0, o = this.length; o > i; i++) i in this && e.call(t, n = this[i], i, this) && r.push(n);
    return r
}), "map" in Array.prototype || (Array.prototype.map = function(e, t) {
    for (var n = new Array(this.length), r = 0, i = this.length; i > r; r++) r in this && (n[r] = e.call(t, this[r], r, this));
    return n
}), Object.keys = Object.keys || function() {
    var e = Object.prototype.hasOwnProperty,
        t = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        n = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
        r = n.length;
    return function(i) {
        if ("object" != typeof i && "function" != typeof i || null === i) throw new TypeError("Object.keys called on a non-object");
        var o = [];
        for (var a in i) e.call(i, a) && o.push(a);
        if (t)
            for (var s = 0; r > s; s++) e.call(i, n[s]) && o.push(n[s]);
        return o
    }
}();
var SwaggerApi = function(e, t) {
    this.isBuilt = !1, this.url = null, this.debug = !1, this.basePath = null, this.authorizations = null, this.authorizationScheme = null, this.info = null, this.useJQuery = !1, this.modelsArray = [], t = t || {}, e ? e.url ? t = e : this.url = e : t = e, null != t.url && (this.url = t.url), null != t.success && (this.success = t.success), "boolean" == typeof t.useJQuery && (this.useJQuery = t.useJQuery), this.failure = null != t.failure ? t.failure : function() {}, this.progress = null != t.progress ? t.progress : function() {}, null != t.success && (this.build(), this.isBuilt = !0)
};
SwaggerApi.prototype.build = function() {
    if (this.isBuilt) return this;
    var e = this;
    this.progress("fetching resource list: " + this.url);
    var t = {
            useJQuery: this.useJQuery,
            url: this.url,
            method: "get",
            headers: {
                accept: 'application/json,application/json;charset="utf-8",*/*'
            },
            on: {
                error: function(t) {
                    return e.fail("http" !== e.url.substring(0, 4) ? "Please specify the protocol for " + e.url : 0 === t.status ? "Can't read from server.  It may not have the appropriate access-control-origin settings." : 404 === t.status ? "Can't read swagger JSON from " + e.url : t.status + " : " + t.statusText + " " + e.url)
                },
                response: function(t) {
                    var n = t.obj || JSON.parse(t.data);
                    return e.swaggerVersion = n.swaggerVersion, "1.2" === e.swaggerVersion ? e.buildFromSpec(n) : e.buildFrom1_1Spec(n)
                }
            }
        },
        n = "undefined" != typeof window ? window : exports;
    return n.authorizations.apply(t), (new SwaggerHttp).execute(t), this
}, SwaggerApi.prototype.buildFromSpec = function(e) {
    null != e.apiVersion && (this.apiVersion = e.apiVersion), this.apis = {}, this.apisArray = [], this.consumes = e.consumes, this.produces = e.produces, this.authSchemes = e.authorizations, null != e.info && (this.info = e.info);
    var t, n = !1;
    for (t = 0; t < e.apis.length; t++) {
        var r = e.apis[t];
        if (r.operations) {
            var i;
            for (i = 0; i < r.operations.length; i++) operation = r.operations[i], n = !0
        }
    }
    if (this.basePath = e.basePath ? e.basePath : this.url.indexOf("?") > 0 ? this.url.substring(0, this.url.lastIndexOf("?")) : this.url, n) {
        var o = e.resourcePath.replace(/\//g, "");
        this.resourcePath = e.resourcePath, res = new SwaggerResource(e, this), this.apis[o] = res, this.apisArray.push(res)
    } else {
        var a;
        for (a = 0; a < e.apis.length; a++) {
            var s = e.apis[a];
            res = new SwaggerResource(s, this), this.apis[res.name] = res, this.apisArray.push(res)
        }
    }
    return this.success && this.success(), this
}, SwaggerApi.prototype.buildFrom1_1Spec = function(e) {
    log("This API is using a deprecated version of Swagger!  Please see http://github.com/wordnik/swagger-core/wiki for more info"), null != e.apiVersion && (this.apiVersion = e.apiVersion), this.apis = {}, this.apisArray = [], this.produces = e.produces, null != e.info && (this.info = e.info);
    for (var t = !1, n = 0; n < e.apis.length; n++) {
        var r = e.apis[n];
        if (r.operations)
            for (var i = 0; i < r.operations.length; i++) operation = r.operations[i], t = !0
    }
    if (this.basePath = e.basePath ? e.basePath : this.url.indexOf("?") > 0 ? this.url.substring(0, this.url.lastIndexOf("?")) : this.url, t) {
        var o = e.resourcePath.replace(/\//g, "");
        this.resourcePath = e.resourcePath;
        var a = new SwaggerResource(e, this);
        this.apis[o] = a, this.apisArray.push(a)
    } else
        for (k = 0; k < e.apis.length; k++) resource = e.apis[k], a = new SwaggerResource(resource, this), this.apis[a.name] = a, this.apisArray.push(a);
    return this.success && this.success(), this
}, SwaggerApi.prototype.selfReflect = function() {
    var e, t, n;
    if (null == this.apis) return !1;
    n = this.apis;
    for (t in n)
        if (e = n[t], null == e.ready) return !1;
    return this.setConsolidatedModels(), this.ready = !0, null != this.success ? this.success() : void 0
}, SwaggerApi.prototype.fail = function(e) {
    throw this.failure(e), e
}, SwaggerApi.prototype.setConsolidatedModels = function() {
    var e, t, n, r, i, o, a, s, l;
    this.models = {}, a = this.apis;
    for (r in a) {
        n = a[r];
        for (t in n.models) null == this.models[t] && (this.models[t] = n.models[t], this.modelsArray.push(n.models[t]))
    }
    for (s = this.modelsArray, l = [], i = 0, o = s.length; o > i; i++) e = s[i], l.push(e.setReferencedModels(this.models));
    return l
}, SwaggerApi.prototype.help = function() {
    var e, t, n, r, i, o, a, s, l, u;
    s = this.apis;
    for (i in s) {
        r = s[i], log(i), l = r.operations;
        for (t in l)
            for (e = l[t], log("  " + e.nickname), u = e.parameters, o = 0, a = u.length; a > o; o++) n = u[o], log("    " + n.name + (n.required ? " (required)" : "") + " - " + n.description)
    }
    return this
};
var SwaggerResource = function(e, t) {
    var n = this;
    this.api = t, this.api = this.api, consumes = this.consumes | [], produces = this.produces | [], this.path = null != this.api.resourcePath ? this.api.resourcePath : e.path, this.description = e.description;
    var r = this.path.split("/");
    if (this.name = r[r.length - 1].replace(".{format}", ""), this.basePath = this.api.basePath, this.operations = {}, this.operationsArray = [], this.modelsArray = [], this.models = {}, this.rawModels = {}, this.useJQuery = "undefined" != typeof t.useJQuery ? t.useJQuery : null, null != e.apis && null != this.api.resourcePath) this.addApiDeclaration(e);
    else {
        null == this.path && this.api.fail("SwaggerResources must have a path."), this.url = "http" === this.path.substring(0, 4) ? this.path.replace("{format}", "json") : this.api.basePath + this.path.replace("{format}", "json"), this.api.progress("fetching resource " + this.name + ": " + this.url), obj = {
            url: this.url,
            method: "get",
            useJQuery: this.useJQuery,
            headers: {
                accept: 'application/json,application/json;charset="utf-8",*/*'
            },
            on: {
                response: function(e) {
                    var t = e.obj || JSON.parse(e.data);
                    return n.addApiDeclaration(t)
                },
                error: function(e) {
                    return n.api.fail("Unable to read api '" + n.name + "' from path " + n.url + " (server returned " + e.statusText + ")")
                }
            }
        };
        var i = "undefined" != typeof window ? window : exports;
        i.authorizations.apply(obj), (new SwaggerHttp).execute(obj)
    }
};
SwaggerResource.prototype.getAbsoluteBasePath = function(e) {
    var t, n;
    n = this.api.basePath, t = n.lastIndexOf(e);
    var r = n.split("/"),
        i = r[0] + "//" + r[2];
    if (0 === e.indexOf("http")) return e;
    if ("/" === e) return i;
    if ("/" == e.substring(0, 1)) return i + e;
    var t = this.basePath.lastIndexOf("/"),
        o = this.basePath.substring(0, t);
    return "/" == o.substring(o.length - 1) ? o + e : o + "/" + e
}, SwaggerResource.prototype.addApiDeclaration = function(e) {
    if (null != e.produces && (this.produces = e.produces), null != e.consumes && (this.consumes = e.consumes), null != e.basePath && e.basePath.replace(/\s/g, "").length > 0 && (this.basePath = -1 === e.basePath.indexOf("http") ? this.getAbsoluteBasePath(e.basePath) : e.basePath), this.addModels(e.models), e.apis)
        for (var t = 0; t < e.apis.length; t++) {
            var n = e.apis[t];
            this.addOperations(n.path, n.operations, e.consumes, e.produces)
        }
    return this.api[this.name] = this, this.ready = !0, this.api.selfReflect()
}, SwaggerResource.prototype.addModels = function(e) {
    if (null != e) {
        var t;
        for (t in e)
            if (null == this.models[t]) {
                var n = new SwaggerModel(t, e[t]);
                this.modelsArray.push(n), this.models[t] = n, this.rawModels[t] = e[t]
            }
        for (var r = [], i = 0; i < this.modelsArray.length; i++) model = this.modelsArray[i], r.push(model.setReferencedModels(this.models));
        return r
    }
}, SwaggerResource.prototype.addOperations = function(e, t, n, i) {
    if (t) {
        output = [];
        for (var a = 0; a < t.length; a++) {
            if (o = t[a], n = this.consumes, i = this.produces, n = null != o.consumes ? o.consumes : this.consumes, i = null != o.produces ? o.produces : this.produces, type = o.type || o.responseClass, "array" === type && (ref = null, o.items && (ref = o.items.type || o.items.$ref), type = "array[" + ref + "]"), responseMessages = o.responseMessages, method = o.method, o.httpMethod && (method = o.httpMethod), o.supportedContentTypes && (n = o.supportedContentTypes), o.errorResponses) {
                responseMessages = o.errorResponses;
                for (var s = 0; s < responseMessages.length; s++) r = responseMessages[s], r.message = r.reason, r.reason = null
            }
            o.nickname = this.sanitize(o.nickname), op = new SwaggerOperation(o.nickname, e, method, o.parameters, o.summary, o.notes, type, responseMessages, this, n, i, o.authorizations), this.operations[op.nickname] = op, output.push(this.operationsArray.push(op))
        }
        return output
    }
}, SwaggerResource.prototype.sanitize = function(e) {
    var t;
    return t = e.replace(/[\s!@#$%^&*()_+=\[{\]};:<>|.\/?,\\'""-]/g, "_"), t = t.replace(/((_){2,})/g, "_"), t = t.replace(/^(_)*/g, ""), t = t.replace(/([_])*$/g, "")
}, SwaggerResource.prototype.help = function() {
    var e, t = this.operations,
        n = [];
    for (e in t) {
        operation = t[e];
        for (var r = "  " + operation.nickname, i = 0; i < operation.parameters; i++) parameter = operation.parameters[i], r.concat("    " + parameter.name + (parameter.required ? " (required)" : "") + " - " + parameter.description);
        n.push(r)
    }
    return n
};
var SwaggerModel = function(e, t) {
    this.name = null != t.id ? t.id : e, this.properties = [];
    var n;
    for (n in t.properties) {
        if (null != t.required) {
            var r;
            for (r in t.required) n === t.required[r] && (t.properties[n].required = !0)
        }
        prop = new SwaggerModelProperty(n, t.properties[n]), this.properties.push(prop)
    }
};
SwaggerModel.prototype.setReferencedModels = function(e) {
    for (var t = [], n = 0; n < this.properties.length; n++) {
        var r = this.properties[n],
            i = r.type || r.dataType;
        t.push(null != e[i] ? r.refModel = e[i] : null != r.refDataType && null != e[r.refDataType] ? r.refModel = e[r.refDataType] : void 0)
    }
    return t
}, SwaggerModel.prototype.getMockSignature = function(e) {
    for (var t = [], n = 0; n < this.properties.length; n++) prop = this.properties[n], t.push(prop.toString());
    var r = '<span class="strong">',
        i = "</span>",
        o = r + this.name + " {" + i,
        a = r + "}" + i,
        s = o + "<div>" + t.join(",</div><div>") + "</div>" + a;
    e || (e = []), e.push(this.name);
    for (var n = 0; n < this.properties.length; n++) prop = this.properties[n], null != prop.refModel && -1 === e.indexOf(prop.refModel.name) && (s += "<br>" + prop.refModel.getMockSignature(e));
    return s
}, SwaggerModel.prototype.createJSONSample = function(e) {
    if (sampleModels[this.name]) return sampleModels[this.name];
    var t = {},
        e = e || [];
    e.push(this.name);
    for (var n = 0; n < this.properties.length; n++) prop = this.properties[n], t[prop.name] = prop.getSampleValue(e);
    return e.pop(this.name), t
};
var SwaggerModelProperty = function(e, t) {
    this.name = e, this.dataType = t.type || t.dataType || t.$ref, this.isCollection = this.dataType && ("array" === this.dataType.toLowerCase() || "list" === this.dataType.toLowerCase() || "set" === this.dataType.toLowerCase()), this.descr = t.description, this.required = t.required, this.defaultValue = modelPropertyMacro(t.defaultValue), null != t.items && (null != t.items.type && (this.refDataType = t.items.type), null != t.items.$ref && (this.refDataType = t.items.$ref)), this.dataTypeWithRef = null != this.refDataType ? this.dataType + "[" + this.refDataType + "]" : this.dataType, null != t.allowableValues && (this.valueType = t.allowableValues.valueType, this.values = t.allowableValues.values, null != this.values && (this.valuesString = "'" + this.values.join("' or '") + "'")), null != t["enum"] && (this.valueType = "string", this.values = t["enum"], null != this.values && (this.valueString = "'" + this.values.join("' or '") + "'"))
};
SwaggerModelProperty.prototype.getSampleValue = function(e) {
    var t;
    return t = null != this.refModel && -1 === e.indexOf(prop.refModel.name) ? this.refModel.createJSONSample(e) : this.toSampleValue(this.isCollection ? this.refDataType : this.dataType), this.isCollection ? [t] : t
}, SwaggerModelProperty.prototype.toSampleValue = function(e) {
    var t;
    return t = "undefined" != typeof this.defaultValue && null !== this.defaultValue ? this.defaultValue : "integer" === e ? 0 : "boolean" === e ? !1 : "double" === e || "number" === e ? 0 : "string" === e ? "" : e
}, SwaggerModelProperty.prototype.toString = function() {
    var e = this.required ? "propReq" : "propOpt",
        t = '<span class="propName ' + e + '">' + this.name + '</span> (<span class="propType">' + this.dataTypeWithRef + "</span>";
    return this.required || (t += ', <span class="propOptKey">optional</span>'), t += ")", null != this.values && (t += " = <span class='propVals'>['" + this.values.join("' or '") + "']</span>"), null != this.descr && (t += ': <span class="propDesc">' + this.descr + "</span>"), t
};
var SwaggerOperation = function(e, t, n, r, i, o, a, s, l, u, c, p) {
    var h = this,
        d = [];
    this.nickname = e || d.push("SwaggerOperations must have a nickname."), this.path = t || d.push("SwaggerOperation " + e + " is missing path."), this.method = n || d.push("SwaggerOperation " + e + " is missing method."), this.parameters = null != r ? r : [], this.summary = i, this.notes = o, this.type = a, this.responseMessages = s || [], this.resource = l || d.push("Resource is required"), this.consumes = u, this.produces = c, this.authorizations = p, this["do"] = __bind(this["do"], this), d.length > 0 && this.resource.api.fail(d), this.path = this.path.replace("{format}", "json"), this.method = this.method.toLowerCase(), this.isGetMethod = "get" === this.method, this.resourceName = this.resource.name, "undefined" != typeof this.type && "void" === this.type ? this.type = null : (this.responseClassSignature = this.getSignature(this.type, this.resource.models), this.responseSampleJSON = this.getSampleJSON(this.type, this.resource.models));
    for (var f = 0; f < this.parameters.length; f++) {
        var m = this.parameters[f];
        m.name = m.name || m.type || m.dataType;
        var a = m.type || m.dataType;
        "array" === a && (a = "array[" + (m.items.$ref ? m.items.$ref : m.items.type) + "]"), m.type = a, "boolean" === a.toLowerCase() && (m.allowableValues = {}, m.allowableValues.values = ["true", "false"]), m.signature = this.getSignature(a, this.resource.models), m.sampleJSON = this.getSampleJSON(a, this.resource.models);
        var g = m["enum"];
        if (null != g) {
            m.isList = !0, m.allowableValues = {}, m.allowableValues.descriptiveValues = [];
            for (var y = 0; y < g.length; y++) {
                var v = g[y];
                m.allowableValues.descriptiveValues.push(null != m.defaultValue ? {
                    value: String(v),
                    isDefault: v === m.defaultValue
                } : {
                    value: String(v),
                    isDefault: !1
                })
            }
        } else if (null != m.allowableValues && ("RANGE" === m.allowableValues.valueType ? m.isRange = !0 : m.isList = !0, null != m.allowableValues && (m.allowableValues.descriptiveValues = [], m.allowableValues.values)))
            for (var y = 0; y < m.allowableValues.values.length; y++) {
                var v = m.allowableValues.values[y];
                m.allowableValues.descriptiveValues.push(null != m.defaultValue ? {
                    value: String(v),
                    isDefault: v === m.defaultValue
                } : {
                    value: String(v),
                    isDefault: !1
                })
            }
        m.defaultValue = parameterMacro(m.defaultValue)
    }
    this.resource[this.nickname] = function(e, t, n) {
        return h["do"](e, t, n)
    }, this.resource[this.nickname].help = function() {
        return h.help()
    }
};
SwaggerOperation.prototype.isListType = function(e) {
    return e && e.indexOf("[") >= 0 ? e.substring(e.indexOf("[") + 1, e.indexOf("]")) : void 0
}, SwaggerOperation.prototype.getSignature = function(e, t) {
    var n, r;
    return r = this.isListType(e), n = null != r && t[r] || null != t[e] ? !1 : !0, n ? e : null != r ? t[r].getMockSignature() : t[e].getMockSignature()
}, SwaggerOperation.prototype.getSampleJSON = function(e, t) {
    var n, r, i;
    if (r = this.isListType(e), n = null != r && t[r] || null != t[e] ? !1 : !0, i = n ? void 0 : null != r ? t[r].createJSONSample() : t[e].createJSONSample()) {
        if (i = r ? [i] : i, "string" == typeof i) return i;
        if ("object" == typeof i) {
            var o = i;
            if (i instanceof Array && i.length > 0 && (o = i[0]), o.nodeName) {
                var a = (new XMLSerializer).serializeToString(o);
                return this.formatXml(a)
            }
            return JSON.stringify(i, null, 2)
        }
        return i
    }
}, SwaggerOperation.prototype["do"] = function(e, t, n, r) {
    var i, o, a, s, l, u, c, p;
    null == e && (e = {}), null == t && (t = {}), u = null, c = null, "function" == typeof e && (r = t, n = e, e = {}), "function" == typeof t && (r = n, n = t), null == r && (r = function(e, t, n) {
        return log(e, t, n)
    }), null == n && (n = function(e) {
        var t;
        return t = null, t = null != e ? e.data : "no data", log("default callback: " + t)
    }), a = {}, a.headers = [], null != e.headers && (a.headers = e.headers, delete e.headers);
    for (var s = [], h = 0; h < this.parameters.length; h++) {
        var o = this.parameters[h];
        "header" === o.paramType ? e[o.name] && (a.headers[o.name] = e[o.name]) : ("form" === o.paramType || "file" === o.paramType.toLowerCase()) && s.push(o)
    }
    if (null != e.body && (a.body = e.body, delete e.body), s) {
        var i;
        for (i in s) p = s[i], e[p.name] && (a[p.name] = e[p.name])
    }
    return l = new SwaggerRequest(this.method, this.urlify(e), a, t, n, r, this), null != t.mock ? l : !0
}, SwaggerOperation.prototype.pathJson = function() {
    return this.path.replace("{format}", "json")
}, SwaggerOperation.prototype.pathXml = function() {
    return this.path.replace("{format}", "xml")
}, SwaggerOperation.prototype.encodePathParam = function(e) {
    var t, n, r, i, o;
    if (e = e.toString(), -1 === e.indexOf("/")) return encodeURIComponent(e);
    for (r = e.split("/"), t = [], i = 0, o = r.length; o > i; i++) n = r[i], t.push(encodeURIComponent(n));
    return t.join("/")
}, SwaggerOperation.prototype.urlify = function(e) {
    for (var t = this.resource.basePath + this.pathJson(), n = this.parameters, r = 0; r < n.length; r++) {
        var i = n[r];
        if ("path" === i.paramType) {
            if (!e[i.name]) throw "" + i.name + " is a required path param.";
            var o = new RegExp("{" + i.name + "[^}]*}", "gi");
            t = t.replace(o, this.encodePathParam(e[i.name])), delete e[i.name]
        }
    }
    for (var a = "", r = 0; r < n.length; r++) {
        var i = n[r];
        "query" === i.paramType && void 0 !== e[i.name] && ("" !== a && (a += "&"), a += encodeURIComponent(i.name) + "=" + encodeURIComponent(e[i.name]))
    }
    return null != a && a.length > 0 && (t += "?" + a), t
}, SwaggerOperation.prototype.supportHeaderParams = function() {
    return this.resource.api.supportHeaderParams
}, SwaggerOperation.prototype.supportedSubmitMethods = function() {
    return this.resource.api.supportedSubmitMethods
}, SwaggerOperation.prototype.getQueryParams = function(e) {
    return this.getMatchingParams(["query"], e)
}, SwaggerOperation.prototype.getHeaderParams = function(e) {
    return this.getMatchingParams(["header"], e)
}, SwaggerOperation.prototype.getMatchingParams = function(e, t) {
    for (var n = {}, r = this.parameters, i = 0; i < r.length; i++) param = r[i], t && t[param.name] && (n[param.name] = t[param.name]);
    var o, a = this.resource.api.headers;
    for (o in a) {
        var s = a[o];
        n[o] = s
    }
    return n
}, SwaggerOperation.prototype.help = function() {
    for (var e = "", t = this.parameters, n = 0; n < t.length; n++) {
        var r = t[n];
        "" !== e && (e += "\n"), e += "* " + r.name + (r.required ? " (required)" : "") + " - " + r.description
    }
    return e
}, SwaggerOperation.prototype.formatXml = function(e) {
    var t, n, r, i, o, a, s, l, u, c, p, h, d;
    for (l = /(>)(<)(\/*)/g, c = /[ ]*(.*)[ ]+\n/g, t = /(<.+>)(.+\n)/g, e = e.replace(l, "$1\n$2$3").replace(c, "$1\n").replace(t, "$1\n$2"), s = 0, n = "", o = e.split("\n"), r = 0, i = "other", u = {
        "single->single": 0,
        "single->closing": -1,
        "single->opening": 0,
        "single->other": 0,
        "closing->single": 0,
        "closing->closing": -1,
        "closing->opening": 0,
        "closing->other": 0,
        "opening->single": 1,
        "opening->closing": 0,
        "opening->opening": 1,
        "opening->other": 1,
        "other->single": 0,
        "other->closing": -1,
        "other->opening": 0,
        "other->other": 0
    }, p = function(e) {
        var t, o, a, s, l, c, p;
        return c = {
            single: Boolean(e.match(/<.+\/>/)),
            closing: Boolean(e.match(/<\/.+>/)),
            opening: Boolean(e.match(/<[^!?].*>/))
        }, l = function() {
            var e;
            e = [];
            for (a in c) p = c[a], p && e.push(a);
            return e
        }()[0], l = void 0 === l ? "other" : l, t = i + "->" + l, i = l, s = "", r += u[t], s = function() {
            var e, t, n;
            for (n = [], o = e = 0, t = r; t >= 0 ? t > e : e > t; o = t >= 0 ? ++e : --e) n.push("  ");
            return n
        }().join(""), "opening->closing" === t ? n = n.substr(0, n.length - 1) + e + "\n" : n += s + e + "\n"
    }, h = 0, d = o.length; d > h; h++) a = o[h], p(a);
    return n
};
var SwaggerRequest = function(e, t, n, r, i, o, a, s) {
    var l = this,
        u = [];
    if (this.useJQuery = "undefined" != typeof a.resource.useJQuery ? a.resource.useJQuery : null, this.type = e || u.push("SwaggerRequest type is required (get/post/put/delete/patch/options)."), this.url = t || u.push("SwaggerRequest url is required."), this.params = n, this.opts = r, this.successCallback = i || u.push("SwaggerRequest successCallback is required."), this.errorCallback = o || u.push("SwaggerRequest error callback is required."), this.operation = a || u.push("SwaggerRequest operation is required."), this.execution = s, this.headers = n.headers || {}, u.length > 0) throw u;
    this.type = this.type.toUpperCase();
    var c = this.setHeaders(n, this.operation),
        p = n.body;
    if (c["Content-Type"]) {
        var h, d = {},
            f = this.operation.parameters;
        for (h = 0; h < f.length; h++) {
            var m = f[h];
            "form" === m.paramType && (d[m.name] = m)
        }
        if (0 === c["Content-Type"].indexOf("application/x-www-form-urlencoded")) {
            var g, y = "";
            for (g in d) value = this.params[g], "undefined" != typeof value && ("" !== y && (y += "&"), y += encodeURIComponent(g) + "=" + encodeURIComponent(value));
            p = y
        } else if (0 === c["Content-Type"].indexOf("multipart/form-data")) {
            var g, v = "",
                b = "----SwaggerFormBoundary" + Date.now();
            for (g in d) value = this.params[g], "undefined" != typeof value && (v += "--" + b + "\n", v += 'Content-Disposition: form-data; name="' + g + '"', v += "\n\n", v += value + "\n");
            v += "--" + b + "--\n", c["Content-Type"] = "multipart/form-data; boundary=" + b, p = v
        }
    }
    if (null == this.headers || null == this.headers.mock) {
        obj = {
            url: this.url,
            method: this.type,
            headers: c,
            body: p,
            useJQuery: this.useJQuery,
            on: {
                error: function(e) {
                    return l.errorCallback(e, l.opts.parent)
                },
                redirect: function(e) {
                    return l.successCallback(e, l.opts.parent)
                },
                307: function(e) {
                    return l.successCallback(e, l.opts.parent)
                },
                response: function(e) {
                    return l.successCallback(e, l.opts.parent)
                }
            }
        };
        var x;
        if (x = "undefined" != typeof window ? window : exports, status = x.authorizations.apply(obj, this.operation.authorizations), null != r.mock) return obj;
        status !== !1 ? (new SwaggerHttp).execute(obj) : obj.canceled = !0
    }
};
SwaggerRequest.prototype.setHeaders = function(e) {
    var t, n = "application/json",
        r = "application/json",
        i = this.operation.parameters,
        o = [],
        a = [],
        s = e.body,
        l = {};
    for (t = 0; t < i.length; t++) {
        var u = i[t];
        if ("form" === u.paramType) o.push(u);
        else if ("file" === u.paramType) a.push(u);
        else if ("header" === u.paramType && this.params.headers) {
            var c = u.name,
                p = this.params.headers[u.name];
            "undefined" != typeof this.params.headers[u.name] && (l[c] = p)
        }
    }
    return !s || "POST" !== this.type && "PUT" !== this.type && "PATCH" !== this.type && "DELETE" !== this.type ? o.length > 0 ? r = a.length > 0 ? "multipart/form-data" : "application/x-www-form-urlencoded" : "DELETE" === this.type ? s = "{}" : "DELETE" != this.type && (n = null) : this.opts.requestContentType && (r = this.opts.requestContentType), r && this.operation.consumes && -1 === this.operation.consumes.indexOf(r) && (log("server doesn't consume " + r + ", try " + JSON.stringify(this.operation.consumes)), r = this.operation.consumes[0]), n = this.opts.responseContentType ? this.opts.responseContentType : "application/json", n && this.operation.produces && -1 === this.operation.produces.indexOf(n) && (log("server can't produce " + n), n = this.operation.produces[0]), (r && "" !== s || "application/x-www-form-urlencoded" === r) && (l["Content-Type"] = r), n && (l.Accept = n), l
}, SwaggerRequest.prototype.asCurl = function() {
    var e = [];
    if (this.headers) {
        var t;
        for (t in this.headers) e.push('--header "' + t + ": " + this.headers[v] + '"')
    }
    return "curl " + e.join(" ") + " " + this.url
};
var SwaggerHttp = function() {};
SwaggerHttp.prototype.execute = function(e) {
    return this.useJQuery = e && "boolean" == typeof e.useJQuery ? e.useJQuery : this.isIE8(), this.useJQuery ? (new JQueryHttpClient).execute(e) : (new ShredHttpClient).execute(e)
}, SwaggerHttp.prototype.isIE8 = function() {
    var e = !1;
    if ("undefined" != typeof navigator && navigator.userAgent && (nav = navigator.userAgent.toLowerCase(), -1 !== nav.indexOf("msie"))) {
        var t = parseInt(nav.split("msie")[1]);
        8 >= t && (e = !0)
    }
    return e
};
var JQueryHttpClient = function() {
    "use strict";
    if (!e) var e = window.jQuery
};
JQueryHttpClient.prototype.execute = function(e) {
    var t = e.on,
        n = e;
    return e.type = e.method, e.cache = !1, e.beforeSend = function(t) {
        var n, r;
        if (e.headers) {
            r = [];
            var n;
            for (n in e.headers) r.push("content-type" === n.toLowerCase() ? e.contentType = e.headers[n] : "accept" === n.toLowerCase() ? e.accepts = e.headers[n] : t.setRequestHeader(n, e.headers[n]));
            return r
        }
    }, e.data = e.body, e.complete = function(e) {
        for (var r = {}, i = e.getAllResponseHeaders().split("\n"), o = 0; o < i.length; o++) {
            var a = i[o].trim();
            if (0 !== a.length) {
                var s = a.indexOf(":");
                if (-1 !== s) {
                    var l = a.substring(0, s).trim(),
                        u = a.substring(s + 1).trim();
                    r[l] = u
                } else r[a] = null
            }
        }
        var c = {
                url: n.url,
                method: n.method,
                status: e.status,
                data: e.responseText,
                headers: r
            },
            p = r["content-type"] || r["Content-Type"] || null;
        if (null != p && (0 == p.indexOf("application/json") || p.indexOf("+json") > 0) && (c.obj = e.responseText && "" !== e.responseText ? JSON.parse(e.responseText) : {}), e.status >= 200 && e.status < 300) t.response(c);
        else {
            if (!(0 === e.status || e.status >= 400 && e.status < 599)) return t.response(c);
            t.error(c)
        }
    }, jQuery.support.cors = !0, jQuery.ajax(e)
};
var ShredHttpClient = function(e) {
    this.options = e || {}, this.isInitialized = !1;
    "undefined" != typeof window ? (this.Shred = require("./shred"), this.content = require("./shred/content")) : this.Shred = require("shred"), this.shred = new this.Shred
};
ShredHttpClient.prototype.initShred = function() {
    this.isInitialized = !0, this.registerProcessors(this.shred)
}, ShredHttpClient.prototype.registerProcessors = function() {
    var e = function(e) {
            return e
        },
        t = function(e) {
            return e.toString()
        };
    "undefined" != typeof window ? this.content.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
        parser: e,
        stringify: t
    }) : this.Shred.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
        parser: e,
        stringify: t
    })
}, ShredHttpClient.prototype.execute = function(e) {
    this.isInitialized || this.initShred();
    var t, n = e.on,
        r = function(e) {
            var t = {
                    headers: e._headers,
                    url: e.request.url,
                    method: e.request.method,
                    status: e.status,
                    data: e.content.data
                },
                n = e._headers["content-type"] || e._headers["Content-Type"] || null;
            return null != n && (0 == n.indexOf("application/json") || n.indexOf("+json") > 0) && (t.obj = e.content.data && "" !== e.content.data ? JSON.parse(e.content.data) : {}), t
        },
        i = function(e) {
            var t = {
                status: 0,
                data: e.message || e
            };
            return e.code && (t.obj = e, ("ENOTFOUND" === e.code || "ECONNREFUSED" === e.code) && (t.status = 404)), t
        };
    return t = {
        error: function(t) {
            return e ? n.error(r(t)) : void 0
        },
        request_error: function(t) {
            return e ? n.error(i(t)) : void 0
        },
        redirect: function(t) {
            return e ? n.redirect(r(t)) : void 0
        },
        307: function(t) {
            return e ? n.redirect(r(t)) : void 0
        },
        response: function(t) {
            return e ? n.response(r(t)) : void 0
        }
    }, e && (e.on = t), this.shred.request(e)
};
var SwaggerAuthorizations = function() {
    this.authz = {}
};
SwaggerAuthorizations.prototype.add = function(e, t) {
    return this.authz[e] = t, t
}, SwaggerAuthorizations.prototype.remove = function(e) {
    return delete this.authz[e]
}, SwaggerAuthorizations.prototype.apply = function(e, t) {
    var n, r = null;
    if ("undefined" == typeof t || 0 == Object.keys(t).length)
        for (n in this.authz) value = this.authz[n], result = value.apply(e, t), result === !0 && (r = !0);
    else
        for (name in t)
            for (n in this.authz) n == name && (value = this.authz[n], result = value.apply(e, t), result === !0 && (r = !0));
    return r
};
var ApiKeyAuthorization = function(e, t, n, r) {
    this.name = e, this.value = t, this.type = n, this.delimiter = r
};
ApiKeyAuthorization.prototype.apply = function(e) {
    return "query" === this.type ? (e.url = e.url.indexOf("?") > 0 ? e.url + "&" + this.name + "=" + this.value : e.url + "?" + this.name + "=" + this.value, !0) : "header" === this.type ? ("undefined" != typeof e.headers[this.name] ? "undefined" != typeof this.delimiter && (e.headers[this.name] = e.headers[this.name] + this.delimiter + this.value) : e.headers[this.name] = this.value, !0) : void 0
};
var CookieAuthorization = function(e) {
    this.cookie = e
};
CookieAuthorization.prototype.apply = function(e) {
    return e.cookieJar = e.cookieJar || CookieJar(), e.cookieJar.setCookie(this.cookie), !0
};
var PasswordAuthorization = function(e, t, n) {
    this.name = e, this.username = t, this.password = n, this._btoa = null, this._btoa = "undefined" != typeof window ? btoa : require("btoa")
};
PasswordAuthorization.prototype.apply = function(e) {
    var t = this._btoa;
    return e.headers.Authorization = "Basic " + t(this.username + ":" + this.password), !0
};
var e = "undefined" != typeof window ? window : exports,
    sampleModels = {},
    cookies = {};
e.SampleModels = sampleModels, e.SwaggerHttp = SwaggerHttp, e.SwaggerRequest = SwaggerRequest, e.authorizations = new SwaggerAuthorizations, e.ApiKeyAuthorization = ApiKeyAuthorization, e.PasswordAuthorization = PasswordAuthorization, e.CookieAuthorization = CookieAuthorization, e.JQueryHttpClient = JQueryHttpClient, e.ShredHttpClient = ShredHttpClient, e.SwaggerOperation = SwaggerOperation, e.SwaggerModel = SwaggerModel, e.SwaggerModelProperty = SwaggerModelProperty, e.SwaggerResource = SwaggerResource, e.SwaggerApi = SwaggerApi, $(function() {
    $.fn.vAlign = function() {
        return this.each(function() {
            var e = $(this).height(),
                t = $(this).parent().height(),
                n = (t - e) / 2;
            $(this).css("margin-top", n)
        })
    }, $.fn.stretchFormtasticInputWidthToParent = function() {
        return this.each(function() {
            var e = $(this).closest("form").innerWidth(),
                t = parseInt($(this).closest("form").css("padding-left"), 10) + parseInt($(this).closest("form").css("padding-right"), 10),
                n = parseInt($(this).css("padding-left"), 10) + parseInt($(this).css("padding-right"), 10);
            $(this).css("width", e - t - n)
        })
    }, $("form.formtastic li.string input, form.formtastic textarea").stretchFormtasticInputWidthToParent(), $("ul.downplayed li div.content p").vAlign(), $("form.sandbox").submit(function() {
        var e = !0;
        return $(this).find("input.required").each(function() {
            $(this).removeClass("error"), "" == $(this).val() && ($(this).addClass("error"), $(this).wiggle(), e = !1)
        }), e
    })
}), log = function() {
    log.history = log.history || [], log.history.push(arguments), this.console && console.log(Array.prototype.slice.call(arguments)[0])
}, Function.prototype.bind && console && "object" == typeof console.log && ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"].forEach(function(e) {
    console[e] = this.bind(console[e], console)
}, Function.prototype.call);
var Docs = {
    shebang: function() {
        var e = $.param.fragment().split("/");
        switch (e.shift(), e.length) {
            case 1:
                log("shebang resource:" + e[0]);
                var t = "resource_" + e[0];
                Docs.expandEndpointListForResource(e[0]), $("#" + t).slideto({
                    highlight: !1
                });
                break;
            case 2:
                log("shebang endpoint: " + e.join("_")), Docs.expandEndpointListForResource(e[0]), $("#" + t).slideto({
                    highlight: !1
                });
                var n = e.join("_"),
                    r = n + "_content";
                log("li_dom_id " + n), log("li_content_dom_id " + r), Docs.expandOperation($("#" + r)), $("#" + n).slideto({
                    highlight: !1
                })
        }
    },
    toggleEndpointListForResource: function(e) {
        var t = $("li#resource_" + Docs.escapeResourceName(e) + " ul.endpoints");
        t.is(":visible") ? Docs.collapseEndpointListForResource(e) : Docs.expandEndpointListForResource(e)
    },
    expandEndpointListForResource: function(e) {
        var e = Docs.escapeResourceName(e);
        if ("" == e) return void $(".resource ul.endpoints").slideDown();
        $("li#resource_" + e).addClass("active");
        var t = $("li#resource_" + e + " ul.endpoints");
        t.slideDown()
    },
    collapseEndpointListForResource: function(e) {
        var e = Docs.escapeResourceName(e);
        $("li#resource_" + e).removeClass("active");
        var t = $("li#resource_" + e + " ul.endpoints");
        t.slideUp()
    },
    expandOperationsForResource: function(e) {
        return Docs.expandEndpointListForResource(e), "" == e ? void $(".resource ul.endpoints li.operation div.content").slideDown() : void $("li#resource_" + Docs.escapeResourceName(e) + " li.operation div.content").each(function() {
            Docs.expandOperation($(this))
        })
    },
    collapseOperationsForResource: function(e) {
        Docs.expandEndpointListForResource(e), $("li#resource_" + Docs.escapeResourceName(e) + " li.operation div.content").each(function() {
            Docs.collapseOperation($(this))
        })
    },
    escapeResourceName: function(e) {
        return e.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&")
    },
    expandOperation: function(e) {
        e.slideDown()
    },
    collapseOperation: function(e) {
        e.slideUp()
    }
};
! function() {
    var e = Handlebars.template,
        t = Handlebars.templates = Handlebars.templates || {};
    t.content_type = e(function(e, t, n, r, i) {
        function o(e, t) {
            var r, i = "";
            return i += "\n  ", r = n.each.call(e, e.produces, {
                hash: {},
                inverse: p.noop,
                fn: p.program(2, a, t),
                data: t
            }), (r || 0 === r) && (i += r), i += "\n"
        }

        function a(e) {
            var t, n = "";
            return n += '\n	<option value="', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += '">', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += "</option>\n	"
        }

        function s() {
            return '\n  <option value="application/json">application/json</option>\n'
        }
        this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
        var l, u = "",
            c = "function",
            p = this;
        return u += '<label for="contentType"></label>\n<select name="contentType">\n', l = n["if"].call(t, t.produces, {
            hash: {},
            inverse: p.program(4, s, i),
            fn: p.program(1, o, i),
            data: i
        }), (l || 0 === l) && (u += l), u += "\n</select>\n"
    })
}(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.main = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i, o = "";
                return o += '\n    <div class="info_title">' + d((r = e.info, r = null == r || r === !1 ? r : r.title, typeof r === h ? r.apply(e) : r)) + '</div>\n    <div class="info_description">', r = e.info, r = null == r || r === !1 ? r : r.description, i = typeof r === h ? r.apply(e) : r, (i || 0 === i) && (o += i), o += "</div>\n    ", i = n["if"].call(e, (r = e.info, null == r || r === !1 ? r : r.termsOfServiceUrl), {
                    hash: {},
                    inverse: f.noop,
                    fn: f.program(2, a, t),
                    data: t
                }), (i || 0 === i) && (o += i), o += "\n    ", i = n["if"].call(e, (r = e.info, null == r || r === !1 ? r : r.contact), {
                    hash: {},
                    inverse: f.noop,
                    fn: f.program(4, s, t),
                    data: t
                }), (i || 0 === i) && (o += i), o += "\n    ", i = n["if"].call(e, (r = e.info, null == r || r === !1 ? r : r.license), {
                    hash: {},
                    inverse: f.noop,
                    fn: f.program(6, l, t),
                    data: t
                }), (i || 0 === i) && (o += i), o += "\n  "
            }

            function a(e) {
                var t, n = "";
                return n += '<div class="info_tos"><a href="' + d((t = e.info, t = null == t || t === !1 ? t : t.termsOfServiceUrl, typeof t === h ? t.apply(e) : t)) + '">Terms of service</a></div>'
            }

            function s(e) {
                var t, n = "";
                return n += "<div class='info_contact'><a href=\"mailto:" + d((t = e.info, t = null == t || t === !1 ? t : t.contact, typeof t === h ? t.apply(e) : t)) + '">Contact the developer</a></div>'
            }

            function l(e) {
                var t, n = "";
                return n += "<div class='info_license'><a href='" + d((t = e.info, t = null == t || t === !1 ? t : t.licenseUrl, typeof t === h ? t.apply(e) : t)) + "'>" + d((t = e.info, t = null == t || t === !1 ? t : t.license, typeof t === h ? t.apply(e) : t)) + "</a></div>"
            }

            function u(e, t) {
                var r, i = "";
                return i += '\n        , <span style="font-variant: small-caps">api version</span>: ', (r = n.apiVersion) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.apiVersion, r = typeof r === h ? r.apply(e) : r), i += d(r) + "\n        "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var c, p = "",
                h = "function",
                d = this.escapeExpression,
                f = this;
            return p += "<div class='info' id='api_info'>\n  ", c = n["if"].call(t, t.info, {
                hash: {},
                inverse: f.noop,
                fn: f.program(1, o, i),
                data: i
            }), (c || 0 === c) && (p += c), p += "\n</div>\n<div class='container' id='resources_container'>\n    <ul id='resources'>\n    </ul>\n\n    <div class=\"footer\">\n        <br>\n        <br>\n        <h4 style=\"color: #999\">[ <span style=\"font-variant: small-caps\">base url</span>: ", (c = n.basePath) ? c = c.call(t, {
                hash: {},
                data: i
            }) : (c = t.basePath, c = typeof c === h ? c.apply(t) : c), p += d(c) + "\n        ", c = n["if"].call(t, t.apiVersion, {
                hash: {},
                inverse: f.noop,
                fn: f.program(8, u, i),
                data: i
            }), (c || 0 === c) && (p += c), p += "]</h4>\n    </div>\n</div>\n"
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.operation = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n        <h4>Implementation Notes</h4>\n        <p>", (r = n.notes) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.notes, r = typeof r === b ? r.apply(e) : r), (r || 0 === r) && (i += r), i += "</p>\n        "
            }

            function a() {
                return '\n        <div class="auth">\n        <span class="api-ic ic-error"></span>'
            }

            function s(e, t) {
                var r, i = "";
                return i += '\n          <div id="api_information_panel" style="top: 526px; left: 776px; display: none;">\n          ', r = n.each.call(e, e, {
                    hash: {},
                    inverse: w.noop,
                    fn: w.program(6, l, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n          </div>\n        "
            }

            function l(e) {
                var t, n, r = "";
                return r += "\n            <div title='", t = e.description, n = typeof t === b ? t.apply(e) : t, (n || 0 === n) && (r += n), r += "'>" + x((t = e.scope, typeof t === b ? t.apply(e) : t)) + "</div>\n          "
            }

            function u() {
                return "</div>"
            }

            function c() {
                return '\n        <div class=\'access\'>\n          <span class="api-ic ic-off" title="click to authenticate"></span>\n        </div>\n        '
            }

            function p() {
                return '\n          <h4>Response Class</h4>\n          <p><span class="model-signature" /></p>\n          <br/>\n          <div class="response-content-type" />\n        '
            }

            function h() {
                return '\n          <h4>Parameters</h4>\n          <table class=\'fullwidth\'>\n          <thead>\n            <tr>\n            <th style="width: 100px; max-width: 100px">Parameter</th>\n            <th style="width: 310px; max-width: 310px">Value</th>\n            <th style="width: 200px; max-width: 200px">Description</th>\n            <th style="width: 100px; max-width: 100px">Parameter Type</th>\n            <th style="width: 220px; max-width: 230px">Data Type</th>\n            </tr>\n          </thead>\n          <tbody class="operation-params">\n\n          </tbody>\n          </table>\n          '
            }

            function d() {
                return "\n          <div style='margin:0;padding:0;display:inline'></div>\n          <h4>Response Messages</h4>\n          <table class='fullwidth'>\n            <thead>\n            <tr>\n              <th>HTTP Status Code</th>\n              <th>Reason</th>\n              <th>Response Model</th>\n            </tr>\n            </thead>\n            <tbody class=\"operation-status\">\n            \n            </tbody>\n          </table>\n          "
            }

            function f() {
                return "\n          "
            }

            function m() {
                return "\n          <div class='sandbox_header'>\n            <input class='submit' name='commit' type='button' value='Try it out!' />\n            <a href='#' class='response_hider' style='display:none'>Hide Response</a>\n            <span class='response_throbber' style='display:none'></span>\n          </div>\n          "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var g, y, v = "",
                b = "function",
                x = this.escapeExpression,
                w = this,
                S = n.blockHelperMissing;
            return v += "\n  <ul class='operations' >\n    <li class='", (g = n.method) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.method, g = typeof g === b ? g.apply(t) : g), v += x(g) + " operation' id='", (g = n.parentId) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.parentId, g = typeof g === b ? g.apply(t) : g), v += x(g) + "_", (g = n.nickname) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.nickname, g = typeof g === b ? g.apply(t) : g), v += x(g) + "'>\n      <div class='heading'>\n        <h3>\n          <span class='http_method'>\n          <a href='#!/", (g = n.parentId) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.parentId, g = typeof g === b ? g.apply(t) : g), v += x(g) + "/", (g = n.nickname) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.nickname, g = typeof g === b ? g.apply(t) : g), v += x(g) + '\' class="toggleOperation">', (g = n.method) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.method, g = typeof g === b ? g.apply(t) : g), v += x(g) + "</a>\n          </span>\n          <span class='path'>\n          <a href='#!/", (g = n.parentId) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.parentId, g = typeof g === b ? g.apply(t) : g), v += x(g) + "/", (g = n.nickname) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.nickname, g = typeof g === b ? g.apply(t) : g), v += x(g) + '\' class="toggleOperation">', (g = n.path) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.path, g = typeof g === b ? g.apply(t) : g), v += x(g) + "</a>\n          </span>\n        </h3>\n        <ul class='options'>\n          <li>\n          <a href='#!/", (g = n.parentId) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.parentId, g = typeof g === b ? g.apply(t) : g), v += x(g) + "/", (g = n.nickname) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.nickname, g = typeof g === b ? g.apply(t) : g), v += x(g) + '\' class="toggleOperation">', (g = n.summary) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.summary, g = typeof g === b ? g.apply(t) : g), (g || 0 === g) && (v += g), v += "</a>\n          </li>\n        </ul>\n      </div>\n      <div class='content' id='", (g = n.parentId) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.parentId, g = typeof g === b ? g.apply(t) : g), v += x(g) + "_", (g = n.nickname) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.nickname, g = typeof g === b ? g.apply(t) : g), v += x(g) + "_content' style='display:none'>\n        ", g = n["if"].call(t, t.notes, {
                hash: {},
                inverse: w.noop,
                fn: w.program(1, o, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n        ", y = {
                hash: {},
                inverse: w.noop,
                fn: w.program(3, a, i),
                data: i
            }, (g = n.oauth) ? g = g.call(t, y) : (g = t.oauth, g = typeof g === b ? g.apply(t) : g), n.oauth || (g = S.call(t, g, y)), (g || 0 === g) && (v += g), v += "\n        ", g = n.each.call(t, t.oauth, {
                hash: {},
                inverse: w.noop,
                fn: w.program(5, s, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n        ", y = {
                hash: {},
                inverse: w.noop,
                fn: w.program(8, u, i),
                data: i
            }, (g = n.oauth) ? g = g.call(t, y) : (g = t.oauth, g = typeof g === b ? g.apply(t) : g), n.oauth || (g = S.call(t, g, y)), (g || 0 === g) && (v += g), v += "\n        ", y = {
                hash: {},
                inverse: w.noop,
                fn: w.program(10, c, i),
                data: i
            }, (g = n.oauth) ? g = g.call(t, y) : (g = t.oauth, g = typeof g === b ? g.apply(t) : g), n.oauth || (g = S.call(t, g, y)), (g || 0 === g) && (v += g), v += "\n        ", g = n["if"].call(t, t.type, {
                hash: {},
                inverse: w.noop,
                fn: w.program(12, p, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n        <form accept-charset='UTF-8' class='sandbox'>\n          <div style='margin:0;padding:0;display:inline'></div>\n          ", g = n["if"].call(t, t.parameters, {
                hash: {},
                inverse: w.noop,
                fn: w.program(14, h, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n          ", g = n["if"].call(t, t.responseMessages, {
                hash: {},
                inverse: w.noop,
                fn: w.program(16, d, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n          ", g = n["if"].call(t, t.isReadOnly, {
                hash: {},
                inverse: w.program(20, m, i),
                fn: w.program(18, f, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n        </form>\n        <div class='response' style='display:none'>\n          <h4>Request URL</h4>\n          <div class='block request_url'></div>\n          <h4>Response Body</h4>\n          <div class='block response_body'></div>\n          <h4>Response Code</h4>\n          <div class='block response_code'></div>\n          <h4>Response Headers</h4>\n          <div class='block response_headers'></div>\n        </div>\n      </div>\n    </li>\n  </ul>\n"
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.param = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n		", r = n["if"].call(e, e.isFile, {
                    hash: {},
                    inverse: v.program(4, s, t),
                    fn: v.program(2, a, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n	"
            }

            function a(e, t) {
                var r, i = "";
                return i += '\n			<input type="file" name=\'', (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === g ? r.apply(e) : r), i += y(r) + '\'/>\n			<div class="parameter-content-type" />\n		'
            }

            function s(e, t) {
                var r, i = "";
                return i += "\n			", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: v.program(7, u, t),
                    fn: v.program(5, l, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n		"
            }

            function l(e, t) {
                var r, i = "";
                return i += "\n				<textarea class='body-textarea' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === g ? r.apply(e) : r), i += y(r) + "'>", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === g ? r.apply(e) : r), i += y(r) + "</textarea>\n			"
            }

            function u(e, t) {
                var r, i = "";
                return i += "\n				<textarea class='body-textarea' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === g ? r.apply(e) : r), i += y(r) + '\'></textarea>\n				<br />\n				<div class="parameter-content-type" />\n			'
            }

            function c(e, t) {
                var r, i = "";
                return i += "\n		", r = n["if"].call(e, e.isFile, {
                    hash: {},
                    inverse: v.program(10, p, t),
                    fn: v.program(2, a, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n	"
            }

            function p(e, t) {
                var r, i = "";
                return i += "\n			", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: v.program(13, d, t),
                    fn: v.program(11, h, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n		"
            }

            function h(e, t) {
                var r, i = "";
                return i += "\n				<input class='parameter' minlength='0' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === g ? r.apply(e) : r), i += y(r) + "' placeholder='' type='text' value='", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === g ? r.apply(e) : r), i += y(r) + "'/>\n			"
            }

            function d(e, t) {
                var r, i = "";
                return i += "\n				<input class='parameter' minlength='0' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === g ? r.apply(e) : r), i += y(r) + "' placeholder='' type='text' value=''/>\n			"
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var f, m = "",
                g = "function",
                y = this.escapeExpression,
                v = this;
            return m += "<td class='code'>", (f = n.name) ? f = f.call(t, {
                hash: {},
                data: i
            }) : (f = t.name, f = typeof f === g ? f.apply(t) : f), m += y(f) + "</td>\n<td>\n\n	", f = n["if"].call(t, t.isBody, {
                hash: {},
                inverse: v.program(9, c, i),
                fn: v.program(1, o, i),
                data: i
            }), (f || 0 === f) && (m += f), m += "\n\n</td>\n<td>", (f = n.description) ? f = f.call(t, {
                hash: {},
                data: i
            }) : (f = t.description, f = typeof f === g ? f.apply(t) : f), (f || 0 === f) && (m += f), m += "</td>\n<td>", (f = n.paramType) ? f = f.call(t, {
                hash: {},
                data: i
            }) : (f = t.paramType, f = typeof f === g ? f.apply(t) : f), (f || 0 === f) && (m += f), m += '</td>\n<td>\n	<span class="model-signature"></span>\n</td>\n'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.param_list = e(function(e, t, n, r, i) {
            function o() {
                return " multiple='multiple'"
            }

            function a() {
                return "\n    "
            }

            function s(e, t) {
                var r, i = "";
                return i += "\n      ", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: b.program(8, u, t),
                    fn: b.program(6, l, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n    "
            }

            function l() {
                return "\n      "
            }

            function u(e, t) {
                var r, i, o, a = "";
                return a += "\n        ", o = {
                    hash: {},
                    inverse: b.program(11, p, t),
                    fn: b.program(9, c, t),
                    data: t
                }, r = n.isArray || e.isArray, i = r ? r.call(e, e, o) : x.call(e, "isArray", e, o), (i || 0 === i) && (a += i), a += "\n      "
            }

            function c() {
                return "\n        "
            }

            function p() {
                return "\n          <option selected=\"\" value=''></option>\n        "
            }

            function h(e, t) {
                var r, i = "";
                return i += "\n      ", r = n["if"].call(e, e.isDefault, {
                    hash: {},
                    inverse: b.program(16, f, t),
                    fn: b.program(14, d, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n    "
            }

            function d(e, t) {
                var r, i = "";
                return i += '\n        <option selected="" value=\'', (r = n.value) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.value, r = typeof r === w ? r.apply(e) : r), i += S(r) + "'>", (r = n.value) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.value, r = typeof r === w ? r.apply(e) : r), i += S(r) + " (default)</option>\n      "
            }

            function f(e, t) {
                var r, i = "";
                return i += "\n        <option value='", (r = n.value) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.value, r = typeof r === w ? r.apply(e) : r), i += S(r) + "'>", (r = n.value) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.value, r = typeof r === w ? r.apply(e) : r), i += S(r) + "</option>\n      "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var m, g, y, v = "",
                b = this,
                x = n.helperMissing,
                w = "function",
                S = this.escapeExpression;
            return v += "<td class='code'>", (m = n.name) ? m = m.call(t, {
                hash: {},
                data: i
            }) : (m = t.name, m = typeof m === w ? m.apply(t) : m), v += S(m) + "</td>\n<td>\n  <select ", y = {
                hash: {},
                inverse: b.noop,
                fn: b.program(1, o, i),
                data: i
            }, m = n.isArray || t.isArray, g = m ? m.call(t, t, y) : x.call(t, "isArray", t, y), (g || 0 === g) && (v += g), v += " class='parameter' name='", (g = n.name) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.name, g = typeof g === w ? g.apply(t) : g), v += S(g) + "'>\n    ", g = n["if"].call(t, t.required, {
                hash: {},
                inverse: b.program(5, s, i),
                fn: b.program(3, a, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n    ", g = n.each.call(t, (m = t.allowableValues, null == m || m === !1 ? m : m.descriptiveValues), {
                hash: {},
                inverse: b.noop,
                fn: b.program(13, h, i),
                data: i
            }), (g || 0 === g) && (v += g), v += "\n  </select>\n</td>\n<td>", (g = n.description) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.description, g = typeof g === w ? g.apply(t) : g), (g || 0 === g) && (v += g), v += "</td>\n<td>", (g = n.paramType) ? g = g.call(t, {
                hash: {},
                data: i
            }) : (g = t.paramType, g = typeof g === w ? g.apply(t) : g), (g || 0 === g) && (v += g), v += '</td>\n<td><span class="model-signature"></span></td>'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.param_readonly = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n        <textarea class='body-textarea' readonly='readonly' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === p ? r.apply(e) : r), i += h(r) + "'>", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === p ? r.apply(e) : r), i += h(r) + "</textarea>\n    "
            }

            function a(e, t) {
                var r, i = "";
                return i += "\n        ", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: d.program(6, l, t),
                    fn: d.program(4, s, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n    "
            }

            function s(e, t) {
                var r, i = "";
                return i += "\n            ", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === p ? r.apply(e) : r), i += h(r) + "\n        "
            }

            function l() {
                return "\n            (empty)\n        "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var u, c = "",
                p = "function",
                h = this.escapeExpression,
                d = this;
            return c += "<td class='code'>", (u = n.name) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.name, u = typeof u === p ? u.apply(t) : u), c += h(u) + "</td>\n<td>\n    ", u = n["if"].call(t, t.isBody, {
                hash: {},
                inverse: d.program(3, a, i),
                fn: d.program(1, o, i),
                data: i
            }), (u || 0 === u) && (c += u), c += "\n</td>\n<td>", (u = n.description) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.description, u = typeof u === p ? u.apply(t) : u), (u || 0 === u) && (c += u), c += "</td>\n<td>", (u = n.paramType) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.paramType, u = typeof u === p ? u.apply(t) : u), (u || 0 === u) && (c += u), c += '</td>\n<td><span class="model-signature"></span></td>\n'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.param_readonly_required = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n        <textarea class='body-textarea'  readonly='readonly' placeholder='(required)' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === p ? r.apply(e) : r), i += h(r) + "'>", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === p ? r.apply(e) : r), i += h(r) + "</textarea>\n    "
            }

            function a(e, t) {
                var r, i = "";
                return i += "\n        ", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: d.program(6, l, t),
                    fn: d.program(4, s, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n    "
            }

            function s(e, t) {
                var r, i = "";
                return i += "\n            ", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === p ? r.apply(e) : r), i += h(r) + "\n        "
            }

            function l() {
                return "\n            (empty)\n        "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var u, c = "",
                p = "function",
                h = this.escapeExpression,
                d = this;
            return c += "<td class='code required'>", (u = n.name) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.name, u = typeof u === p ? u.apply(t) : u), c += h(u) + "</td>\n<td>\n    ", u = n["if"].call(t, t.isBody, {
                hash: {},
                inverse: d.program(3, a, i),
                fn: d.program(1, o, i),
                data: i
            }), (u || 0 === u) && (c += u), c += "\n</td>\n<td>", (u = n.description) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.description, u = typeof u === p ? u.apply(t) : u), (u || 0 === u) && (c += u), c += "</td>\n<td>", (u = n.paramType) ? u = u.call(t, {
                hash: {},
                data: i
            }) : (u = t.paramType, u = typeof u === p ? u.apply(t) : u), (u || 0 === u) && (c += u), c += '</td>\n<td><span class="model-signature"></span></td>\n'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.param_required = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n		", r = n["if"].call(e, e.isFile, {
                    hash: {},
                    inverse: b.program(4, s, t),
                    fn: b.program(2, a, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n	"
            }

            function a(e, t) {
                var r, i = "";
                return i += '\n			<input type="file" name=\'', (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + "'/>\n		"
            }

            function s(e, t) {
                var r, i = "";
                return i += "\n			", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: b.program(7, u, t),
                    fn: b.program(5, l, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n		"
            }

            function l(e, t) {
                var r, i = "";
                return i += "\n				<textarea class='body-textarea' placeholder='(required)' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + "'>", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === y ? r.apply(e) : r), i += v(r) + "</textarea>\n			"
            }

            function u(e, t) {
                var r, i = "";
                return i += "\n				<textarea class='body-textarea' placeholder='(required)' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + '\'></textarea>\n				<br />\n				<div class="parameter-content-type" />\n			'
            }

            function c(e, t) {
                var r, i = "";
                return i += "\n		", r = n["if"].call(e, e.isFile, {
                    hash: {},
                    inverse: b.program(12, h, t),
                    fn: b.program(10, p, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n	"
            }

            function p(e, t) {
                var r, i = "";
                return i += "\n			<input class='parameter' class='required' type='file' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + "'/>\n		"
            }

            function h(e, t) {
                var r, i = "";
                return i += "\n			", r = n["if"].call(e, e.defaultValue, {
                    hash: {},
                    inverse: b.program(15, f, t),
                    fn: b.program(13, d, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n		"
            }

            function d(e, t) {
                var r, i = "";
                return i += "\n				<input class='parameter required' minlength='1' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + "' placeholder='(required)' type='text' value='", (r = n.defaultValue) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.defaultValue, r = typeof r === y ? r.apply(e) : r), i += v(r) + "'/>\n			"
            }

            function f(e, t) {
                var r, i = "";
                return i += "\n				<input class='parameter required' minlength='1' name='", (r = n.name) ? r = r.call(e, {
                    hash: {},
                    data: t
                }) : (r = e.name, r = typeof r === y ? r.apply(e) : r), i += v(r) + "' placeholder='(required)' type='text' value=''/>\n			"
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var m, g = "",
                y = "function",
                v = this.escapeExpression,
                b = this;
            return g += "<td class='code required'>", (m = n.name) ? m = m.call(t, {
                hash: {},
                data: i
            }) : (m = t.name, m = typeof m === y ? m.apply(t) : m), g += v(m) + "</td>\n<td>\n	", m = n["if"].call(t, t.isBody, {
                hash: {},
                inverse: b.program(9, c, i),
                fn: b.program(1, o, i),
                data: i
            }), (m || 0 === m) && (g += m), g += "\n</td>\n<td>\n	<strong>", (m = n.description) ? m = m.call(t, {
                hash: {},
                data: i
            }) : (m = t.description, m = typeof m === y ? m.apply(t) : m), (m || 0 === m) && (g += m), g += "</strong>\n</td>\n<td>", (m = n.paramType) ? m = m.call(t, {
                hash: {},
                data: i
            }) : (m = t.paramType, m = typeof m === y ? m.apply(t) : m), (m || 0 === m) && (g += m), g += '</td>\n<td><span class="model-signature"></span></td>\n'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.parameter_content_type = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n  ", r = n.each.call(e, e.consumes, {
                    hash: {},
                    inverse: p.noop,
                    fn: p.program(2, a, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n"
            }

            function a(e) {
                var t, n = "";
                return n += '\n  <option value="', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += '">', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += "</option>\n  "
            }

            function s() {
                return '\n  <option value="application/json">application/json</option>\n'
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var l, u = "",
                c = "function",
                p = this;
            return u += '<label for="parameterContentType"></label>\n<select name="parameterContentType">\n', l = n["if"].call(t, t.consumes, {
                hash: {},
                inverse: p.program(4, s, i),
                fn: p.program(1, o, i),
                data: i
            }), (l || 0 === l) && (u += l), u += "\n</select>\n"
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.resource = e(function(e, t, n, r, i) {
            function o() {
                return " : "
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var a, s, l = "",
                u = "function",
                c = this.escapeExpression,
                p = this,
                h = n.blockHelperMissing;
            return l += "<div class='heading'>\n  <h2>\n    <a href='#!/", (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + '\' class="toggleEndpointList" data-id="', (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + '">', (a = n.name) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.name, a = typeof a === u ? a.apply(t) : a), l += c(a) + "</a> ", s = {
                hash: {},
                inverse: p.noop,
                fn: p.program(1, o, i),
                data: i
            }, (a = n.description) ? a = a.call(t, s) : (a = t.description, a = typeof a === u ? a.apply(t) : a), n.description || (a = h.call(t, a, s)), (a || 0 === a) && (l += a), (a = n.description) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.description, a = typeof a === u ? a.apply(t) : a), (a || 0 === a) && (l += a), l += "\n  </h2>\n  <ul class='options'>\n    <li>\n      <a href='#!/", (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + "' id='endpointListTogger_", (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + '\' class="toggleEndpointList" data-id="', (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + '">Show/Hide</a>\n    </li>\n    <li>\n      <a href=\'#\' class="collapseResource" data-id="', (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + '">\n        List Operations\n      </a>\n    </li>\n    <li>\n      <a href=\'#\' class="expandResource" data-id=', (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + ">\n        Expand Operations\n      </a>\n    </li>\n    <li>\n      <a href='", (a = n.url) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.url, a = typeof a === u ? a.apply(t) : a), l += c(a) + "'>Raw</a>\n    </li>\n  </ul>\n</div>\n<ul class='endpoints' id='", (a = n.id) ? a = a.call(t, {
                hash: {},
                data: i
            }) : (a = t.id, a = typeof a === u ? a.apply(t) : a), l += c(a) + "_endpoint_list' style='display:none'>\n\n</ul>\n"
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.response_content_type = e(function(e, t, n, r, i) {
            function o(e, t) {
                var r, i = "";
                return i += "\n  ", r = n.each.call(e, e.produces, {
                    hash: {},
                    inverse: p.noop,
                    fn: p.program(2, a, t),
                    data: t
                }), (r || 0 === r) && (i += r), i += "\n"
            }

            function a(e) {
                var t, n = "";
                return n += '\n  <option value="', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += '">', t = typeof e === c ? e.apply(e) : e, (t || 0 === t) && (n += t), n += "</option>\n  "
            }

            function s() {
                return '\n  <option value="application/json">application/json</option>\n'
            }
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var l, u = "",
                c = "function",
                p = this;
            return u += '<label for="responseContentType"></label>\n<select name="responseContentType">\n', l = n["if"].call(t, t.produces, {
                hash: {},
                inverse: p.program(4, s, i),
                fn: p.program(1, o, i),
                data: i
            }), (l || 0 === l) && (u += l), u += "\n</select>\n"
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.signature = e(function(e, t, n, r, i) {
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var o, a = "",
                s = "function",
                l = this.escapeExpression;
            return a += '<div>\n<ul class="signature-nav">\n    <li><a class="description-link" href="#">Model</a></li>\n    <li><a class="snippet-link" href="#">Model Schema</a></li>\n</ul>\n<div>\n\n<div class="signature-container">\n    <div class="description">\n        ', (o = n.signature) ? o = o.call(t, {
                hash: {},
                data: i
            }) : (o = t.signature, o = typeof o === s ? o.apply(t) : o), (o || 0 === o) && (a += o), a += '\n    </div>\n\n    <div class="snippet">\n        <pre><code>', (o = n.sampleJSON) ? o = o.call(t, {
                hash: {},
                data: i
            }) : (o = t.sampleJSON, o = typeof o === s ? o.apply(t) : o), a += l(o) + '</code></pre>\n        <small class="notice"></small>\n    </div>\n</div>\n\n'
        })
    }(),
    function() {
        var e = Handlebars.template,
            t = Handlebars.templates = Handlebars.templates || {};
        t.status_code = e(function(e, t, n, r, i) {
            this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, e.helpers), i = i || {};
            var o, a = "",
                s = "function",
                l = this.escapeExpression;
            return a += "<td width='15%' class='code'>", (o = n.code) ? o = o.call(t, {
                hash: {},
                data: i
            }) : (o = t.code, o = typeof o === s ? o.apply(t) : o), a += l(o) + "</td>\n<td>", (o = n.message) ? o = o.call(t, {
                hash: {},
                data: i
            }) : (o = t.message, o = typeof o === s ? o.apply(t) : o), (o || 0 === o) && (a += o), a += "</td>\n<td width='50%'><span class=\"model-signature\" /></td>"
        })
    }(),
    function() {
        var e, t, n, r, i, o, a, s, l, u, c, p, h, d, f, m, g, y, v, b, x, w, S = {}.hasOwnProperty,
            k = function(e, t) {
                function n() {
                    this.constructor = e
                }
                for (var r in t) S.call(t, r) && (e[r] = t[r]);
                return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
            };
        c = function(e) {
            function r() {
                return p = r.__super__.constructor.apply(this, arguments)
            }
            return k(r, e), r.prototype.dom_id = "swagger_ui", r.prototype.options = null, r.prototype.api = null, r.prototype.headerView = null, r.prototype.mainView = null, r.prototype.initialize = function(e) {
                var n = this;
                return null == e && (e = {}), null != e.dom_id && (this.dom_id = e.dom_id, delete e.dom_id), null == $("#" + this.dom_id) && $("body").append('<div id="' + this.dom_id + '"></div>'), this.options = e, this.options.success = function() {
                    return n.render()
                }, this.options.progress = function(e) {
                    return n.showMessage(e)
                }, this.options.failure = function(e) {
                    return n.onLoadFailure(e)
                }, this.headerView = new t({
                    el: $("#header")
                }), this.headerView.on("update-swagger-ui", function(e) {
                    return n.updateSwaggerUi(e)
                })
            }, r.prototype.updateSwaggerUi = function(e) {
                return this.options.url = e.url, this.load()
            }, r.prototype.load = function() {
                var e, t;
                return null != (t = this.mainView) && t.clear(), e = this.options.url, 0 !== e.indexOf("http") && (e = this.buildUrl(window.location.href.toString(), e)), this.options.url = e, this.headerView.update(e), this.api = new SwaggerApi(this.options), this.api.build(), this.api
            }, r.prototype.render = function() {
                switch (this.showMessage("Finished Loading Resource Information. Rendering Swagger UI..."), this.mainView = new n({
                    model: this.api,
                    el: $("#" + this.dom_id),
                    swaggerOptions: this.options
                }).render(), this.showMessage(), this.options.docExpansion) {
                    case "full":
                        Docs.expandOperationsForResource("");
                        break;
                    case "list":
                        Docs.collapseOperationsForResource("")
                }
                return this.options.onComplete && this.options.onComplete(this.api, this), setTimeout(function() {
                    return Docs.shebang()
                }, 400)
            }, r.prototype.buildUrl = function(e, t) {
                var n, r;
                return log("base is " + e), 0 === t.indexOf("/") ? (r = e.split("/"), e = r[0] + "//" + r[2], e + t) : (n = e.length, e.indexOf("?") > -1 && (n = Math.min(n, e.indexOf("?"))), e.indexOf("#") > -1 && (n = Math.min(n, e.indexOf("#"))), e = e.substring(0, n), -1 !== e.indexOf("/", e.length - 1) ? e + t : e + "/" + t)
            }, r.prototype.showMessage = function(e) {
                return null == e && (e = ""), $("#message-bar").removeClass("message-fail"), $("#message-bar").addClass("message-success"), $("#message-bar").html(e)
            }, r.prototype.onLoadFailure = function(e) {
                var t;
                return null == e && (e = ""), $("#message-bar").removeClass("message-success"), $("#message-bar").addClass("message-fail"), t = $("#message-bar").html(e), null != this.options.onFailure && this.options.onFailure(e), t
            }, r
        }(Backbone.Router), window.SwaggerUi = c, t = function(e) {
            function t() {
                return h = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.events = {
                "click #show-pet-store-icon": "showPetStore",
                "click #show-wordnik-dev-icon": "showWordnikDev",
                "click #explore": "showCustom",
                "keyup #input_baseUrl": "showCustomOnKeyup",
                "keyup #input_apiKey": "showCustomOnKeyup"
            }, t.prototype.initialize = function() {}, t.prototype.showPetStore = function() {
                return this.trigger("update-swagger-ui", {
                    url: "http://petstore.swagger.wordnik.com/api/api-docs"
                })
            }, t.prototype.showWordnikDev = function() {
                return this.trigger("update-swagger-ui", {
                    url: "http://api.wordnik.com/v4/resources.json"
                })
            }, t.prototype.showCustomOnKeyup = function(e) {
                return 13 === e.keyCode ? this.showCustom() : void 0
            }, t.prototype.showCustom = function(e) {
                return null != e && e.preventDefault(), this.trigger("update-swagger-ui", {
                    url: $("#input_baseUrl").val(),
                    apiKey: $("#input_apiKey").val()
                })
            }, t.prototype.update = function(e, t, n) {
                return null == n && (n = !1), $("#input_baseUrl").val(e), n ? this.trigger("update-swagger-ui", {
                    url: e
                }) : void 0
            }, t
        }(Backbone.View), n = function(e) {
            function t() {
                return f = t.__super__.constructor.apply(this, arguments)
            }
            var n;
            return k(t, e), n = {
                alpha: function(e, t) {
                    return e.path.localeCompare(t.path)
                },
                method: function(e, t) {
                    return e.method.localeCompare(t.method)
                }
            }, t.prototype.initialize = function(e) {
                var t, r, i, o, a, s;
                if (null == e && (e = {}), e.swaggerOptions.sorter) {
                    for (i = e.swaggerOptions.sorter, r = n[i], s = this.model.apisArray, o = 0, a = s.length; a > o; o++) t = s[o], t.operationsArray.sort(r);
                    if ("alpha" === i) return this.model.apisArray.sort(r)
                }
            }, t.prototype.render = function() {
                var e, t, n, r, i, o, a;
                for ($(this.el).html(Handlebars.templates.main(this.model)), r = {}, e = 0, a = this.model.apisArray, i = 0, o = a.length; o > i; i++) {
                    for (n = a[i], t = n.name;
                         "undefined" != typeof r[t];) t = t + "_" + e, e += 1;
                    n.id = t, r[t] = n, this.addResource(n)
                }
                return this
            }, t.prototype.addResource = function(e) {
                var t;
                return t = new a({
                    model: e,
                    tagName: "li",
                    id: "resource_" + e.id,
                    className: "resource",
                    swaggerOptions: this.options.swaggerOptions
                }), $("#resources").append(t.render().el)
            }, t.prototype.clear = function() {
                return $(this.el).html("")
            }, t
        }(Backbone.View), a = function(e) {
            function t() {
                return m = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e, t, n, r, i, o, a;
                for ($(this.el).html(Handlebars.templates.resource(this.model)), n = {}, a = this.model.operationsArray, i = 0, o = a.length; o > i; i++) {
                    for (r = a[i], e = 0, t = r.nickname;
                         "undefined" != typeof n[t];) t = t + "_" + e, e += 1;
                    n[t] = r, r.nickname = t, r.parentId = this.model.id, this.addOperation(r)
                }
                return $(".toggleEndpointList", this.el).click(this.callDocs.bind(this, "toggleEndpointListForResource")), $(".collapseResource", this.el).click(this.callDocs.bind(this, "collapseOperationsForResource")), $(".expandResource", this.el).click(this.callDocs.bind(this, "expandOperationsForResoruce")), this
            }, t.prototype.addOperation = function(e) {
                var t;
                return e.number = this.number, t = new r({
                    model: e,
                    tagName: "li",
                    className: "endpoint",
                    swaggerOptions: this.options.swaggerOptions
                }), $(".endpoints", $(this.el)).append(t.render().el), this.number++
            }, t.prototype.callDocs = function(e, t) {
                return t.preventDefault(), Docs[e](t.currentTarget.getAttribute("data-id"))
            }, t
        }(Backbone.View), r = function(e) {
            function t() {
                return g = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.invocationUrl = null, t.prototype.events = {
                "submit .sandbox": "submitOperation",
                "click .submit": "submitOperation",
                "click .response_hider": "hideResponse",
                "click .toggleOperation": "toggleOperationContent",
                "mouseenter .api-ic": "mouseEnter",
                "mouseout .api-ic": "mouseExit"
            }, t.prototype.initialize = function() {}, t.prototype.mouseEnter = function(e) {
                var t, n, r, i, o, a, s, l, u, c;
                return t = $(e.currentTarget.parentNode).find("#api_information_panel"), u = e.pageX, c = e.pageY, a = $(window).scrollLeft(), s = $(window).scrollTop(), i = a + $(window).width(), o = s + $(window).height(), l = t.width(), n = t.height(), u + l > i && (u = i - l), a > u && (u = a), c + n > o && (c = o - n), s > c && (c = s), r = {}, r.top = c, r.left = u, t.css(r), $(e.currentTarget.parentNode).find("#api_information_panel").show()
            }, t.prototype.mouseExit = function(e) {
                return $(e.currentTarget.parentNode).find("#api_information_panel").hide()
            }, t.prototype.render = function() {
                var e, t, n, r, i, o, a, u, c, p, h, d, f, m, g, y, v, b, x, w, S, k, T;
                if (t = !0, t || (this.model.isReadOnly = !0), this.model.oauth = null, this.model.authorizations) {
                    w = this.model.authorizations;
                    for (n in w)
                        if (h = w[n], "oauth2" === n)
                            for (null === this.model.oauth && (this.model.oauth = {}), void 0 === this.model.oauth.scopes && (this.model.oauth.scopes = []), d = 0, y = h.length; y > d; d++) r = h[d], this.model.oauth.scopes.push(r)
                }
                for ($(this.el).html(Handlebars.templates.operation(this.model)), this.model.responseClassSignature && "string" !== this.model.responseClassSignature ? (u = {
                    sampleJSON: this.model.responseSampleJSON,
                    isParam: !1,
                    signature: this.model.responseClassSignature
                }, a = new l({
                    model: u,
                    tagName: "div"
                }), $(".model-signature", $(this.el)).append(a.render().el)) : $(".model-signature", $(this.el)).html(this.model.type), e = {
                    isParam: !1
                }, e.consumes = this.model.consumes, e.produces = this.model.produces, S = this.model.parameters, f = 0, v = S.length; v > f; f++) i = S[f], p = i.type || i.dataType, "file" === p.toLowerCase() && (e.consumes || (log("set content type "), e.consumes = "multipart/form-data"));
                for (o = new s({
                    model: e
                }), $(".response-content-type", $(this.el)).append(o.render().el), k = this.model.parameters, m = 0, b = k.length; b > m; m++) i = k[m], this.addParameter(i, e.consumes);
                for (T = this.model.responseMessages, g = 0, x = T.length; x > g; g++) c = T[g], this.addStatusCode(c);
                return this
            }, t.prototype.addParameter = function(e, t) {
                var n;
                return e.consumes = t, n = new o({
                    model: e,
                    tagName: "tr",
                    readOnly: this.model.isReadOnly
                }), $(".operation-params", $(this.el)).append(n.render().el)
            }, t.prototype.addStatusCode = function(e) {
                var t;
                return t = new u({
                    model: e,
                    tagName: "tr"
                }), $(".operation-status", $(this.el)).append(t.render().el)
            }, t.prototype.submitOperation = function(e) {
                var t, n, r, i, o, a, s, l, u, c, p, h, d, f, m, g;
                if (null != e && e.preventDefault(), n = $(".sandbox", $(this.el)), t = !0, n.find("input.required").each(function() {
                        var e = this;
                        return $(this).removeClass("error"), "" === jQuery.trim($(this).val()) ? ($(this).addClass("error"), $(this).wiggle({
                            callback: function() {
                                return $(e).focus()
                            }
                        }), t = !1) : void 0
                    }), t) {
                    for (i = {}, a = {
                        parent: this
                    }, r = !1, f = n.find("input"), l = 0, p = f.length; p > l; l++) o = f[l], null != o.value && jQuery.trim(o.value).length > 0 && (i[o.name] = o.value), "file" === o.type && (r = !0);
                    for (m = n.find("textarea"), u = 0, h = m.length; h > u; u++) o = m[u], null != o.value && jQuery.trim(o.value).length > 0 && (i.body = o.value);
                    for (g = n.find("select"), c = 0, d = g.length; d > c; c++) o = g[c], s = this.getSelectedValue(o), null != s && jQuery.trim(s).length > 0 && (i[o.name] = s);
                    return a.responseContentType = $("div select[name=responseContentType]", $(this.el)).val(), a.requestContentType = $("div select[name=parameterContentType]", $(this.el)).val(), $(".response_throbber", $(this.el)).show(), r ? this.handleFileUpload(i, n) : this.model["do"](i, a, this.showCompleteStatus, this.showErrorStatus, this)
                }
            }, t.prototype.success = function(e, t) {
                return t.showCompleteStatus(e)
            }, t.prototype.handleFileUpload = function(e, t) {
                var n, r, i, o, a, s, l, u, c, p, h, d, f, m, g, y, v, b, x, w = this;
                for (y = t.serializeArray(), u = 0, d = y.length; d > u; u++) o = y[u], null != o.value && jQuery.trim(o.value).length > 0 && (e[o.name] = o.value);
                for (n = new FormData, l = 0, v = this.model.parameters, c = 0, f = v.length; f > c; c++) s = v[c], "form" === s.paramType && "file" !== s.type.toLowerCase() && void 0 !== e[s.name] && n.append(s.name, e[s.name]);
                for (i = {}, b = this.model.parameters, p = 0, m = b.length; m > p; p++) s = b[p], "header" === s.paramType && (i[s.name] = e[s.name]);
                for (log(i), x = t.find('input[type~="file"]'), h = 0, g = x.length; g > h; h++) r = x[h], "undefined" != typeof r.files[0] && (n.append($(r).attr("name"), r.files[0]), l += 1);
                return this.invocationUrl = this.model.supportHeaderParams() ? (i = this.model.getHeaderParams(e), this.model.urlify(e, !1)) : this.model.urlify(e, !0), $(".request_url", $(this.el)).html("<pre></pre>"), $(".request_url pre", $(this.el)).text(this.invocationUrl), a = {
                    type: this.model.method,
                    url: this.invocationUrl,
                    headers: i,
                    data: n,
                    dataType: "json",
                    contentType: !1,
                    processData: !1,
                    error: function(e) {
                        return w.showErrorStatus(w.wrap(e), w)
                    },
                    success: function(e) {
                        return w.showResponse(e, w)
                    },
                    complete: function(e) {
                        return w.showCompleteStatus(w.wrap(e), w)
                    }
                }, window.authorizations && window.authorizations.apply(a), 0 === l && a.data.append("fake", "true"), jQuery.ajax(a), !1
            }, t.prototype.wrap = function(e) {
                var t, n, r, i, o, a, s;
                for (r = {}, n = e.getAllResponseHeaders().split("\r"), a = 0, s = n.length; s > a; a++) i = n[a], t = i.split(":"), void 0 !== t[0] && void 0 !== t[1] && (r[t[0].trim()] = t[1].trim());
                return o = {}, o.content = {}, o.content.data = e.responseText, o.headers = r, o.request = {}, o.request.url = this.invocationUrl, o.status = e.status, o
            }, t.prototype.getSelectedValue = function(e) {
                var t, n, r, i, o;
                if (e.multiple) {
                    for (n = [], o = e.options, r = 0, i = o.length; i > r; r++) t = o[r], t.selected && n.push(t.value);
                    return n.length > 0 ? n.join(",") : null
                }
                return e.value
            }, t.prototype.hideResponse = function(e) {
                return null != e && e.preventDefault(), $(".response", $(this.el)).slideUp(), $(".response_hider", $(this.el)).fadeOut()
            }, t.prototype.showResponse = function(e) {
                var t;
                return t = JSON.stringify(e, null, "	").replace(/\n/g, "<br>"), $(".response_body", $(this.el)).html(escape(t))
            }, t.prototype.showErrorStatus = function(e, t) {
                return t.showStatus(e)
            }, t.prototype.showCompleteStatus = function(e, t) {
                return t.showStatus(e)
            }, t.prototype.formatXml = function(e) {
                var t, n, r, i, o, a, s, l, u, c, p, h, d;
                for (l = /(>)(<)(\/*)/g, c = /[ ]*(.*)[ ]+\n/g, t = /(<.+>)(.+\n)/g, e = e.replace(l, "$1\n$2$3").replace(c, "$1\n").replace(t, "$1\n$2"), s = 0, n = "", o = e.split("\n"), r = 0, i = "other", u = {
                    "single->single": 0,
                    "single->closing": -1,
                    "single->opening": 0,
                    "single->other": 0,
                    "closing->single": 0,
                    "closing->closing": -1,
                    "closing->opening": 0,
                    "closing->other": 0,
                    "opening->single": 1,
                    "opening->closing": 0,
                    "opening->opening": 1,
                    "opening->other": 1,
                    "other->single": 0,
                    "other->closing": -1,
                    "other->opening": 0,
                    "other->other": 0
                }, p = function(e) {
                    var t, o, a, s, l, c, p;
                    return c = {
                        single: Boolean(e.match(/<.+\/>/)),
                        closing: Boolean(e.match(/<\/.+>/)),
                        opening: Boolean(e.match(/<[^!?].*>/))
                    }, l = function() {
                        var e;
                        e = [];
                        for (a in c) p = c[a], p && e.push(a);
                        return e
                    }()[0], l = void 0 === l ? "other" : l, t = i + "->" + l, i = l, s = "", r += u[t], s = function() {
                        var e, t, n;
                        for (n = [], o = e = 0, t = r; t >= 0 ? t > e : e > t; o = t >= 0 ? ++e : --e) n.push("  ");
                        return n
                    }().join(""), "opening->closing" === t ? n = n.substr(0, n.length - 1) + e + "\n" : n += s + e + "\n"
                }, h = 0, d = o.length; d > h; h++) a = o[h], p(a);
                return n
            }, t.prototype.showStatus = function(e) {
                var t, n, r, i, o, a, s, l, u;
                return void 0 === e.content ? (n = e.data, u = e.url) : (n = e.content.data, u = e.request.url), i = e.headers, r = i && i["Content-Type"] ? i["Content-Type"].split(";")[0].trim() : null, n ? "application/json" === r || /\+json$/.test(r) ? (t = $("<code />").text(JSON.stringify(JSON.parse(n), null, "  ")), a = $('<pre class="json" />').append(t)) : "application/xml" === r || /\+xml$/.test(r) ? (t = $("<code />").text(this.formatXml(n)), a = $('<pre class="xml" />').append(t)) : "text/html" === r ? (t = $("<code />").html(n), a = $('<pre class="xml" />').append(t)) : /^image\//.test(r) ? a = $("<img>").attr("src", u) : (t = $("<code />").text(n), a = $('<pre class="json" />').append(t)) : (t = $("<code />").text("no content"), a = $('<pre class="json" />').append(t)), s = a, $(".request_url", $(this.el)).html("<pre></pre>"), $(".request_url pre", $(this.el)).text(u), $(".response_code", $(this.el)).html("<pre>" + e.status + "</pre>"), $(".response_body", $(this.el)).html(s), $(".response_headers", $(this.el)).html("<pre>" + _.escape(JSON.stringify(e.headers, null, "  ")).replace(/\n/g, "<br>") + "</pre>"), $(".response", $(this.el)).slideDown(), $(".response_hider", $(this.el)).show(), $(".response_throbber", $(this.el)).hide(), l = $(".response_body", $(this.el))[0], o = this.options.swaggerOptions, o.highlightSizeThreshold && e.data.length > o.highlightSizeThreshold ? l : hljs.highlightBlock(l)
            }, t.prototype.toggleOperationContent = function() {
                var e;
                return e = $("#" + Docs.escapeResourceName(this.model.parentId) + "_" + this.model.nickname + "_content"), e.is(":visible") ? Docs.collapseOperation(e) : Docs.expandOperation(e)
            }, t
        }(Backbone.View), u = function(e) {
            function t() {
                return y = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e, t, n;
                return n = this.template(), $(this.el).html(n(this.model)), swaggerUi.api.models.hasOwnProperty(this.model.responseModel) ? (e = {
                    sampleJSON: JSON.stringify(swaggerUi.api.models[this.model.responseModel].createJSONSample(), null, 2),
                    isParam: !1,
                    signature: swaggerUi.api.models[this.model.responseModel].getMockSignature()
                }, t = new l({
                    model: e,
                    tagName: "div"
                }), $(".model-signature", this.$el).append(t.render().el)) : $(".model-signature", this.$el).html(""), this
            }, t.prototype.template = function() {
                return Handlebars.templates.status_code
            }, t
        }(Backbone.View), o = function(e) {
            function t() {
                return v = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {
                return Handlebars.registerHelper("isArray", function(e, t) {
                    return "array" === e.type.toLowerCase() || e.allowMultiple ? t.fn(this) : t.inverse(this)
                })
            }, t.prototype.render = function() {
                var e, t, n, r, o, a, u, c;
                return c = this.model.type || this.model.dataType, "body" === this.model.paramType && (this.model.isBody = !0), "file" === c.toLowerCase() && (this.model.isFile = !0), u = this.template(), $(this.el).html(u(this.model)), o = {
                    sampleJSON: this.model.sampleJSON,
                    isParam: !0,
                    signature: this.model.signature
                }, this.model.sampleJSON ? (a = new l({
                    model: o,
                    tagName: "div"
                }), $(".model-signature", $(this.el)).append(a.render().el)) : $(".model-signature", $(this.el)).html(this.model.signature), t = !1, this.model.isBody && (t = !0), e = {
                    isParam: t
                }, e.consumes = this.model.consumes, t ? (n = new i({
                    model: e
                }), $(".parameter-content-type", $(this.el)).append(n.render().el)) : (r = new s({
                    model: e
                }), $(".response-content-type", $(this.el)).append(r.render().el)), this
            }, t.prototype.template = function() {
                return this.model.isList ? Handlebars.templates.param_list : this.options.readOnly ? this.model.required ? Handlebars.templates.param_readonly_required : Handlebars.templates.param_readonly : this.model.required ? Handlebars.templates.param_required : Handlebars.templates.param
            }, t
        }(Backbone.View), l = function(e) {
            function t() {
                return b = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.events = {
                "click a.description-link": "switchToDescription",
                "click a.snippet-link": "switchToSnippet",
                "mousedown .snippet": "snippetToTextArea"
            }, t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e;
                return e = this.template(), $(this.el).html(e(this.model)), this.switchToSnippet(), this.isParam = this.model.isParam, this.isParam && $(".notice", $(this.el)).text("Click to set as parameter value"), this
            }, t.prototype.template = function() {
                return Handlebars.templates.signature
            }, t.prototype.switchToDescription = function(e) {
                return null != e && e.preventDefault(), $(".snippet", $(this.el)).hide(), $(".description", $(this.el)).show(), $(".description-link", $(this.el)).addClass("selected"), $(".snippet-link", $(this.el)).removeClass("selected")
            }, t.prototype.switchToSnippet = function(e) {
                return null != e && e.preventDefault(), $(".description", $(this.el)).hide(), $(".snippet", $(this.el)).show(), $(".snippet-link", $(this.el)).addClass("selected"), $(".description-link", $(this.el)).removeClass("selected")
            }, t.prototype.snippetToTextArea = function(e) {
                var t;
                return this.isParam && (null != e && e.preventDefault(), t = $("textarea", $(this.el.parentNode.parentNode.parentNode)), "" === $.trim(t.val())) ? t.val(this.model.sampleJSON) : void 0
            }, t
        }(Backbone.View), e = function(e) {
            function t() {
                return x = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e;
                return e = this.template(), $(this.el).html(e(this.model)), $("label[for=contentType]", $(this.el)).text("Response Content Type"), this
            }, t.prototype.template = function() {
                return Handlebars.templates.content_type
            }, t
        }(Backbone.View), s = function(e) {
            function t() {
                return w = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e;
                return e = this.template(), $(this.el).html(e(this.model)), $("label[for=responseContentType]", $(this.el)).text("Response Content Type"), this
            }, t.prototype.template = function() {
                return Handlebars.templates.response_content_type
            }, t
        }(Backbone.View), i = function(e) {
            function t() {
                return d = t.__super__.constructor.apply(this, arguments)
            }
            return k(t, e), t.prototype.initialize = function() {}, t.prototype.render = function() {
                var e;
                return e = this.template(), $(this.el).html(e(this.model)), $("label[for=parameterContentType]", $(this.el)).text("Parameter content type:"), this
            }, t.prototype.template = function() {
                return Handlebars.templates.parameter_content_type
            }, t
        }(Backbone.View)
    }.call(this);
var hljs = new function() {
    function e(e) {
        return e.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
    }

    function t(e) {
        for (var t = e.firstChild; t; t = t.nextSibling) {
            if ("CODE" == t.nodeName) return t;
            if (3 != t.nodeType || !t.nodeValue.match(/\s+/)) break
        }
    }

    function n(e, t) {
        return Array.prototype.map.call(e.childNodes, function(e) {
            return 3 == e.nodeType ? t ? e.nodeValue.replace(/\n/g, "") : e.nodeValue : "BR" == e.nodeName ? "\n" : n(e, t)
        }).join("")
    }

    function r(e) {
        var t = (e.className + " " + e.parentNode.className).split(/\s+/);
        t = t.map(function(e) {
            return e.replace(/^language-/, "")
        });
        for (var n = 0; n < t.length; n++)
            if (d[t[n]] || "no-highlight" == t[n]) return t[n]
    }

    function i(e) {
        var t = [];
        return function n(e, r) {
            for (var i = e.firstChild; i; i = i.nextSibling) 3 == i.nodeType ? r += i.nodeValue.length : "BR" == i.nodeName ? r += 1 : 1 == i.nodeType && (t.push({
                event: "start",
                offset: r,
                node: i
            }), r = n(i, r), t.push({
                event: "stop",
                offset: r,
                node: i
            }));
            return r
        }(e, 0), t
    }

    function o(t, n, r) {
        function i() {
            return t.length && n.length ? t[0].offset != n[0].offset ? t[0].offset < n[0].offset ? t : n : "start" == n[0].event ? t : n : t.length ? t : n
        }

        function o(t) {
            function n(t) {
                return " " + t.nodeName + '="' + e(t.value) + '"'
            }
            return "<" + t.nodeName + Array.prototype.map.call(t.attributes, n).join("") + ">"
        }
        for (var a = 0, s = "", l = []; t.length || n.length;) {
            var u = i().splice(0, 1)[0];
            if (s += e(r.substr(a, u.offset - a)), a = u.offset, "start" == u.event) s += o(u.node), l.push(u.node);
            else if ("stop" == u.event) {
                var c, p = l.length;
                do p--, c = l[p], s += "</" + c.nodeName.toLowerCase() + ">"; while (c != u.node);
                for (l.splice(p, 1); p < l.length;) s += o(l[p]), p++
            }
        }
        return s + e(r.substr(a))
    }

    function a(e) {
        function t(t, n) {
            return RegExp(t, "m" + (e.cI ? "i" : "") + (n ? "g" : ""))
        }

        function n(e, r) {
            function i(e, t) {
                t.split(" ").forEach(function(t) {
                    var n = t.split("|");
                    a[n[0]] = [e, n[1] ? Number(n[1]) : 1], o.push(n[0])
                })
            }
            if (!e.compiled) {
                e.compiled = !0;
                var o = [];
                if (e.k) {
                    var a = {};
                    if (e.lR = t(e.l || hljs.IR, !0), "string" == typeof e.k) i("keyword", e.k);
                    else
                        for (var s in e.k) e.k.hasOwnProperty(s) && i(s, e.k[s]);
                    e.k = a
                }
                r && (e.bWK && (e.b = "\\b(" + o.join("|") + ")\\s"), e.bR = t(e.b ? e.b : "\\B|\\b"), e.e || e.eW || (e.e = "\\B|\\b"), e.e && (e.eR = t(e.e)), e.tE = e.e || "", e.eW && r.tE && (e.tE += (e.e ? "|" : "") + r.tE)), e.i && (e.iR = t(e.i)), void 0 === e.r && (e.r = 1), e.c || (e.c = []);
                for (var l = 0; l < e.c.length; l++) "self" == e.c[l] && (e.c[l] = e), n(e.c[l], e);
                e.starts && n(e.starts, r);
                for (var u = [], l = 0; l < e.c.length; l++) u.push(e.c[l].b);
                e.tE && u.push(e.tE), e.i && u.push(e.i), e.t = u.length ? t(u.join("|"), !0) : {
                    exec: function() {
                        return null
                    }
                }
            }
        }
        n(e)
    }

    function s(t, n) {
        function r(e, t) {
            for (var n = 0; n < t.c.length; n++) {
                var r = t.c[n].bR.exec(e);
                if (r && 0 == r.index) return t.c[n]
            }
        }

        function i(e, t) {
            return e.e && e.eR.test(t) ? e : e.eW ? i(e.parent, t) : void 0
        }

        function o(e, t) {
            return t.i && t.iR.test(e)
        }

        function u(e, t) {
            var n = g.cI ? t[0].toLowerCase() : t[0];
            return e.k.hasOwnProperty(n) && e.k[n]
        }

        function c() {
            var t = e(v);
            if (!y.k) return t;
            var n = "",
                r = 0;
            y.lR.lastIndex = 0;
            for (var i = y.lR.exec(t); i;) {
                n += t.substr(r, i.index - r);
                var o = u(y, i);
                o ? (x += o[1], n += '<span class="' + o[0] + '">' + i[0] + "</span>") : n += i[0], r = y.lR.lastIndex, i = y.lR.exec(t)
            }
            return n + t.substr(r)
        }

        function p() {
            if (y.sL && !d[y.sL]) return e(v);
            var t = y.sL ? s(y.sL, v) : l(v);
            return y.r > 0 && (x += t.keyword_count, b += t.r), '<span class="' + t.language + '">' + t.value + "</span>"
        }

        function h() {
            return void 0 !== y.sL ? p() : c()
        }

        function f(t, n) {
            var r = t.cN ? '<span class="' + t.cN + '">' : "";
            t.rB ? (w += r, v = "") : t.eB ? (w += e(n) + r, v = "") : (w += r, v = n), y = Object.create(t, {
                parent: {
                    value: y
                }
            }), b += t.r
        }

        function m(t, n) {
            if (v += t, void 0 === n) return w += h(), 0;
            var a = r(n, y);
            if (a) return w += h(), f(a, n), a.rB ? 0 : n.length;
            var s = i(y, n);
            if (s) {
                s.rE || s.eE || (v += n), w += h();
                do y.cN && (w += "</span>"), y = y.parent; while (y != s.parent);
                return s.eE && (w += e(n)), v = "", s.starts && f(s.starts, ""), s.rE ? 0 : n.length
            }
            if (o(n, y)) throw "Illegal";
            return v += n, n.length || 1
        }
        var g = d[t];
        a(g);
        var y = g,
            v = "",
            b = 0,
            x = 0,
            w = "";
        try {
            for (var S, k, T = 0;;) {
                if (y.t.lastIndex = T, S = y.t.exec(n), !S) break;
                k = m(n.substr(T, S.index - T), S[0]), T = S.index + k
            }
            return m(n.substr(T)), {
                r: b,
                keyword_count: x,
                value: w,
                language: t
            }
        } catch (E) {
            if ("Illegal" == E) return {
                r: 0,
                keyword_count: 0,
                value: e(n)
            };
            throw E
        }
    }

    function l(t) {
        var n = {
                keyword_count: 0,
                r: 0,
                value: e(t)
            },
            r = n;
        for (var i in d)
            if (d.hasOwnProperty(i)) {
                var o = s(i, t);
                o.language = i, o.keyword_count + o.r > r.keyword_count + r.r && (r = o), o.keyword_count + o.r > n.keyword_count + n.r && (r = n, n = o)
            }
        return r.language && (n.second_best = r), n
    }

    function u(e, t, n) {
        return t && (e = e.replace(/^((<[^>]+>|\t)+)/gm, function(e, n) {
            return n.replace(/\t/g, t)
        })), n && (e = e.replace(/\n/g, "<br>")), e
    }

    function c(e, t, a) {
        var c = n(e, a),
            p = r(e);
        if ("no-highlight" != p) {
            var h = p ? s(p, c) : l(c);
            p = h.language;
            var d = i(e);
            if (d.length) {
                var f = document.createElement("pre");
                f.innerHTML = h.value, h.value = o(d, i(f), c)
            }
            h.value = u(h.value, t, a);
            var m = e.className;
            m.match("(\\s|^)(language-)?" + p + "(\\s|$)") || (m = m ? m + " " + p : p), e.innerHTML = h.value, e.className = m, e.result = {
                language: p,
                kw: h.keyword_count,
                re: h.r
            }, h.second_best && (e.second_best = {
                language: h.second_best.language,
                kw: h.second_best.keyword_count,
                re: h.second_best.r
            })
        }
    }

    function p() {
        p.called || (p.called = !0, Array.prototype.map.call(document.getElementsByTagName("pre"), t).filter(Boolean).forEach(function(e) {
            c(e, hljs.tabReplace)
        }))
    }

    function h() {
        window.addEventListener("DOMContentLoaded", p, !1), window.addEventListener("load", p, !1)
    }
    var d = {};
    this.LANGUAGES = d, this.highlight = s, this.highlightAuto = l, this.fixMarkup = u, this.highlightBlock = c, this.initHighlighting = p, this.initHighlightingOnLoad = h, this.IR = "[a-zA-Z][a-zA-Z0-9_]*", this.UIR = "[a-zA-Z_][a-zA-Z0-9_]*", this.NR = "\\b\\d+(\\.\\d+)?", this.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", this.BNR = "\\b(0b[01]+)", this.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", this.BE = {
        b: "\\\\[\\s\\S]",
        r: 0
    }, this.ASM = {
        cN: "string",
        b: "'",
        e: "'",
        i: "\\n",
        c: [this.BE],
        r: 0
    }, this.QSM = {
        cN: "string",
        b: '"',
        e: '"',
        i: "\\n",
        c: [this.BE],
        r: 0
    }, this.CLCM = {
        cN: "comment",
        b: "//",
        e: "$"
    }, this.CBLCLM = {
        cN: "comment",
        b: "/\\*",
        e: "\\*/"
    }, this.HCM = {
        cN: "comment",
        b: "#",
        e: "$"
    }, this.NM = {
        cN: "number",
        b: this.NR,
        r: 0
    }, this.CNM = {
        cN: "number",
        b: this.CNR,
        r: 0
    }, this.BNM = {
        cN: "number",
        b: this.BNR,
        r: 0
    }, this.inherit = function(e, t) {
        var n = {};
        for (var r in e) n[r] = e[r];
        if (t)
            for (var r in t) n[r] = t[r];
        return n
    }
};
hljs.LANGUAGES.xml = function() {
    var e = "[A-Za-z0-9\\._:-]+",
        t = {
            eW: !0,
            c: [{
                cN: "attribute",
                b: e,
                r: 0
            }, {
                b: '="',
                rB: !0,
                e: '"',
                c: [{
                    cN: "value",
                    b: '"',
                    eW: !0
                }]
            }, {
                b: "='",
                rB: !0,
                e: "'",
                c: [{
                    cN: "value",
                    b: "'",
                    eW: !0
                }]
            }, {
                b: "=",
                c: [{
                    cN: "value",
                    b: "[^\\s/>]+"
                }]
            }]
        };
    return {
        cI: !0,
        c: [{
            cN: "pi",
            b: "<\\?",
            e: "\\?>",
            r: 10
        }, {
            cN: "doctype",
            b: "<!DOCTYPE",
            e: ">",
            r: 10,
            c: [{
                b: "\\[",
                e: "\\]"
            }]
        }, {
            cN: "comment",
            b: "<!--",
            e: "-->",
            r: 10
        }, {
            cN: "cdata",
            b: "<\\!\\[CDATA\\[",
            e: "\\]\\]>",
            r: 10
        }, {
            cN: "tag",
            b: "<style(?=\\s|>|$)",
            e: ">",
            k: {
                title: "style"
            },
            c: [t],
            starts: {
                e: "</style>",
                rE: !0,
                sL: "css"
            }
        }, {
            cN: "tag",
            b: "<script(?=\\s|>|$)",
            e: ">",
            k: {
                title: "script"
            },
            c: [t],
            starts: {
                e: "</script>",
                rE: !0,
                sL: "javascript"
            }
        }, {
            b: "<%",
            e: "%>",
            sL: "vbscript"
        }, {
            cN: "tag",
            b: "</?",
            e: "/?>",
            c: [{
                cN: "title",
                b: "[^ />]+"
            }, t]
        }]
    }
}(hljs), hljs.LANGUAGES.json = function(e) {
    var t = {
            literal: "true false null"
        },
        n = [e.QSM, e.CNM],
        r = {
            cN: "value",
            e: ",",
            eW: !0,
            eE: !0,
            c: n,
            k: t
        },
        i = {
            b: "{",
            e: "}",
            c: [{
                cN: "attribute",
                b: '\\s*"',
                e: '"\\s*:\\s*',
                eB: !0,
                eE: !0,
                c: [e.BE],
                i: "\\n",
                starts: r
            }],
            i: "\\S"
        },
        o = {
            b: "\\[",
            e: "\\]",
            c: [e.inherit(r, {
                cN: null
            })],
            i: "\\S"
        };
    return n.splice(n.length, 0, i, o), {
        c: n,
        k: t,
        i: "\\S"
    }
}(hljs),
    function(e, t) {
        function n(e) {
            var t = ft[e] = {};
            return Y.each(e.split(tt), function(e, n) {
                t[n] = !0
            }), t
        }

        function r(e, n, r) {
            if (r === t && 1 === e.nodeType) {
                var i = "data-" + n.replace(gt, "-$1").toLowerCase();
                if (r = e.getAttribute(i), "string" == typeof r) {
                    try {
                        r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : mt.test(r) ? Y.parseJSON(r) : r
                    } catch (o) {}
                    Y.data(e, n, r)
                } else r = t
            }
            return r
        }

        function i(e) {
            var t;
            for (t in e)
                if (("data" !== t || !Y.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
            return !0
        }

        function o() {
            return !1
        }

        function a() {
            return !0
        }

        function s(e) {
            return !e || !e.parentNode || 11 === e.parentNode.nodeType
        }

        function l(e, t) {
            do e = e[t]; while (e && 1 !== e.nodeType);
            return e
        }

        function u(e, t, n) {
            if (t = t || 0, Y.isFunction(t)) return Y.grep(e, function(e, r) {
                var i = !!t.call(e, r, e);
                return i === n
            });
            if (t.nodeType) return Y.grep(e, function(e) {
                return e === t === n
            });
            if ("string" == typeof t) {
                var r = Y.grep(e, function(e) {
                    return 1 === e.nodeType
                });
                if (Rt.test(t)) return Y.filter(t, r, !n);
                t = Y.filter(t, r)
            }
            return Y.grep(e, function(e) {
                return Y.inArray(e, t) >= 0 === n
            })
        }

        function c(e) {
            var t = $t.split("|"),
                n = e.createDocumentFragment();
            if (n.createElement)
                for (; t.length;) n.createElement(t.pop());
            return n
        }

        function p(e, t) {
            return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
        }

        function h(e, t) {
            if (1 === t.nodeType && Y.hasData(e)) {
                var n, r, i, o = Y._data(e),
                    a = Y._data(t, o),
                    s = o.events;
                if (s) {
                    delete a.handle, a.events = {};
                    for (n in s)
                        for (r = 0, i = s[n].length; i > r; r++) Y.event.add(t, n, s[n][r])
                }
                a.data && (a.data = Y.extend({}, a.data))
            }
        }

        function d(e, t) {
            var n;
            1 === t.nodeType && (t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), n = t.nodeName.toLowerCase(), "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), Y.support.html5Clone && e.innerHTML && !Y.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Qt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.selected = e.defaultSelected : "input" === n || "textarea" === n ? t.defaultValue = e.defaultValue : "script" === n && t.text !== e.text && (t.text = e.text), t.removeAttribute(Y.expando))
        }

        function f(e) {
            return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName("*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll("*") : []
        }

        function m(e) {
            Qt.test(e.type) && (e.defaultChecked = e.checked)
        }

        function g(e, t) {
            if (t in e) return t;
            for (var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = yn.length; i--;)
                if (t = yn[i] + n, t in e) return t;
            return r
        }

        function y(e, t) {
            return e = t || e, "none" === Y.css(e, "display") || !Y.contains(e.ownerDocument, e)
        }

        function v(e, t) {
            for (var n, r, i = [], o = 0, a = e.length; a > o; o++) n = e[o], n.style && (i[o] = Y._data(n, "olddisplay"), t ? (!i[o] && "none" === n.style.display && (n.style.display = ""), "" === n.style.display && y(n) && (i[o] = Y._data(n, "olddisplay", S(n.nodeName)))) : (r = nn(n, "display"), !i[o] && "none" !== r && Y._data(n, "olddisplay", r)));
            for (o = 0; a > o; o++) n = e[o], n.style && (t && "none" !== n.style.display && "" !== n.style.display || (n.style.display = t ? i[o] || "" : "none"));
            return e
        }

        function b(e, t, n) {
            var r = cn.exec(t);
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
        }

        function x(e, t, n, r) {
            for (var i = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, o = 0; 4 > i; i += 2) "margin" === n && (o += Y.css(e, n + gn[i], !0)), r ? ("content" === n && (o -= parseFloat(nn(e, "padding" + gn[i])) || 0), "margin" !== n && (o -= parseFloat(nn(e, "border" + gn[i] + "Width")) || 0)) : (o += parseFloat(nn(e, "padding" + gn[i])) || 0, "padding" !== n && (o += parseFloat(nn(e, "border" + gn[i] + "Width")) || 0));
            return o
        }

        function w(e, t, n) {
            var r = "width" === t ? e.offsetWidth : e.offsetHeight,
                i = !0,
                o = Y.support.boxSizing && "border-box" === Y.css(e, "boxSizing");
            if (0 >= r) {
                if (r = nn(e, t), (0 > r || null == r) && (r = e.style[t]), pn.test(r)) return r;
                i = o && (Y.support.boxSizingReliable || r === e.style[t]), r = parseFloat(r) || 0
            }
            return r + x(e, t, n || (o ? "border" : "content"), i) + "px"
        }

        function S(e) {
            if (dn[e]) return dn[e];
            var t = Y("<" + e + ">").appendTo(I.body),
                n = t.css("display");
            return t.remove(), ("none" === n || "" === n) && (rn = I.body.appendChild(rn || Y.extend(I.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            })), on && rn.createElement || (on = (rn.contentWindow || rn.contentDocument).document, on.write("<!doctype html><html><body>"), on.close()), t = on.body.appendChild(on.createElement(e)), n = nn(t, "display"), I.body.removeChild(rn)), dn[e] = n, n
        }

        function k(e, t, n, r) {
            var i;
            if (Y.isArray(t)) Y.each(t, function(t, i) {
                n || xn.test(e) ? r(e, i) : k(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
            });
            else if (n || "object" !== Y.type(t)) r(e, t);
            else
                for (i in t) k(e + "[" + i + "]", t[i], n, r)
        }

        function T(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var r, i, o, a = t.toLowerCase().split(tt),
                    s = 0,
                    l = a.length;
                if (Y.isFunction(n))
                    for (; l > s; s++) r = a[s], o = /^\+/.test(r), o && (r = r.substr(1) || "*"), i = e[r] = e[r] || [], i[o ? "unshift" : "push"](n)
            }
        }

        function E(e, n, r, i, o, a) {
            o = o || n.dataTypes[0], a = a || {}, a[o] = !0;
            for (var s, l = e[o], u = 0, c = l ? l.length : 0, p = e === Rn; c > u && (p || !s); u++) s = l[u](n, r, i), "string" == typeof s && (!p || a[s] ? s = t : (n.dataTypes.unshift(s), s = E(e, n, r, i, s, a)));
            return (p || !s) && !a["*"] && (s = E(e, n, r, i, "*", a)), s
        }

        function C(e, n) {
            var r, i, o = Y.ajaxSettings.flatOptions || {};
            for (r in n) n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
            i && Y.extend(!0, e, i)
        }

        function N(e, n, r) {
            var i, o, a, s, l = e.contents,
                u = e.dataTypes,
                c = e.responseFields;
            for (o in c) o in r && (n[c[o]] = r[o]);
            for (;
                "*" === u[0];) u.shift(), i === t && (i = e.mimeType || n.getResponseHeader("content-type"));
            if (i)
                for (o in l)
                    if (l[o] && l[o].test(i)) {
                        u.unshift(o);
                        break
                    }
            if (u[0] in r) a = u[0];
            else {
                for (o in r) {
                    if (!u[0] || e.converters[o + " " + u[0]]) {
                        a = o;
                        break
                    }
                    s || (s = o)
                }
                a = a || s
            }
            return a ? (a !== u[0] && u.unshift(a), r[a]) : void 0
        }

        function _(e, t) {
            var n, r, i, o, a = e.dataTypes.slice(),
                s = a[0],
                l = {},
                u = 0;
            if (e.dataFilter && (t = e.dataFilter(t, e.dataType)), a[1])
                for (n in e.converters) l[n.toLowerCase()] = e.converters[n];
            for (; i = a[++u];)
                if ("*" !== i) {
                    if ("*" !== s && s !== i) {
                        if (n = l[s + " " + i] || l["* " + i], !n)
                            for (r in l)
                                if (o = r.split(" "), o[1] === i && (n = l[s + " " + o[0]] || l["* " + o[0]])) {
                                    n === !0 ? n = l[r] : l[r] !== !0 && (i = o[0], a.splice(u--, 0, i));
                                    break
                                }
                        if (n !== !0)
                            if (n && e["throws"]) t = n(t);
                            else try {
                                t = n(t)
                            } catch (c) {
                                return {
                                    state: "parsererror",
                                    error: n ? c : "No conversion from " + s + " to " + i
                                }
                            }
                    }
                    s = i
                }
            return {
                state: "success",
                data: t
            }
        }

        function A() {
            try {
                return new e.XMLHttpRequest
            } catch (t) {}
        }

        function j() {
            try {
                return new e.ActiveXObject("Microsoft.XMLHTTP")
            } catch (t) {}
        }

        function H() {
            return setTimeout(function() {
                Xn = t
            }, 0), Xn = Y.now()
        }

        function L(e, t) {
            Y.each(t, function(t, n) {
                for (var r = (Zn[t] || []).concat(Zn["*"]), i = 0, o = r.length; o > i; i++)
                    if (r[i].call(e, t, n)) return
            })
        }

        function D(e, t, n) {
            var r, i = 0,
                o = Yn.length,
                a = Y.Deferred().always(function() {
                    delete s.elem
                }),
                s = function() {
                    for (var t = Xn || H(), n = Math.max(0, l.startTime + l.duration - t), r = 1 - (n / l.duration || 0), i = 0, o = l.tweens.length; o > i; i++) l.tweens[i].run(r);
                    return a.notifyWith(e, [l, r, n]), 1 > r && o ? n : (a.resolveWith(e, [l]), !1)
                },
                l = a.promise({
                    elem: e,
                    props: Y.extend({}, t),
                    opts: Y.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: Xn || H(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var r = Y.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                        return l.tweens.push(r), r
                    },
                    stop: function(t) {
                        for (var n = 0, r = t ? l.tweens.length : 0; r > n; n++) l.tweens[n].run(1);
                        return t ? a.resolveWith(e, [l, t]) : a.rejectWith(e, [l, t]), this
                    }
                }),
                u = l.props;
            for (O(u, l.opts.specialEasing); o > i; i++)
                if (r = Yn[i].call(l, e, u, l.opts)) return r;
            return L(l, u), Y.isFunction(l.opts.start) && l.opts.start.call(e, l), Y.fx.timer(Y.extend(s, {
                anim: l,
                queue: l.opts.queue,
                elem: e
            })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
        }

        function O(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (r = Y.camelCase(n), i = t[r], o = e[n], Y.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = Y.cssHooks[r], a && "expand" in a) {
                    o = a.expand(o), delete e[r];
                    for (n in o) n in e || (e[n] = o[n], t[n] = i)
                } else t[r] = i
        }

        function q(e, t, n) {
            var r, i, o, a, s, l, u, c, p = this,
                h = e.style,
                d = {},
                f = [],
                m = e.nodeType && y(e);
            n.queue || (u = Y._queueHooks(e, "fx"), null == u.unqueued && (u.unqueued = 0, c = u.empty.fire, u.empty.fire = function() {
                u.unqueued || c()
            }), u.unqueued++, p.always(function() {
                p.always(function() {
                    u.unqueued--, Y.queue(e, "fx").length || u.empty.fire()
                })
            })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY], "inline" === Y.css(e, "display") && "none" === Y.css(e, "float") && (Y.support.inlineBlockNeedsLayout && "inline" !== S(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), n.overflow && (h.overflow = "hidden", Y.support.shrinkWrapBlocks || p.done(function() {
                h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
            }));
            for (r in t)
                if (o = t[r], Qn.exec(o)) {
                    if (delete t[r], o === (m ? "hide" : "show")) continue;
                    f.push(r)
                }
            if (a = f.length)
                for (s = Y._data(e, "fxshow") || Y._data(e, "fxshow", {}), m ? Y(e).show() : p.done(function() {
                    Y(e).hide()
                }), p.done(function() {
                    var t;
                    Y.removeData(e, "fxshow", !0);
                    for (t in d) Y.style(e, t, d[t])
                }), r = 0; a > r; r++) i = f[r], l = p.createTween(i, m ? s[i] : 0), d[i] = s[i] || Y.style(e, i), i in s || (s[i] = l.start, m && (l.end = l.start, l.start = "width" === i || "height" === i ? 1 : 0))
        }

        function R(e, t, n, r, i) {
            return new R.prototype.init(e, t, n, r, i)
        }

        function P(e, t) {
            for (var n, r = {
                height: e
            }, i = 0; 4 > i; i += 2 - t) n = gn[i], r["margin" + n] = r["padding" + n] = e;
            return t && (r.opacity = r.width = e), r
        }

        function M(e) {
            return Y.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
        }
        var $, F, I = e.document,
            B = e.location,
            z = e.navigator,
            W = e.jQuery,
            V = e.$,
            U = Array.prototype.push,
            X = Array.prototype.slice,
            J = Array.prototype.indexOf,
            Q = Object.prototype.toString,
            G = Object.prototype.hasOwnProperty,
            K = String.prototype.trim,
            Y = function(e, t) {
                return new Y.fn.init(e, t, $)
            },
            Z = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
            et = /\S/,
            tt = /\s+/,
            nt = et.test("\xa0") ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g,
            rt = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
            it = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            ot = /^[\],:{}\s]*$/,
            at = /(?:^|:|,)(?:\s*\[)+/g,
            st = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            lt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
            ut = /^-ms-/,
            ct = /-([\da-z])/gi,
            pt = function(e, t) {
                return (t + "").toUpperCase()
            },
            ht = function() {
                I.addEventListener ? (I.removeEventListener("DOMContentLoaded", ht, !1), Y.ready()) : "complete" === I.readyState && (I.detachEvent("onreadystatechange", ht), Y.ready())
            },
            dt = {};
        Y.fn = Y.prototype = {
            constructor: Y,
            init: function(e, n, r) {
                var i, o, a;
                if (!e) return this;
                if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
                if ("string" == typeof e) {
                    if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : rt.exec(e), i && (i[1] || !n)) {
                        if (i[1]) return n = n instanceof Y ? n[0] : n, a = n && n.nodeType ? n.ownerDocument || n : I, e = Y.parseHTML(i[1], a, !0), it.test(i[1]) && Y.isPlainObject(n) && this.attr.call(e, n, !0), Y.merge(this, e);
                        if (o = I.getElementById(i[2]), o && o.parentNode) {
                            if (o.id !== i[2]) return r.find(e);
                            this.length = 1, this[0] = o
                        }
                        return this.context = I, this.selector = e, this
                    }
                    return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
                }
                return Y.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), Y.makeArray(e, this))
            },
            selector: "",
            jquery: "1.8.0",
            length: 0,
            size: function() {
                return this.length
            },
            toArray: function() {
                return X.call(this)
            },
            get: function(e) {
                return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
            },
            pushStack: function(e, t, n) {
                var r = Y.merge(this.constructor(), e);
                return r.prevObject = this, r.context = this.context, "find" === t ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"), r
            },
            each: function(e, t) {
                return Y.each(this, e, t)
            },
            ready: function(e) {
                return Y.ready.promise().done(e), this
            },
            eq: function(e) {
                return e = +e, -1 === e ? this.slice(e) : this.slice(e, e + 1)
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            slice: function() {
                return this.pushStack(X.apply(this, arguments), "slice", X.call(arguments).join(","))
            },
            map: function(e) {
                return this.pushStack(Y.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: U,
            sort: [].sort,
            splice: [].splice
        }, Y.fn.init.prototype = Y.fn, Y.extend = Y.fn.extend = function() {
            var e, n, r, i, o, a, s = arguments[0] || {},
                l = 1,
                u = arguments.length,
                c = !1;
            for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" != typeof s && !Y.isFunction(s) && (s = {}), u === l && (s = this, --l); u > l; l++)
                if (null != (e = arguments[l]))
                    for (n in e) r = s[n], i = e[n], s !== i && (c && i && (Y.isPlainObject(i) || (o = Y.isArray(i))) ? (o ? (o = !1, a = r && Y.isArray(r) ? r : []) : a = r && Y.isPlainObject(r) ? r : {}, s[n] = Y.extend(c, a, i)) : i !== t && (s[n] = i));
            return s
        }, Y.extend({
            noConflict: function(t) {
                return e.$ === Y && (e.$ = V), t && e.jQuery === Y && (e.jQuery = W), Y
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? Y.readyWait++ : Y.ready(!0)
            },
            ready: function(e) {
                if (e === !0 ? !--Y.readyWait : !Y.isReady) {
                    if (!I.body) return setTimeout(Y.ready, 1);
                    Y.isReady = !0, e !== !0 && --Y.readyWait > 0 || (F.resolveWith(I, [Y]), Y.fn.trigger && Y(I).trigger("ready").off("ready"))
                }
            },
            isFunction: function(e) {
                return "function" === Y.type(e)
            },
            isArray: Array.isArray || function(e) {
                return "array" === Y.type(e)
            },
            isWindow: function(e) {
                return null != e && e == e.window
            },
            isNumeric: function(e) {
                return !isNaN(parseFloat(e)) && isFinite(e)
            },
            type: function(e) {
                return null == e ? String(e) : dt[Q.call(e)] || "object"
            },
            isPlainObject: function(e) {
                if (!e || "object" !== Y.type(e) || e.nodeType || Y.isWindow(e)) return !1;
                try {
                    if (e.constructor && !G.call(e, "constructor") && !G.call(e.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                var r;
                for (r in e);
                return r === t || G.call(e, r)
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0
            },
            error: function(e) {
                throw new Error(e)
            },
            parseHTML: function(e, t, n) {
                var r;
                return e && "string" == typeof e ? ("boolean" == typeof t && (n = t, t = 0), t = t || I, (r = it.exec(e)) ? [t.createElement(r[1])] : (r = Y.buildFragment([e], t, n ? null : []), Y.merge([], (r.cacheable ? Y.clone(r.fragment) : r.fragment).childNodes))) : null
            },
            parseJSON: function(t) {
                return t && "string" == typeof t ? (t = Y.trim(t), e.JSON && e.JSON.parse ? e.JSON.parse(t) : ot.test(t.replace(st, "@").replace(lt, "]").replace(at, "")) ? new Function("return " + t)() : void Y.error("Invalid JSON: " + t)) : null
            },
            parseXML: function(n) {
                var r, i;
                if (!n || "string" != typeof n) return null;
                try {
                    e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
                } catch (o) {
                    r = t
                }
                return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && Y.error("Invalid XML: " + n), r
            },
            noop: function() {},
            globalEval: function(t) {
                t && et.test(t) && (e.execScript || function(t) {
                    e.eval.call(e, t)
                })(t)
            },
            camelCase: function(e) {
                return e.replace(ut, "ms-").replace(ct, pt)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toUpperCase() === t.toUpperCase()
            },
            each: function(e, n, r) {
                var i, o = 0,
                    a = e.length,
                    s = a === t || Y.isFunction(e);
                if (r)
                    if (s) {
                        for (i in e)
                            if (n.apply(e[i], r) === !1) break
                    } else
                        for (; a > o && n.apply(e[o++], r) !== !1;);
                else if (s) {
                    for (i in e)
                        if (n.call(e[i], i, e[i]) === !1) break
                } else
                    for (; a > o && n.call(e[o], o, e[o++]) !== !1;);
                return e
            },
            trim: K ? function(e) {
                return null == e ? "" : K.call(e)
            } : function(e) {
                return null == e ? "" : e.toString().replace(nt, "")
            },
            makeArray: function(e, t) {
                var n, r = t || [];
                return null != e && (n = Y.type(e), null == e.length || "string" === n || "function" === n || "regexp" === n || Y.isWindow(e) ? U.call(r, e) : Y.merge(r, e)), r
            },
            inArray: function(e, t, n) {
                var r;
                if (t) {
                    if (J) return J.call(t, e, n);
                    for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)
                        if (n in t && t[n] === e) return n
                }
                return -1
            },
            merge: function(e, n) {
                var r = n.length,
                    i = e.length,
                    o = 0;
                if ("number" == typeof r)
                    for (; r > o; o++) e[i++] = n[o];
                else
                    for (; n[o] !== t;) e[i++] = n[o++];
                return e.length = i, e
            },
            grep: function(e, t, n) {
                var r, i = [],
                    o = 0,
                    a = e.length;
                for (n = !!n; a > o; o++) r = !!t(e[o], o), n !== r && i.push(e[o]);
                return i
            },
            map: function(e, n, r) {
                var i, o, a = [],
                    s = 0,
                    l = e.length,
                    u = e instanceof Y || l !== t && "number" == typeof l && (l > 0 && e[0] && e[l - 1] || 0 === l || Y.isArray(e));
                if (u)
                    for (; l > s; s++) i = n(e[s], s, r), null != i && (a[a.length] = i);
                else
                    for (o in e) i = n(e[o], o, r), null != i && (a[a.length] = i);
                return a.concat.apply([], a)
            },
            guid: 1,
            proxy: function(e, n) {
                var r, i, o;
                return "string" == typeof n && (r = e[n], n = e, e = r), Y.isFunction(e) ? (i = X.call(arguments, 2), o = function() {
                    return e.apply(n, i.concat(X.call(arguments)))
                }, o.guid = e.guid = e.guid || o.guid || Y.guid++, o) : t
            },
            access: function(e, n, r, i, o, a, s) {
                var l, u = null == r,
                    c = 0,
                    p = e.length;
                if (r && "object" == typeof r) {
                    for (c in r) Y.access(e, n, c, r[c], 1, a, i);
                    o = 1
                } else if (i !== t) {
                    if (l = s === t && Y.isFunction(i), u && (l ? (l = n, n = function(e, t, n) {
                            return l.call(Y(e), n)
                        }) : (n.call(e, i), n = null)), n)
                        for (; p > c; c++) n(e[c], r, l ? i.call(e[c], c, n(e[c], r)) : i, s);
                    o = 1
                }
                return o ? e : u ? n.call(e) : p ? n(e[0], r) : a
            },
            now: function() {
                return (new Date).getTime()
            }
        }), Y.ready.promise = function(t) {
            if (!F)
                if (F = Y.Deferred(), "complete" === I.readyState || "loading" !== I.readyState && I.addEventListener) setTimeout(Y.ready, 1);
                else if (I.addEventListener) I.addEventListener("DOMContentLoaded", ht, !1), e.addEventListener("load", Y.ready, !1);
                else {
                    I.attachEvent("onreadystatechange", ht), e.attachEvent("onload", Y.ready);
                    var n = !1;
                    try {
                        n = null == e.frameElement && I.documentElement
                    } catch (r) {}
                    n && n.doScroll && function i() {
                        if (!Y.isReady) {
                            try {
                                n.doScroll("left")
                            } catch (e) {
                                return setTimeout(i, 50)
                            }
                            Y.ready()
                        }
                    }()
                }
            return F.promise(t)
        }, Y.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
            dt["[object " + t + "]"] = t.toLowerCase()
        }), $ = Y(I);
        var ft = {};
        Y.Callbacks = function(e) {
            e = "string" == typeof e ? ft[e] || n(e) : Y.extend({}, e);
            var r, i, o, a, s, l, u = [],
                c = !e.once && [],
                p = function(t) {
                    for (r = e.memory && t, i = !0, l = a || 0, a = 0, s = u.length, o = !0; u && s > l; l++)
                        if (u[l].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                            r = !1;
                            break
                        }
                    o = !1, u && (c ? c.length && p(c.shift()) : r ? u = [] : h.disable())
                },
                h = {
                    add: function() {
                        if (u) {
                            var t = u.length;
                            ! function n(t) {
                                Y.each(t, function(t, r) {
                                    !Y.isFunction(r) || e.unique && h.has(r) ? r && r.length && n(r) : u.push(r)
                                })
                            }(arguments), o ? s = u.length : r && (a = t, p(r))
                        }
                        return this
                    },
                    remove: function() {
                        return u && Y.each(arguments, function(e, t) {
                            for (var n;
                                 (n = Y.inArray(t, u, n)) > -1;) u.splice(n, 1), o && (s >= n && s--, l >= n && l--)
                        }), this
                    },
                    has: function(e) {
                        return Y.inArray(e, u) > -1
                    },
                    empty: function() {
                        return u = [], this
                    },
                    disable: function() {
                        return u = c = r = t, this
                    },
                    disabled: function() {
                        return !u
                    },
                    lock: function() {
                        return c = t, r || h.disable(), this
                    },
                    locked: function() {
                        return !c
                    },
                    fireWith: function(e, t) {
                        return t = t || [], t = [e, t.slice ? t.slice() : t], u && (!i || c) && (o ? c.push(t) : p(t)), this
                    },
                    fire: function() {
                        return h.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i
                    }
                };
            return h
        }, Y.extend({
            Deferred: function(e) {
                var t = [
                        ["resolve", "done", Y.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", Y.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", Y.Callbacks("memory")]
                    ],
                    n = "pending",
                    r = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return i.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e = arguments;
                            return Y.Deferred(function(n) {
                                Y.each(t, function(t, r) {
                                    var o = r[0],
                                        a = e[t];
                                    i[r[1]](Y.isFunction(a) ? function() {
                                        var e = a.apply(this, arguments);
                                        e && Y.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o + "With"](this === i ? n : this, [e])
                                    } : n[o])
                                }), e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return "object" == typeof e ? Y.extend(e, r) : r
                        }
                    },
                    i = {};
                return r.pipe = r.then, Y.each(t, function(e, o) {
                    var a = o[2],
                        s = o[3];
                    r[o[1]] = a.add, s && a.add(function() {
                        n = s
                    }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = a.fire, i[o[0] + "With"] = a.fireWith
                }), r.promise(i), e && e.call(i, i), i
            },
            when: function(e) {
                var t, n, r, i = 0,
                    o = X.call(arguments),
                    a = o.length,
                    s = 1 !== a || e && Y.isFunction(e.promise) ? a : 0,
                    l = 1 === s ? e : Y.Deferred(),
                    u = function(e, n, r) {
                        return function(i) {
                            n[e] = this, r[e] = arguments.length > 1 ? X.call(arguments) : i, r === t ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                        }
                    };
                if (a > 1)
                    for (t = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && Y.isFunction(o[i].promise) ? o[i].promise().done(u(i, r, o)).fail(l.reject).progress(u(i, n, t)) : --s;
                return s || l.resolveWith(r, o), l.promise()
            }
        }), Y.support = function() {
            var t, n, r, i, o, a, s, l, u, c, p, h = I.createElement("div");
            if (h.setAttribute("className", "t"), h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = h.getElementsByTagName("*"), r = h.getElementsByTagName("a")[0], r.style.cssText = "top:1px;float:left;opacity:.5", !n || !n.length || !r) return {};
            i = I.createElement("select"), o = i.appendChild(I.createElement("option")), a = h.getElementsByTagName("input")[0], t = {
                leadingWhitespace: 3 === h.firstChild.nodeType,
                tbody: !h.getElementsByTagName("tbody").length,
                htmlSerialize: !!h.getElementsByTagName("link").length,
                style: /top/.test(r.getAttribute("style")),
                hrefNormalized: "/a" === r.getAttribute("href"),
                opacity: /^0.5/.test(r.style.opacity),
                cssFloat: !!r.style.cssFloat,
                checkOn: "on" === a.value,
                optSelected: o.selected,
                getSetAttribute: "t" !== h.className,
                enctype: !!I.createElement("form").enctype,
                html5Clone: "<:nav></:nav>" !== I.createElement("nav").cloneNode(!0).outerHTML,
                boxModel: "CSS1Compat" === I.compatMode,
                submitBubbles: !0,
                changeBubbles: !0,
                focusinBubbles: !1,
                deleteExpando: !0,
                noCloneEvent: !0,
                inlineBlockNeedsLayout: !1,
                shrinkWrapBlocks: !1,
                reliableMarginRight: !0,
                boxSizingReliable: !0,
                pixelPosition: !1
            }, a.checked = !0, t.noCloneChecked = a.cloneNode(!0).checked, i.disabled = !0, t.optDisabled = !o.disabled;
            try {
                delete h.test
            } catch (d) {
                t.deleteExpando = !1
            }
            if (!h.addEventListener && h.attachEvent && h.fireEvent && (h.attachEvent("onclick", p = function() {
                    t.noCloneEvent = !1
                }), h.cloneNode(!0).fireEvent("onclick"), h.detachEvent("onclick", p)), a = I.createElement("input"), a.value = "t", a.setAttribute("type", "radio"), t.radioValue = "t" === a.value, a.setAttribute("checked", "checked"), a.setAttribute("name", "t"), h.appendChild(a), s = I.createDocumentFragment(), s.appendChild(h.lastChild), t.checkClone = s.cloneNode(!0).cloneNode(!0).lastChild.checked, t.appendChecked = a.checked, s.removeChild(a), s.appendChild(h), h.attachEvent)
                for (u in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) l = "on" + u, c = l in h, c || (h.setAttribute(l, "return;"), c = "function" == typeof h[l]), t[u + "Bubbles"] = c;
            return Y(function() {
                var n, r, i, o, a = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                    s = I.getElementsByTagName("body")[0];
                s && (n = I.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", s.insertBefore(n, s.firstChild), r = I.createElement("div"), n.appendChild(r), r.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = r.getElementsByTagName("td"), i[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === i[0].offsetHeight, i[0].style.display = "", i[1].style.display = "none", t.reliableHiddenOffsets = c && 0 === i[0].offsetHeight, r.innerHTML = "", r.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", t.boxSizing = 4 === r.offsetWidth, t.doesNotIncludeMarginInBodyOffset = 1 !== s.offsetTop, e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(r, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(r, null) || {
                    width: "4px"
                }).width, o = I.createElement("div"), o.style.cssText = r.style.cssText = a, o.style.marginRight = o.style.width = "0", r.style.width = "1px", r.appendChild(o), t.reliableMarginRight = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight)), "undefined" != typeof r.style.zoom && (r.innerHTML = "", r.style.cssText = a + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === r.offsetWidth, r.style.display = "block", r.style.overflow = "visible", r.innerHTML = "<div></div>", r.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== r.offsetWidth, n.style.zoom = 1), s.removeChild(n), n = r = i = o = null)
            }), s.removeChild(h), n = r = i = o = a = s = h = null, t
        }();
        var mt = /^(?:\{.*\}|\[.*\])$/,
            gt = /([A-Z])/g;
        Y.extend({
            cache: {},
            deletedIds: [],
            uuid: 0,
            expando: "jQuery" + (Y.fn.jquery + Math.random()).replace(/\D/g, ""),
            noData: {
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                applet: !0
            },
            hasData: function(e) {
                return e = e.nodeType ? Y.cache[e[Y.expando]] : e[Y.expando], !!e && !i(e)
            },
            data: function(e, n, r, i) {
                if (Y.acceptData(e)) {
                    var o, a, s = Y.expando,
                        l = "string" == typeof n,
                        u = e.nodeType,
                        c = u ? Y.cache : e,
                        p = u ? e[s] : e[s] && s;
                    if (p && c[p] && (i || c[p].data) || !l || r !== t) return p || (u ? e[s] = p = Y.deletedIds.pop() || ++Y.uuid : p = s), c[p] || (c[p] = {}, u || (c[p].toJSON = Y.noop)), ("object" == typeof n || "function" == typeof n) && (i ? c[p] = Y.extend(c[p], n) : c[p].data = Y.extend(c[p].data, n)), o = c[p], i || (o.data || (o.data = {}), o = o.data), r !== t && (o[Y.camelCase(n)] = r), l ? (a = o[n], null == a && (a = o[Y.camelCase(n)])) : a = o, a
                }
            },
            removeData: function(e, t, n) {
                if (Y.acceptData(e)) {
                    var r, o, a, s = e.nodeType,
                        l = s ? Y.cache : e,
                        u = s ? e[Y.expando] : Y.expando;
                    if (l[u]) {
                        if (t && (r = n ? l[u] : l[u].data)) {
                            Y.isArray(t) || (t in r ? t = [t] : (t = Y.camelCase(t), t = t in r ? [t] : t.split(" ")));
                            for (o = 0, a = t.length; a > o; o++) delete r[t[o]];
                            if (!(n ? i : Y.isEmptyObject)(r)) return
                        }(n || (delete l[u].data, i(l[u]))) && (s ? Y.cleanData([e], !0) : Y.support.deleteExpando || l != l.window ? delete l[u] : l[u] = null)
                    }
                }
            },
            _data: function(e, t, n) {
                return Y.data(e, t, n, !0)
            },
            acceptData: function(e) {
                var t = e.nodeName && Y.noData[e.nodeName.toLowerCase()];
                return !t || t !== !0 && e.getAttribute("classid") === t
            }
        }), Y.fn.extend({
            data: function(e, n) {
                var i, o, a, s, l, u = this[0],
                    c = 0,
                    p = null;
                if (e === t) {
                    if (this.length && (p = Y.data(u), 1 === u.nodeType && !Y._data(u, "parsedAttrs"))) {
                        for (a = u.attributes, l = a.length; l > c; c++) s = a[c].name, 0 === s.indexOf("data-") && (s = Y.camelCase(s.substring(5)), r(u, s, p[s]));
                        Y._data(u, "parsedAttrs", !0)
                    }
                    return p
                }
                return "object" == typeof e ? this.each(function() {
                    Y.data(this, e)
                }) : (i = e.split(".", 2), i[1] = i[1] ? "." + i[1] : "", o = i[1] + "!", Y.access(this, function(n) {
                    return n === t ? (p = this.triggerHandler("getData" + o, [i[0]]), p === t && u && (p = Y.data(u, e), p = r(u, e, p)), p === t && i[1] ? this.data(i[0]) : p) : (i[1] = n, void this.each(function() {
                        var t = Y(this);
                        t.triggerHandler("setData" + o, i), Y.data(this, e, n), t.triggerHandler("changeData" + o, i)
                    }))
                }, null, n, arguments.length > 1, null, !1))
            },
            removeData: function(e) {
                return this.each(function() {
                    Y.removeData(this, e)
                })
            }
        }), Y.extend({
            queue: function(e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue", r = Y._data(e, t), n && (!r || Y.isArray(n) ? r = Y._data(e, t, Y.makeArray(n)) : r.push(n)), r || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = Y.queue(e, t),
                    r = n.shift(),
                    i = Y._queueHooks(e, t),
                    o = function() {
                        Y.dequeue(e, t)
                    };
                "inprogress" === r && (r = n.shift()), r && ("fx" === t && n.unshift("inprogress"), delete i.stop, r.call(e, o, i)), !n.length && i && i.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return Y._data(e, n) || Y._data(e, n, {
                    empty: Y.Callbacks("once memory").add(function() {
                        Y.removeData(e, t + "queue", !0), Y.removeData(e, n, !0)
                    })
                })
            }
        }), Y.fn.extend({
            queue: function(e, n) {
                var r = 2;
                return "string" != typeof e && (n = e, e = "fx", r--), arguments.length < r ? Y.queue(this[0], e) : n === t ? this : this.each(function() {
                    var t = Y.queue(this, e, n);
                    Y._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && Y.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    Y.dequeue(this, e)
                })
            },
            delay: function(e, t) {
                return e = Y.fx ? Y.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(r)
                    }
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, n) {
                var r, i = 1,
                    o = Y.Deferred(),
                    a = this,
                    s = this.length,
                    l = function() {
                        --i || o.resolveWith(a, [a])
                    };
                for ("string" != typeof e && (n = e, e = t), e = e || "fx"; s--;)(r = Y._data(a[s], e + "queueHooks")) && r.empty && (i++, r.empty.add(l));
                return l(), o.promise(n)
            }
        });
        var yt, vt, bt, xt = /[\t\r\n]/g,
            wt = /\r/g,
            St = /^(?:button|input)$/i,
            kt = /^(?:button|input|object|select|textarea)$/i,
            Tt = /^a(?:rea|)$/i,
            Et = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
            Ct = Y.support.getSetAttribute;
        Y.fn.extend({
            attr: function(e, t) {
                return Y.access(this, Y.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    Y.removeAttr(this, e)
                })
            },
            prop: function(e, t) {
                return Y.access(this, Y.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return e = Y.propFix[e] || e, this.each(function() {
                    try {
                        this[e] = t, delete this[e]
                    } catch (n) {}
                })
            },
            addClass: function(e) {
                var t, n, r, i, o, a, s;
                if (Y.isFunction(e)) return this.each(function(t) {
                    Y(this).addClass(e.call(this, t, this.className))
                });
                if (e && "string" == typeof e)
                    for (t = e.split(tt), n = 0, r = this.length; r > n; n++)
                        if (i = this[n], 1 === i.nodeType)
                            if (i.className || 1 !== t.length) {
                                for (o = " " + i.className + " ", a = 0, s = t.length; s > a; a++) ~o.indexOf(" " + t[a] + " ") || (o += t[a] + " ");
                                i.className = Y.trim(o)
                            } else i.className = e;
                return this
            },
            removeClass: function(e) {
                var n, r, i, o, a, s, l;
                if (Y.isFunction(e)) return this.each(function(t) {
                    Y(this).removeClass(e.call(this, t, this.className))
                });
                if (e && "string" == typeof e || e === t)
                    for (n = (e || "").split(tt), s = 0, l = this.length; l > s; s++)
                        if (i = this[s], 1 === i.nodeType && i.className) {
                            for (r = (" " + i.className + " ").replace(xt, " "), o = 0, a = n.length; a > o; o++)
                                for (; r.indexOf(" " + n[o] + " ") > -1;) r = r.replace(" " + n[o] + " ", " ");
                            i.className = e ? Y.trim(r) : ""
                        }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e,
                    r = "boolean" == typeof t;
                return this.each(Y.isFunction(e) ? function(n) {
                    Y(this).toggleClass(e.call(this, n, this.className, t), t)
                } : function() {
                    if ("string" === n)
                        for (var i, o = 0, a = Y(this), s = t, l = e.split(tt); i = l[o++];) s = r ? s : !a.hasClass(i), a[s ? "addClass" : "removeClass"](i);
                    else("undefined" === n || "boolean" === n) && (this.className && Y._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : Y._data(this, "__className__") || "")
                })
            },
            hasClass: function(e) {
                for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
                    if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(xt, " ").indexOf(t) > -1) return !0;
                return !1
            },
            val: function(e) {
                var n, r, i, o = this[0]; {
                    if (arguments.length) return i = Y.isFunction(e), this.each(function(r) {
                        var o, a = Y(this);
                        1 === this.nodeType && (o = i ? e.call(this, r, a.val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : Y.isArray(o) && (o = Y.map(o, function(e) {
                            return null == e ? "" : e + ""
                        })), n = Y.valHooks[this.type] || Y.valHooks[this.nodeName.toLowerCase()], n && "set" in n && n.set(this, o, "value") !== t || (this.value = o))
                    });
                    if (o) return n = Y.valHooks[o.type] || Y.valHooks[o.nodeName.toLowerCase()], n && "get" in n && (r = n.get(o, "value")) !== t ? r : (r = o.value, "string" == typeof r ? r.replace(wt, "") : null == r ? "" : r)
                }
            }
        }), Y.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = e.attributes.value;
                        return !t || t.specified ? e.value : e.text
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, r, i, o = e.selectedIndex,
                            a = [],
                            s = e.options,
                            l = "select-one" === e.type;
                        if (0 > o) return null;
                        for (n = l ? o : 0, r = l ? o + 1 : s.length; r > n; n++)
                            if (i = s[n], !(!i.selected || (Y.support.optDisabled ? i.disabled : null !== i.getAttribute("disabled")) || i.parentNode.disabled && Y.nodeName(i.parentNode, "optgroup"))) {
                                if (t = Y(i).val(), l) return t;
                                a.push(t)
                            }
                        return l && !a.length && s.length ? Y(s[o]).val() : a
                    },
                    set: function(e, t) {
                        var n = Y.makeArray(t);
                        return Y(e).find("option").each(function() {
                            this.selected = Y.inArray(Y(this).val(), n) >= 0
                        }), n.length || (e.selectedIndex = -1), n
                    }
                }
            },
            attrFn: {},
            attr: function(e, n, r, i) {
                var o, a, s, l = e.nodeType;
                if (e && 3 !== l && 8 !== l && 2 !== l) return i && Y.isFunction(Y.fn[n]) ? Y(e)[n](r) : "undefined" == typeof e.getAttribute ? Y.prop(e, n, r) : (s = 1 !== l || !Y.isXMLDoc(e), s && (n = n.toLowerCase(), a = Y.attrHooks[n] || (Et.test(n) ? vt : yt)), r !== t ? null === r ? void Y.removeAttr(e, n) : a && "set" in a && s && (o = a.set(e, r, n)) !== t ? o : (e.setAttribute(n, "" + r), r) : a && "get" in a && s && null !== (o = a.get(e, n)) ? o : (o = e.getAttribute(n), null === o ? t : o))
            },
            removeAttr: function(e, t) {
                var n, r, i, o, a = 0;
                if (t && 1 === e.nodeType)
                    for (r = t.split(tt); a < r.length; a++) i = r[a], i && (n = Y.propFix[i] || i, o = Et.test(i), o || Y.attr(e, i, ""), e.removeAttribute(Ct ? i : n), o && n in e && (e[n] = !1))
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (St.test(e.nodeName) && e.parentNode) Y.error("type property can't be changed");
                        else if (!Y.support.radioValue && "radio" === t && Y.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t
                        }
                    }
                },
                value: {
                    get: function(e, t) {
                        return yt && Y.nodeName(e, "button") ? yt.get(e, t) : t in e ? e.value : null
                    },
                    set: function(e, t, n) {
                        return yt && Y.nodeName(e, "button") ? yt.set(e, t, n) : void(e.value = t)
                    }
                }
            },
            propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
            },
            prop: function(e, n, r) {
                var i, o, a, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !Y.isXMLDoc(e), a && (n = Y.propFix[n] || n, o = Y.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var n = e.getAttributeNode("tabindex");
                        return n && n.specified ? parseInt(n.value, 10) : kt.test(e.nodeName) || Tt.test(e.nodeName) && e.href ? 0 : t
                    }
                }
            }
        }), vt = {
            get: function(e, n) {
                var r, i = Y.prop(e, n);
                return i === !0 || "boolean" != typeof i && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
            },
            set: function(e, t, n) {
                var r;
                return t === !1 ? Y.removeAttr(e, n) : (r = Y.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())), n
            }
        }, Ct || (bt = {
            name: !0,
            id: !0,
            coords: !0
        }, yt = Y.valHooks.button = {
            get: function(e, n) {
                var r;
                return r = e.getAttributeNode(n), r && (bt[n] ? "" !== r.value : r.specified) ? r.value : t
            },
            set: function(e, t, n) {
                var r = e.getAttributeNode(n);
                return r || (r = I.createAttribute(n), e.setAttributeNode(r)), r.value = t + ""
            }
        }, Y.each(["width", "height"], function(e, t) {
            Y.attrHooks[t] = Y.extend(Y.attrHooks[t], {
                set: function(e, n) {
                    return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
                }
            })
        }), Y.attrHooks.contenteditable = {
            get: yt.get,
            set: function(e, t, n) {
                "" === t && (t = "false"), yt.set(e, t, n)
            }
        }), Y.support.hrefNormalized || Y.each(["href", "src", "width", "height"], function(e, n) {
            Y.attrHooks[n] = Y.extend(Y.attrHooks[n], {
                get: function(e) {
                    var r = e.getAttribute(n, 2);
                    return null === r ? t : r
                }
            })
        }), Y.support.style || (Y.attrHooks.style = {
            get: function(e) {
                return e.style.cssText.toLowerCase() || t
            },
            set: function(e, t) {
                return e.style.cssText = "" + t
            }
        }), Y.support.optSelected || (Y.propHooks.selected = Y.extend(Y.propHooks.selected, {
            get: function(e) {
                var t = e.parentNode;
                return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
            }
        })), Y.support.enctype || (Y.propFix.enctype = "encoding"), Y.support.checkOn || Y.each(["radio", "checkbox"], function() {
            Y.valHooks[this] = {
                get: function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
            }
        }), Y.each(["radio", "checkbox"], function() {
            Y.valHooks[this] = Y.extend(Y.valHooks[this], {
                set: function(e, t) {
                    return Y.isArray(t) ? e.checked = Y.inArray(Y(e).val(), t) >= 0 : void 0
                }
            })
        });
        var Nt = /^(?:textarea|input|select)$/i,
            _t = /^([^\.]*|)(?:\.(.+)|)$/,
            At = /(?:^|\s)hover(\.\S+|)\b/,
            jt = /^key/,
            Ht = /^(?:mouse|contextmenu)|click/,
            Lt = /^(?:focusinfocus|focusoutblur)$/,
            Dt = function(e) {
                return Y.event.special.hover ? e : e.replace(At, "mouseenter$1 mouseleave$1")
            };
        Y.event = {
            add: function(e, n, r, i, o) {
                var a, s, l, u, c, p, h, d, f, m, g;
                if (3 !== e.nodeType && 8 !== e.nodeType && n && r && (a = Y._data(e))) {
                    for (r.handler && (f = r, r = f.handler, o = f.selector), r.guid || (r.guid = Y.guid++), l = a.events, l || (a.events = l = {}), s = a.handle, s || (a.handle = s = function(e) {
                        return "undefined" == typeof Y || e && Y.event.triggered === e.type ? t : Y.event.dispatch.apply(s.elem, arguments)
                    }, s.elem = e), n = Y.trim(Dt(n)).split(" "), u = 0; u < n.length; u++) c = _t.exec(n[u]) || [], p = c[1], h = (c[2] || "").split(".").sort(), g = Y.event.special[p] || {}, p = (o ? g.delegateType : g.bindType) || p, g = Y.event.special[p] || {}, d = Y.extend({
                        type: p,
                        origType: c[1],
                        data: i,
                        handler: r,
                        guid: r.guid,
                        selector: o,
                        namespace: h.join(".")
                    }, f), m = l[p], m || (m = l[p] = [], m.delegateCount = 0, g.setup && g.setup.call(e, i, h, s) !== !1 || (e.addEventListener ? e.addEventListener(p, s, !1) : e.attachEvent && e.attachEvent("on" + p, s))), g.add && (g.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), o ? m.splice(m.delegateCount++, 0, d) : m.push(d), Y.event.global[p] = !0;
                    e = null
                }
            },
            global: {},
            remove: function(e, t, n, r, i) {
                var o, a, s, l, u, c, p, h, d, f, m, g = Y.hasData(e) && Y._data(e);
                if (g && (h = g.events)) {
                    for (t = Y.trim(Dt(t || "")).split(" "), o = 0; o < t.length; o++)
                        if (a = _t.exec(t[o]) || [], s = l = a[1], u = a[2], s) {
                            for (d = Y.event.special[s] || {}, s = (r ? d.delegateType : d.bindType) || s, f = h[s] || [], c = f.length, u = u ? new RegExp("(^|\\.)" + u.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, p = 0; p < f.length; p++) m = f[p], !(!i && l !== m.origType || n && n.guid !== m.guid || u && !u.test(m.namespace) || r && r !== m.selector && ("**" !== r || !m.selector) || (f.splice(p--, 1), m.selector && f.delegateCount--, !d.remove || !d.remove.call(e, m)));
                            0 === f.length && c !== f.length && ((!d.teardown || d.teardown.call(e, u, g.handle) === !1) && Y.removeEvent(e, s, g.handle), delete h[s])
                        } else
                            for (s in h) Y.event.remove(e, s + t[o], n, r, !0);
                    Y.isEmptyObject(h) && (delete g.handle, Y.removeData(e, "events", !0))
                }
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(n, r, i, o) {
                if (!i || 3 !== i.nodeType && 8 !== i.nodeType) {
                    var a, s, l, u, c, p, h, d, f, m, g = n.type || n,
                        y = [];
                    if (Lt.test(g + Y.event.triggered)) return;
                    if (g.indexOf("!") >= 0 && (g = g.slice(0, -1), s = !0), g.indexOf(".") >= 0 && (y = g.split("."), g = y.shift(), y.sort()), (!i || Y.event.customEvent[g]) && !Y.event.global[g]) return;
                    if (n = "object" == typeof n ? n[Y.expando] ? n : new Y.Event(g, n) : new Y.Event(g), n.type = g, n.isTrigger = !0, n.exclusive = s, n.namespace = y.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, p = g.indexOf(":") < 0 ? "on" + g : "", !i) {
                        a = Y.cache;
                        for (l in a) a[l].events && a[l].events[g] && Y.event.trigger(n, r, a[l].handle.elem, !0);
                        return
                    }
                    if (n.result = t, n.target || (n.target = i), r = null != r ? Y.makeArray(r) : [], r.unshift(n), h = Y.event.special[g] || {}, h.trigger && h.trigger.apply(i, r) === !1) return;
                    if (f = [
                            [i, h.bindType || g]
                        ], !o && !h.noBubble && !Y.isWindow(i)) {
                        for (m = h.delegateType || g, u = Lt.test(m + g) ? i : i.parentNode, c = i; u; u = u.parentNode) f.push([u, m]), c = u;
                        c === (i.ownerDocument || I) && f.push([c.defaultView || c.parentWindow || e, m])
                    }
                    for (l = 0; l < f.length && !n.isPropagationStopped(); l++) u = f[l][0], n.type = f[l][1], d = (Y._data(u, "events") || {})[n.type] && Y._data(u, "handle"), d && d.apply(u, r), d = p && u[p], d && Y.acceptData(u) && d.apply(u, r) === !1 && n.preventDefault();
                    return n.type = g, !(o || n.isDefaultPrevented() || h._default && h._default.apply(i.ownerDocument, r) !== !1 || "click" === g && Y.nodeName(i, "a") || !Y.acceptData(i) || !p || !i[g] || ("focus" === g || "blur" === g) && 0 === n.target.offsetWidth || Y.isWindow(i) || (c = i[p], c && (i[p] = null), Y.event.triggered = g, i[g](), Y.event.triggered = t, !c || !(i[p] = c))), n.result
                }
            },
            dispatch: function(n) {
                n = Y.event.fix(n || e.event);
                var r, i, o, a, s, l, u, c, p, h, d = (Y._data(this, "events") || {})[n.type] || [],
                    f = d.delegateCount,
                    m = [].slice.call(arguments),
                    g = !n.exclusive && !n.namespace,
                    y = Y.event.special[n.type] || {},
                    v = [];
                if (m[0] = n, n.delegateTarget = this, !y.preDispatch || y.preDispatch.call(this, n) !== !1) {
                    if (f && (!n.button || "click" !== n.type))
                        for (a = Y(this), a.context = this, o = n.target; o != this; o = o.parentNode || this)
                            if (o.disabled !== !0 || "click" !== n.type) {
                                for (l = {}, c = [], a[0] = o, r = 0; f > r; r++) p = d[r], h = p.selector, l[h] === t && (l[h] = a.is(h)), l[h] && c.push(p);
                                c.length && v.push({
                                    elem: o,
                                    matches: c
                                })
                            }
                    for (d.length > f && v.push({
                        elem: this,
                        matches: d.slice(f)
                    }), r = 0; r < v.length && !n.isPropagationStopped(); r++)
                        for (u = v[r], n.currentTarget = u.elem, i = 0; i < u.matches.length && !n.isImmediatePropagationStopped(); i++) p = u.matches[i], (g || !n.namespace && !p.namespace || n.namespace_re && n.namespace_re.test(p.namespace)) && (n.data = p.data, n.handleObj = p, s = ((Y.event.special[p.origType] || {}).handle || p.handler).apply(u.elem, m), s !== t && (n.result = s, s === !1 && (n.preventDefault(), n.stopPropagation())));
                    return y.postDispatch && y.postDispatch.call(this, n), n.result
                }
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, n) {
                    var r, i, o, a = n.button,
                        s = n.fromElement;
                    return null == e.pageX && null != n.clientX && (r = e.target.ownerDocument || I, i = r.documentElement, o = r.body, e.pageX = n.clientX + (i && i.scrollLeft || o && o.scrollLeft || 0) - (i && i.clientLeft || o && o.clientLeft || 0), e.pageY = n.clientY + (i && i.scrollTop || o && o.scrollTop || 0) - (i && i.clientTop || o && o.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? n.toElement : s), !e.which && a !== t && (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e
                }
            },
            fix: function(e) {
                if (e[Y.expando]) return e;
                var t, n, r = e,
                    i = Y.event.fixHooks[e.type] || {},
                    o = i.props ? this.props.concat(i.props) : this.props;
                for (e = Y.Event(r), t = o.length; t;) n = o[--t], e[n] = r[n];
                return e.target || (e.target = r.srcElement || I), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, i.filter ? i.filter(e, r) : e
            },
            special: {
                ready: {
                    setup: Y.bindReady
                },
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(e, t, n) {
                        Y.isWindow(this) && (this.onbeforeunload = n)
                    },
                    teardown: function(e, t) {
                        this.onbeforeunload === t && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = Y.extend(new Y.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? Y.event.trigger(i, null, t) : Y.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, Y.event.handle = Y.event.dispatch, Y.removeEvent = I.removeEventListener ? function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        } : function(e, t, n) {
            var r = "on" + t;
            e.detachEvent && ("undefined" == typeof e[r] && (e[r] = null), e.detachEvent(r, n))
        }, Y.Event = function(e, t) {
            return this instanceof Y.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? a : o) : this.type = e, t && Y.extend(this, t), this.timeStamp = e && e.timeStamp || Y.now(), this[Y.expando] = !0, void 0) : new Y.Event(e, t)
        }, Y.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = a;
                var e = this.originalEvent;
                e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
            },
            stopPropagation: function() {
                this.isPropagationStopped = a;
                var e = this.originalEvent;
                e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = a, this.stopPropagation()
            },
            isDefaultPrevented: o,
            isPropagationStopped: o,
            isImmediatePropagationStopped: o
        }, Y.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(e, t) {
            Y.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    {
                        var n, r = this,
                            i = e.relatedTarget,
                            o = e.handleObj;
                        o.selector
                    }
                    return (!i || i !== r && !Y.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
                }
            }
        }), Y.support.submitBubbles || (Y.event.special.submit = {
            setup: function() {
                return Y.nodeName(this, "form") ? !1 : void Y.event.add(this, "click._submit keypress._submit", function(e) {
                    var n = e.target,
                        r = Y.nodeName(n, "input") || Y.nodeName(n, "button") ? n.form : t;
                    r && !Y._data(r, "_submit_attached") && (Y.event.add(r, "submit._submit", function(e) {
                        e._submit_bubble = !0
                    }), Y._data(r, "_submit_attached", !0))
                })
            },
            postDispatch: function(e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && Y.event.simulate("submit", this.parentNode, e, !0))
            },
            teardown: function() {
                return Y.nodeName(this, "form") ? !1 : void Y.event.remove(this, "._submit")
            }
        }), Y.support.changeBubbles || (Y.event.special.change = {
            setup: function() {
                return Nt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (Y.event.add(this, "propertychange._change", function(e) {
                    "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                }), Y.event.add(this, "click._change", function(e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1), Y.event.simulate("change", this, e, !0)
                })), !1) : void Y.event.add(this, "beforeactivate._change", function(e) {
                    var t = e.target;
                    Nt.test(t.nodeName) && !Y._data(t, "_change_attached") && (Y.event.add(t, "change._change", function(e) {
                        this.parentNode && !e.isSimulated && !e.isTrigger && Y.event.simulate("change", this.parentNode, e, !0)
                    }), Y._data(t, "_change_attached", !0))
                })
            },
            handle: function(e) {
                var t = e.target;
                return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function() {
                return Y.event.remove(this, "._change"), Nt.test(this.nodeName)
            }
        }), Y.support.focusinBubbles || Y.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = 0,
                r = function(e) {
                    Y.event.simulate(t, e.target, Y.event.fix(e), !0)
                };
            Y.event.special[t] = {
                setup: function() {
                    0 === n++ && I.addEventListener(e, r, !0)
                },
                teardown: function() {
                    0 === --n && I.removeEventListener(e, r, !0)
                }
            }
        }), Y.fn.extend({
            on: function(e, n, r, i, a) {
                var s, l;
                if ("object" == typeof e) {
                    "string" != typeof n && (r = r || n, n = t);
                    for (l in e) this.on(l, n, r, e[l], a);
                    return this
                }
                if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1) i = o;
                else if (!i) return this;
                return 1 === a && (s = i, i = function(e) {
                    return Y().off(e), s.apply(this, arguments)
                }, i.guid = s.guid || (s.guid = Y.guid++)), this.each(function() {
                    Y.event.add(this, e, i, r, n)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, n, r) {
                var i, a;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, Y(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof e) {
                    for (a in e) this.off(a, n, e[a]);
                    return this
                }
                return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = o), this.each(function() {
                    Y.event.remove(this, e, r, n)
                })
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            live: function(e, t, n) {
                return Y(this.context).on(e, this.selector, t, n), this
            },
            die: function(e, t) {
                return Y(this.context).off(e, this.selector || "**", t), this
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return 1 == arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            },
            trigger: function(e, t) {
                return this.each(function() {
                    Y.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                return this[0] ? Y.event.trigger(e, t, this[0], !0) : void 0
            },
            toggle: function(e) {
                var t = arguments,
                    n = e.guid || Y.guid++,
                    r = 0,
                    i = function(n) {
                        var i = (Y._data(this, "lastToggle" + e.guid) || 0) % r;
                        return Y._data(this, "lastToggle" + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1
                    };
                for (i.guid = n; r < t.length;) t[r++].guid = n;
                return this.click(i)
            },
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        }), Y.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            Y.fn[t] = function(e, n) {
                return null == n && (n = e, e = null), arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }, jt.test(t) && (Y.event.fixHooks[t] = Y.event.keyHooks), Ht.test(t) && (Y.event.fixHooks[t] = Y.event.mouseHooks)
        }),
            function(e, t) {
                function n(e, t, n, r) {
                    for (var i = 0, o = t.length; o > i; i++) ot(e, t[i], n, r)
                }

                function r(e, t, r, i, o, a) {
                    var s, l = at.setFilters[t.toLowerCase()];
                    return l || ot.error(t), (e || !(s = o)) && n(e || "*", i, s = [], o), s.length > 0 ? l(s, r, a) : []
                }

                function i(e, i, o, a, s) {
                    for (var l, u, c, p, h, d, f, m, g = 0, y = s.length, v = W.POS, b = new RegExp("^" + v.source + "(?!" + T + ")", "i"), x = function() {
                        for (var e = 1, n = arguments.length - 2; n > e; e++) arguments[e] === t && (l[e] = t)
                    }; y > g; g++) {
                        for (v.exec(""), e = s[g], p = [], c = 0, h = a; l = v.exec(e);) m = v.lastIndex = l.index + l[0].length, m > c && (f = e.slice(c, l.index), c = m, d = [i], O.test(f) && (h && (d = h), h = a), (u = F.test(f)) && (f = f.slice(0, -5).replace(O, "$&*")), l.length > 1 && l[0].replace(b, x), h = r(f, l[1], l[2], d, h, u));
                        h ? (p = p.concat(h), (f = e.slice(c)) && ")" !== f ? O.test(f) ? n(f, p, o, a) : ot(f, i, o, a ? a.concat(h) : h) : S.apply(o, p)) : ot(e, i, o, a)
                    }
                    return 1 === y ? o : ot.uniqueSort(o)
                }

                function o(e, t, n) {
                    for (var r, i, o, a = [], s = 0, l = R.exec(e), u = !l.pop() && !l.pop(), c = u && e.match(q) || [""], p = at.preFilter, h = at.filter, d = !n && t !== m; null != (i = c[s]) && u; s++)
                        for (a.push(r = []), d && (i = " " + i); i;) {
                            u = !1, (l = O.exec(i)) && (i = i.slice(l[0].length), u = r.push({
                                part: l.pop().replace(D, " "),
                                captures: l
                            }));
                            for (o in h)(l = W[o].exec(i)) && (!p[o] || (l = p[o](l, t, n))) && (i = i.slice(l.shift().length), u = r.push({
                                part: o,
                                captures: l
                            }));
                            if (!u) break
                        }
                    return u || ot.error(e), a
                }

                function a(e, t, n) {
                    var r = t.dir,
                        i = x++;
                    return e || (e = function(e) {
                        return e === n
                    }), t.first ? function(t, n) {
                        for (; t = t[r];)
                            if (1 === t.nodeType) return e(t, n) && t
                    } : function(t, n) {
                        for (var o, a = i + "." + p, s = a + "." + c; t = t[r];)
                            if (1 === t.nodeType) {
                                if ((o = t[k]) === s) return t.sizset;
                                if ("string" == typeof o && 0 === o.indexOf(a)) {
                                    if (t.sizset) return t
                                } else {
                                    if (t[k] = s, e(t, n)) return t.sizset = !0, t;
                                    t.sizset = !1
                                }
                            }
                    }
                }

                function s(e, t) {
                    return e ? function(n, r) {
                        var i = t(n, r);
                        return i && e(i === !0 ? n : i, r)
                    } : t
                }

                function l(e, t, n) {
                    for (var r, i, o = 0; r = e[o]; o++) at.relative[r.part] ? i = a(i, at.relative[r.part], t) : (r.captures.push(t, n), i = s(i, at.filter[r.part].apply(null, r.captures)));
                    return i
                }

                function u(e) {
                    return function(t, n) {
                        for (var r, i = 0; r = e[i]; i++)
                            if (r(t, n)) return !0;
                        return !1
                    }
                }
                var c, p, h, d, f, m = e.document,
                    g = m.documentElement,
                    y = "undefined",
                    v = !1,
                    b = !0,
                    x = 0,
                    w = [].slice,
                    S = [].push,
                    k = ("sizcache" + Math.random()).replace(".", ""),
                    T = "[\\x20\\t\\r\\n\\f]",
                    E = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
                    C = E.replace("w", "w#"),
                    N = "([*^$|!~]?=)",
                    _ = "\\[" + T + "*(" + E + ")" + T + "*(?:" + N + T + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + C + ")|)|)" + T + "*\\]",
                    A = ":(" + E + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)",
                    j = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)",
                    H = T + "*([\\x20\\t\\r\\n\\f>+~])" + T + "*",
                    L = "(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|" + _ + "|" + A.replace(2, 7) + "|[^\\\\(),])+",
                    D = new RegExp("^" + T + "+|((?:^|[^\\\\])(?:\\\\.)*)" + T + "+$", "g"),
                    O = new RegExp("^" + H),
                    q = new RegExp(L + "?(?=" + T + "*,|$)", "g"),
                    R = new RegExp("^(?:(?!,)(?:(?:^|,)" + T + "*" + L + ")*?|" + T + "*(.*?))(\\)|$)"),
                    P = new RegExp(L.slice(19, -6) + "\\x20\\t\\r\\n\\f>+~])+|" + H, "g"),
                    M = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
                    $ = /[\x20\t\r\n\f]*[+~]/,
                    F = /:not\($/,
                    I = /h\d/i,
                    B = /input|select|textarea|button/i,
                    z = /\\(?!\\)/g,
                    W = {
                        ID: new RegExp("^#(" + E + ")"),
                        CLASS: new RegExp("^\\.(" + E + ")"),
                        NAME: new RegExp("^\\[name=['\"]?(" + E + ")['\"]?\\]"),
                        TAG: new RegExp("^(" + E.replace("[-", "[-\\*") + ")"),
                        ATTR: new RegExp("^" + _),
                        PSEUDO: new RegExp("^" + A),
                        CHILD: new RegExp("^:(only|nth|last|first)-child(?:\\(" + T + "*(even|odd|(([+-]|)(\\d*)n|)" + T + "*(?:([+-]|)" + T + "*(\\d+)|))" + T + "*\\)|)", "i"),
                        POS: new RegExp(j, "ig"),
                        needsContext: new RegExp("^" + T + "*[>+~]|" + j, "i")
                    },
                    V = {},
                    U = [],
                    X = {},
                    J = [],
                    Q = function(e) {
                        return e.sizzleFilter = !0, e
                    },
                    G = function(e) {
                        return function(t) {
                            return "input" === t.nodeName.toLowerCase() && t.type === e
                        }
                    },
                    K = function(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return ("input" === n || "button" === n) && t.type === e
                        }
                    },
                    Z = function(e) {
                        var t = !1,
                            n = m.createElement("div");
                        try {
                            t = e(n)
                        } catch (r) {}
                        return n = null, t
                    },
                    et = Z(function(e) {
                        e.innerHTML = "<select></select>";
                        var t = typeof e.lastChild.getAttribute("multiple");
                        return "boolean" !== t && "string" !== t
                    }),
                    tt = Z(function(e) {
                        e.id = k + 0, e.innerHTML = "<a name='" + k + "'></a><div name='" + k + "'></div>", g.insertBefore(e, g.firstChild);
                        var t = m.getElementsByName && m.getElementsByName(k).length === 2 + m.getElementsByName(k + 0).length;
                        return f = !m.getElementById(k), g.removeChild(e), t
                    }),
                    nt = Z(function(e) {
                        return e.appendChild(m.createComment("")), 0 === e.getElementsByTagName("*").length
                    }),
                    rt = Z(function(e) {
                        return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== y && "#" === e.firstChild.getAttribute("href")
                    }),
                    it = Z(function(e) {
                        return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", e.getElementsByClassName && 0 !== e.getElementsByClassName("e").length ? (e.lastChild.className = "e", 1 !== e.getElementsByClassName("e").length) : !1
                    }),
                    ot = function(e, t, n, r) {
                        n = n || [], t = t || m;
                        var i, o, a, s, l = t.nodeType;
                        if (1 !== l && 9 !== l) return [];
                        if (!e || "string" != typeof e) return n;
                        if (a = lt(t), !a && !r && (i = M.exec(e)))
                            if (s = i[1]) {
                                if (9 === l) {
                                    if (o = t.getElementById(s), !o || !o.parentNode) return n;
                                    if (o.id === s) return n.push(o), n
                                } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(s)) && ut(t, o) && o.id === s) return n.push(o), n
                            } else {
                                if (i[2]) return S.apply(n, w.call(t.getElementsByTagName(e), 0)), n;
                                if ((s = i[3]) && it && t.getElementsByClassName) return S.apply(n, w.call(t.getElementsByClassName(s), 0)), n
                            }
                        return ht(e, t, n, r, a)
                    },
                    at = ot.selectors = {
                        cacheLength: 50,
                        match: W,
                        order: ["ID", "TAG"],
                        attrHandle: {},
                        createPseudo: Q,
                        find: {
                            ID: f ? function(e, t, n) {
                                if (typeof t.getElementById !== y && !n) {
                                    var r = t.getElementById(e);
                                    return r && r.parentNode ? [r] : []
                                }
                            } : function(e, n, r) {
                                if (typeof n.getElementById !== y && !r) {
                                    var i = n.getElementById(e);
                                    return i ? i.id === e || typeof i.getAttributeNode !== y && i.getAttributeNode("id").value === e ? [i] : t : []
                                }
                            },
                            TAG: nt ? function(e, t) {
                                return typeof t.getElementsByTagName !== y ? t.getElementsByTagName(e) : void 0
                            } : function(e, t) {
                                var n = t.getElementsByTagName(e);
                                if ("*" === e) {
                                    for (var r, i = [], o = 0; r = n[o]; o++) 1 === r.nodeType && i.push(r);
                                    return i
                                }
                                return n
                            }
                        },
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(e) {
                                return e[1] = e[1].replace(z, ""), e[3] = (e[4] || e[5] || "").replace(z, ""), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                            },
                            CHILD: function(e) {
                                return e[1] = e[1].toLowerCase(), "nth" === e[1] ? (e[2] || ot.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * ("even" === e[2] || "odd" === e[2])), e[4] = +(e[6] + e[7] || "odd" === e[2])) : e[2] && ot.error(e[0]), e
                            },
                            PSEUDO: function(e) {
                                var t, n = e[4];
                                return W.CHILD.test(e[0]) ? null : (n && (t = R.exec(n)) && t.pop() && (e[0] = e[0].slice(0, t[0].length - n.length - 1), n = t[0].slice(0, -1)), e.splice(2, 3, n || e[3]), e)
                            }
                        },
                        filter: {
                            ID: f ? function(e) {
                                return e = e.replace(z, ""),
                                    function(t) {
                                        return t.getAttribute("id") === e
                                    }
                            } : function(e) {
                                return e = e.replace(z, ""),
                                    function(t) {
                                        var n = typeof t.getAttributeNode !== y && t.getAttributeNode("id");
                                        return n && n.value === e
                                    }
                            },
                            TAG: function(e) {
                                return "*" === e ? function() {
                                    return !0
                                } : (e = e.replace(z, "").toLowerCase(), function(t) {
                                    return t.nodeName && t.nodeName.toLowerCase() === e
                                })
                            },
                            CLASS: function(e) {
                                var t = V[e];
                                return t || (t = V[e] = new RegExp("(^|" + T + ")" + e + "(" + T + "|$)"), U.push(e), U.length > at.cacheLength && delete V[U.shift()]),
                                    function(e) {
                                        return t.test(e.className || typeof e.getAttribute !== y && e.getAttribute("class") || "")
                                    }
                            },
                            ATTR: function(e, t, n) {
                                return t ? function(r) {
                                    var i = ot.attr(r, e),
                                        o = i + "";
                                    if (null == i) return "!=" === t;
                                    switch (t) {
                                        case "=":
                                            return o === n;
                                        case "!=":
                                            return o !== n;
                                        case "^=":
                                            return n && 0 === o.indexOf(n);
                                        case "*=":
                                            return n && o.indexOf(n) > -1;
                                        case "$=":
                                            return n && o.substr(o.length - n.length) === n;
                                        case "~=":
                                            return (" " + o + " ").indexOf(n) > -1;
                                        case "|=":
                                            return o === n || o.substr(0, n.length + 1) === n + "-"
                                    }
                                } : function(t) {
                                    return null != ot.attr(t, e)
                                }
                            },
                            CHILD: function(e, t, n, r) {
                                if ("nth" === e) {
                                    var i = x++;
                                    return function(e) {
                                        var t, o, a = 0,
                                            s = e;
                                        if (1 === n && 0 === r) return !0;
                                        if (t = e.parentNode, t && (t[k] !== i || !e.sizset)) {
                                            for (s = t.firstChild; s && (1 !== s.nodeType || (s.sizset = ++a, s !== e)); s = s.nextSibling);
                                            t[k] = i
                                        }
                                        return o = e.sizset - r, 0 === n ? 0 === o : o % n === 0 && o / n >= 0
                                    }
                                }
                                return function(t) {
                                    var n = t;
                                    switch (e) {
                                        case "only":
                                        case "first":
                                            for (; n = n.previousSibling;)
                                                if (1 === n.nodeType) return !1;
                                            if ("first" === e) return !0;
                                            n = t;
                                        case "last":
                                            for (; n = n.nextSibling;)
                                                if (1 === n.nodeType) return !1;
                                            return !0
                                    }
                                }
                            },
                            PSEUDO: function(e, t, n, r) {
                                var i = at.pseudos[e] || at.pseudos[e.toLowerCase()];
                                return i || ot.error("unsupported pseudo: " + e), i.sizzleFilter ? i(t, n, r) : i
                            }
                        },
                        pseudos: {
                            not: Q(function(e, t, n) {
                                var r = pt(e.replace(D, "$1"), t, n);
                                return function(e) {
                                    return !r(e)
                                }
                            }),
                            enabled: function(e) {
                                return e.disabled === !1
                            },
                            disabled: function(e) {
                                return e.disabled === !0
                            },
                            checked: function(e) {
                                var t = e.nodeName.toLowerCase();
                                return "input" === t && !!e.checked || "option" === t && !!e.selected
                            },
                            selected: function(e) {
                                return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                            },
                            parent: function(e) {
                                return !at.pseudos.empty(e)
                            },
                            empty: function(e) {
                                var t;
                                for (e = e.firstChild; e;) {
                                    if (e.nodeName > "@" || 3 === (t = e.nodeType) || 4 === t) return !1;
                                    e = e.nextSibling
                                }
                                return !0
                            },
                            contains: Q(function(e) {
                                return function(t) {
                                    return (t.textContent || t.innerText || ct(t)).indexOf(e) > -1
                                }
                            }),
                            has: Q(function(e) {
                                return function(t) {
                                    return ot(e, t).length > 0
                                }
                            }),
                            header: function(e) {
                                return I.test(e.nodeName)
                            },
                            text: function(e) {
                                var t, n;
                                return "input" === e.nodeName.toLowerCase() && "text" === (t = e.type) && (null == (n = e.getAttribute("type")) || n.toLowerCase() === t)
                            },
                            radio: G("radio"),
                            checkbox: G("checkbox"),
                            file: G("file"),
                            password: G("password"),
                            image: G("image"),
                            submit: K("submit"),
                            reset: K("reset"),
                            button: function(e) {
                                var t = e.nodeName.toLowerCase();
                                return "input" === t && "button" === e.type || "button" === t
                            },
                            input: function(e) {
                                return B.test(e.nodeName)
                            },
                            focus: function(e) {
                                var t = e.ownerDocument;
                                return !(e !== t.activeElement || t.hasFocus && !t.hasFocus() || !e.type && !e.href)
                            },
                            active: function(e) {
                                return e === e.ownerDocument.activeElement
                            }
                        },
                        setFilters: {
                            first: function(e, t, n) {
                                return n ? e.slice(1) : [e[0]]
                            },
                            last: function(e, t, n) {
                                var r = e.pop();
                                return n ? e : [r]
                            },
                            even: function(e, t, n) {
                                for (var r = [], i = n ? 1 : 0, o = e.length; o > i; i += 2) r.push(e[i]);
                                return r
                            },
                            odd: function(e, t, n) {
                                for (var r = [], i = n ? 0 : 1, o = e.length; o > i; i += 2) r.push(e[i]);
                                return r
                            },
                            lt: function(e, t, n) {
                                return n ? e.slice(+t) : e.slice(0, +t)
                            },
                            gt: function(e, t, n) {
                                return n ? e.slice(0, +t + 1) : e.slice(+t + 1)
                            },
                            eq: function(e, t, n) {
                                var r = e.splice(+t, 1);
                                return n ? e : r
                            }
                        }
                    };
                at.setFilters.nth = at.setFilters.eq, at.filters = at.pseudos, rt || (at.attrHandle = {
                    href: function(e) {
                        return e.getAttribute("href", 2)
                    },
                    type: function(e) {
                        return e.getAttribute("type")
                    }
                }), tt && (at.order.push("NAME"), at.find.NAME = function(e, t) {
                    return typeof t.getElementsByName !== y ? t.getElementsByName(e) : void 0
                }), it && (at.order.splice(1, 0, "CLASS"), at.find.CLASS = function(e, t, n) {
                    return typeof t.getElementsByClassName === y || n ? void 0 : t.getElementsByClassName(e)
                });
                try {
                    w.call(g.childNodes, 0)[0].nodeType
                } catch (st) {
                    w = function(e) {
                        for (var t, n = []; t = this[e]; e++) n.push(t);
                        return n
                    }
                }
                var lt = ot.isXML = function(e) {
                        var t = e && (e.ownerDocument || e).documentElement;
                        return t ? "HTML" !== t.nodeName : !1
                    },
                    ut = ot.contains = g.compareDocumentPosition ? function(e, t) {
                        return !!(16 & e.compareDocumentPosition(t))
                    } : g.contains ? function(e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                            r = t.parentNode;
                        return e === r || !!(r && 1 === r.nodeType && n.contains && n.contains(r))
                    } : function(e, t) {
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                        return !1
                    },
                    ct = ot.getText = function(e) {
                        var t, n = "",
                            r = 0,
                            i = e.nodeType;
                        if (i) {
                            if (1 === i || 9 === i || 11 === i) {
                                if ("string" == typeof e.textContent) return e.textContent;
                                for (e = e.firstChild; e; e = e.nextSibling) n += ct(e)
                            } else if (3 === i || 4 === i) return e.nodeValue
                        } else
                            for (; t = e[r]; r++) n += ct(t);
                        return n
                    };
                ot.attr = function(e, t) {
                    var n, r = lt(e);
                    return r || (t = t.toLowerCase()), at.attrHandle[t] ? at.attrHandle[t](e) : et || r ? e.getAttribute(t) : (n = e.getAttributeNode(t), n ? "boolean" == typeof e[t] ? e[t] ? t : null : n.specified ? n.value : null : null)
                }, ot.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, [0, 0].sort(function() {
                    return b = 0
                }), g.compareDocumentPosition ? h = function(e, t) {
                    return e === t ? (v = !0, 0) : (e.compareDocumentPosition && t.compareDocumentPosition ? 4 & e.compareDocumentPosition(t) : e.compareDocumentPosition) ? -1 : 1
                } : (h = function(e, t) {
                    if (e === t) return v = !0, 0;
                    if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
                    var n, r, i = [],
                        o = [],
                        a = e.parentNode,
                        s = t.parentNode,
                        l = a;
                    if (a === s) return d(e, t);
                    if (!a) return -1;
                    if (!s) return 1;
                    for (; l;) i.unshift(l), l = l.parentNode;
                    for (l = s; l;) o.unshift(l), l = l.parentNode;
                    n = i.length, r = o.length;
                    for (var u = 0; n > u && r > u; u++)
                        if (i[u] !== o[u]) return d(i[u], o[u]);
                    return u === n ? d(e, o[u], -1) : d(i[u], t, 1)
                }, d = function(e, t, n) {
                    if (e === t) return n;
                    for (var r = e.nextSibling; r;) {
                        if (r === t) return -1;
                        r = r.nextSibling
                    }
                    return 1
                }), ot.uniqueSort = function(e) {
                    var t, n = 1;
                    if (h && (v = b, e.sort(h), v))
                        for (; t = e[n]; n++) t === e[n - 1] && e.splice(n--, 1);
                    return e
                };
                var pt = ot.compile = function(e, t, n) {
                    var r, i, a, s = X[e];
                    if (s && s.context === t) return s;
                    for (i = o(e, t, n), a = 0; r = i[a]; a++) i[a] = l(r, t, n);
                    return s = X[e] = u(i), s.context = t, s.runs = s.dirruns = 0, J.push(e), J.length > at.cacheLength && delete X[J.shift()], s
                };
                ot.matches = function(e, t) {
                    return ot(e, null, null, t)
                }, ot.matchesSelector = function(e, t) {
                    return ot(t, null, null, [e]).length > 0
                };
                var ht = function(e, t, n, r, o) {
                    e = e.replace(D, "$1");
                    var a, s, l, u, h, d, f, m, g, y = e.match(q),
                        v = e.match(P),
                        b = t.nodeType;
                    if (W.POS.test(e)) return i(e, t, n, r, y);
                    if (r) a = w.call(r, 0);
                    else if (y && 1 === y.length) {
                        if (v.length > 1 && 9 === b && !o && (y = W.ID.exec(v[0]))) {
                            if (t = at.find.ID(y[1], t, o)[0], !t) return n;
                            e = e.slice(v.shift().length)
                        }
                        for (m = (y = $.exec(v[0])) && !y.index && t.parentNode || t, g = v.pop(), d = g.split(":not")[0], l = 0, u = at.order.length; u > l; l++)
                            if (f = at.order[l], y = W[f].exec(d)) {
                                if (a = at.find[f]((y[1] || "").replace(z, ""), m, o), null == a) continue;
                                d === g && (e = e.slice(0, e.length - g.length) + d.replace(W[f], ""), e || S.apply(n, w.call(a, 0)));
                                break
                            }
                    }
                    if (e)
                        for (s = pt(e, t, o), p = s.dirruns++, null == a && (a = at.find.TAG("*", $.test(e) && t.parentNode || t)), l = 0; h = a[l]; l++) c = s.runs++, s(h, t) && n.push(h);
                    return n
                };
                m.querySelectorAll && function() {
                    var e, t = ht,
                        n = /'|\\/g,
                        r = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                        i = [],
                        o = [":active"],
                        a = g.matchesSelector || g.mozMatchesSelector || g.webkitMatchesSelector || g.oMatchesSelector || g.msMatchesSelector;
                    Z(function(e) {
                        e.innerHTML = "<select><option selected></option></select>", e.querySelectorAll("[selected]").length || i.push("\\[" + T + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || i.push(":checked")
                    }), Z(function(e) {
                        e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && i.push("[*^$]=" + T + "*(?:\"\"|'')"), e.innerHTML = "<input type='hidden'>", e.querySelectorAll(":enabled").length || i.push(":enabled", ":disabled")
                    }), i = i.length && new RegExp(i.join("|")), ht = function(e, r, o, a, s) {
                        if (!(a || s || i && i.test(e)))
                            if (9 === r.nodeType) try {
                                return S.apply(o, w.call(r.querySelectorAll(e), 0)), o
                            } catch (l) {} else if (1 === r.nodeType && "object" !== r.nodeName.toLowerCase()) {
                                var u = r.getAttribute("id"),
                                    c = u || k,
                                    p = $.test(e) && r.parentNode || r;
                                u ? c = c.replace(n, "\\$&") : r.setAttribute("id", c);
                                try {
                                    return S.apply(o, w.call(p.querySelectorAll(e.replace(q, "[id='" + c + "'] $&")), 0)), o
                                } catch (l) {} finally {
                                    u || r.removeAttribute("id")
                                }
                            }
                        return t(e, r, o, a, s)
                    }, a && (Z(function(t) {
                        e = a.call(t, "div");
                        try {
                            a.call(t, "[test!='']:sizzle"), o.push(at.match.PSEUDO)
                        } catch (n) {}
                    }), o = new RegExp(o.join("|")), ot.matchesSelector = function(t, n) {
                        if (n = n.replace(r, "='$1']"), !(lt(t) || o.test(n) || i && i.test(n))) try {
                            var s = a.call(t, n);
                            if (s || e || t.document && 11 !== t.document.nodeType) return s
                        } catch (l) {}
                        return ot(n, null, null, [t]).length > 0
                    })
                }(), ot.attr = Y.attr, Y.find = ot, Y.expr = ot.selectors, Y.expr[":"] = Y.expr.pseudos, Y.unique = ot.uniqueSort, Y.text = ot.getText, Y.isXMLDoc = ot.isXML, Y.contains = ot.contains
            }(e);
        var Ot = /Until$/,
            qt = /^(?:parents|prev(?:Until|All))/,
            Rt = /^.[^:#\[\.,]*$/,
            Pt = Y.expr.match.needsContext,
            Mt = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        Y.fn.extend({
            find: function(e) {
                var t, n, r, i, o, a, s = this;
                if ("string" != typeof e) return Y(e).filter(function() {
                    for (t = 0, n = s.length; n > t; t++)
                        if (Y.contains(s[t], this)) return !0
                });
                for (a = this.pushStack("", "find", e), t = 0, n = this.length; n > t; t++)
                    if (r = a.length, Y.find(e, this[t], a), t > 0)
                        for (i = r; i < a.length; i++)
                            for (o = 0; r > o; o++)
                                if (a[o] === a[i]) {
                                    a.splice(i--, 1);
                                    break
                                }
                return a
            },
            has: function(e) {
                var t, n = Y(e, this),
                    r = n.length;
                return this.filter(function() {
                    for (t = 0; r > t; t++)
                        if (Y.contains(this, n[t])) return !0
                })
            },
            not: function(e) {
                return this.pushStack(u(this, e, !1), "not", e)
            },
            filter: function(e) {
                return this.pushStack(u(this, e, !0), "filter", e)
            },
            is: function(e) {
                return !!e && ("string" == typeof e ? Pt.test(e) ? Y(e, this.context).index(this[0]) >= 0 : Y.filter(e, this).length > 0 : this.filter(e).length > 0)
            },
            closest: function(e, t) {
                for (var n, r = 0, i = this.length, o = [], a = Pt.test(e) || "string" != typeof e ? Y(e, t || this.context) : 0; i > r; r++)
                    for (n = this[r]; n && n.ownerDocument && n !== t && 11 !== n.nodeType;) {
                        if (a ? a.index(n) > -1 : Y.find.matchesSelector(n, e)) {
                            o.push(n);
                            break
                        }
                        n = n.parentNode
                    }
                return o = o.length > 1 ? Y.unique(o) : o, this.pushStack(o, "closest", e)
            },
            index: function(e) {
                return e ? "string" == typeof e ? Y.inArray(this[0], Y(e)) : Y.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
            },
            add: function(e, t) {
                var n = "string" == typeof e ? Y(e, t) : Y.makeArray(e && e.nodeType ? [e] : e),
                    r = Y.merge(this.get(), n);
                return this.pushStack(s(n[0]) || s(r[0]) ? r : Y.unique(r))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }), Y.fn.andSelf = Y.fn.addBack, Y.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return Y.dir(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return Y.dir(e, "parentNode", n)
            },
            next: function(e) {
                return l(e, "nextSibling")
            },
            prev: function(e) {
                return l(e, "previousSibling")
            },
            nextAll: function(e) {
                return Y.dir(e, "nextSibling")
            },
            prevAll: function(e) {
                return Y.dir(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return Y.dir(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return Y.dir(e, "previousSibling", n)
            },
            siblings: function(e) {
                return Y.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return Y.sibling(e.firstChild)
            },
            contents: function(e) {
                return Y.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : Y.merge([], e.childNodes)
            }
        }, function(e, t) {
            Y.fn[e] = function(n, r) {
                var i = Y.map(this, t, n);
                return Ot.test(e) || (r = n), r && "string" == typeof r && (i = Y.filter(r, i)), i = this.length > 1 && !Mt[e] ? Y.unique(i) : i, this.length > 1 && qt.test(e) && (i = i.reverse()), this.pushStack(i, e, X.call(arguments).join(","))
            }
        }), Y.extend({
            filter: function(e, t, n) {
                return n && (e = ":not(" + e + ")"), 1 === t.length ? Y.find.matchesSelector(t[0], e) ? [t[0]] : [] : Y.find.matches(e, t)
            },
            dir: function(e, n, r) {
                for (var i = [], o = e[n]; o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !Y(o).is(r));) 1 === o.nodeType && i.push(o), o = o[n];
                return i
            },
            sibling: function(e, t) {
                for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n
            }
        });
        var $t = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            Ft = / jQuery\d+="(?:null|\d+)"/g,
            It = /^\s+/,
            Bt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            zt = /<([\w:]+)/,
            Wt = /<tbody/i,
            Vt = /<|&#?\w+;/,
            Ut = /<(?:script|style|link)/i,
            Xt = /<(?:script|object|embed|option|style)/i,
            Jt = new RegExp("<(?:" + $t + ")[\\s/>]", "i"),
            Qt = /^(?:checkbox|radio)$/,
            Gt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Kt = /\/(java|ecma)script/i,
            Yt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
            Zt = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                area: [1, "<map>", "</map>"],
                _default: [0, "", ""]
            },
            en = c(I),
            tn = en.appendChild(I.createElement("div"));
        Zt.optgroup = Zt.option, Zt.tbody = Zt.tfoot = Zt.colgroup = Zt.caption = Zt.thead, Zt.th = Zt.td, Y.support.htmlSerialize || (Zt._default = [1, "X<div>", "</div>"]), Y.fn.extend({
            text: function(e) {
                return Y.access(this, function(e) {
                    return e === t ? Y.text(this) : this.empty().append((this[0] && this[0].ownerDocument || I).createTextNode(e))
                }, null, e, arguments.length)
            },
            wrapAll: function(e) {
                if (Y.isFunction(e)) return this.each(function(t) {
                    Y(this).wrapAll(e.call(this, t))
                });
                if (this[0]) {
                    var t = Y(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                        for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                        return e
                    }).append(this)
                }
                return this
            },
            wrapInner: function(e) {
                return this.each(Y.isFunction(e) ? function(t) {
                    Y(this).wrapInner(e.call(this, t))
                } : function() {
                    var t = Y(this),
                        n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = Y.isFunction(e);
                return this.each(function(n) {
                    Y(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    Y.nodeName(this, "body") || Y(this).replaceWith(this.childNodes)
                }).end()
            },
            append: function() {
                return this.domManip(arguments, !0, function(e) {
                    (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(e)
                })
            },
            prepend: function() {
                return this.domManip(arguments, !0, function(e) {
                    (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(e, this.firstChild)
                })
            },
            before: function() {
                if (!s(this[0])) return this.domManip(arguments, !1, function(e) {
                    this.parentNode.insertBefore(e, this)
                });
                if (arguments.length) {
                    var e = Y.clean(arguments);
                    return this.pushStack(Y.merge(e, this), "before", this.selector)
                }
            },
            after: function() {
                if (!s(this[0])) return this.domManip(arguments, !1, function(e) {
                    this.parentNode.insertBefore(e, this.nextSibling)
                });
                if (arguments.length) {
                    var e = Y.clean(arguments);
                    return this.pushStack(Y.merge(this, e), "after", this.selector)
                }
            },
            remove: function(e, t) {
                for (var n, r = 0; null != (n = this[r]); r++)(!e || Y.filter(e, [n]).length) && (!t && 1 === n.nodeType && (Y.cleanData(n.getElementsByTagName("*")), Y.cleanData([n])), n.parentNode && n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++)
                    for (1 === e.nodeType && Y.cleanData(e.getElementsByTagName("*")); e.firstChild;) e.removeChild(e.firstChild);
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                    return Y.clone(this, e, t)
                })
            },
            html: function(e) {
                return Y.access(this, function(e) {
                    var n = this[0] || {},
                        r = 0,
                        i = this.length;
                    if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(Ft, "") : t;
                    if (!("string" != typeof e || Ut.test(e) || !Y.support.htmlSerialize && Jt.test(e) || !Y.support.leadingWhitespace && It.test(e) || Zt[(zt.exec(e) || ["", ""])[1].toLowerCase()])) {
                        e = e.replace(Bt, "<$1></$2>");
                        try {
                            for (; i > r; r++) n = this[r] || {}, 1 === n.nodeType && (Y.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
                            n = 0
                        } catch (o) {}
                    }
                    n && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function(e) {
                return s(this[0]) ? this.length ? this.pushStack(Y(Y.isFunction(e) ? e() : e), "replaceWith", e) : this : Y.isFunction(e) ? this.each(function(t) {
                    var n = Y(this),
                        r = n.html();
                    n.replaceWith(e.call(this, t, r))
                }) : ("string" != typeof e && (e = Y(e).detach()), this.each(function() {
                    var t = this.nextSibling,
                        n = this.parentNode;
                    Y(this).remove(), t ? Y(t).before(e) : Y(n).append(e)
                }))
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, n, r) {
                e = [].concat.apply([], e);
                var i, o, a, s, l = 0,
                    u = e[0],
                    c = [],
                    h = this.length;
                if (!Y.support.checkClone && h > 1 && "string" == typeof u && Gt.test(u)) return this.each(function() {
                    Y(this).domManip(e, n, r)
                });
                if (Y.isFunction(u)) return this.each(function(i) {
                    var o = Y(this);
                    e[0] = u.call(this, i, n ? o.html() : t), o.domManip(e, n, r)
                });
                if (this[0]) {
                    if (i = Y.buildFragment(e, this, c), a = i.fragment, o = a.firstChild, 1 === a.childNodes.length && (a = o), o)
                        for (n = n && Y.nodeName(o, "tr"), s = i.cacheable || h - 1; h > l; l++) r.call(n && Y.nodeName(this[l], "table") ? p(this[l], "tbody") : this[l], l === s ? a : Y.clone(a, !0, !0));
                    a = o = null, c.length && Y.each(c, function(e, t) {
                        t.src ? Y.ajax ? Y.ajax({
                            url: t.src,
                            type: "GET",
                            dataType: "script",
                            async: !1,
                            global: !1,
                            "throws": !0
                        }) : Y.error("no ajax") : Y.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Yt, "")), t.parentNode && t.parentNode.removeChild(t)
                    })
                }
                return this
            }
        }), Y.buildFragment = function(e, n, r) {
            var i, o, a, s = e[0];
            return n = n || I, n = (n[0] || n).ownerDocument || n[0] || n, "undefined" == typeof n.createDocumentFragment && (n = I), 1 === e.length && "string" == typeof s && s.length < 512 && n === I && "<" === s.charAt(0) && !Xt.test(s) && (Y.support.checkClone || !Gt.test(s)) && (Y.support.html5Clone || !Jt.test(s)) && (o = !0, i = Y.fragments[s], a = i !== t), i || (i = n.createDocumentFragment(), Y.clean(e, n, i, r), o && (Y.fragments[s] = a && i)), {
                fragment: i,
                cacheable: o
            }
        }, Y.fragments = {}, Y.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            Y.fn[e] = function(n) {
                var r, i = 0,
                    o = [],
                    a = Y(n),
                    s = a.length,
                    l = 1 === this.length && this[0].parentNode;
                if ((null == l || l && 11 === l.nodeType && 1 === l.childNodes.length) && 1 === s) return a[t](this[0]), this;
                for (; s > i; i++) r = (i > 0 ? this.clone(!0) : this).get(), Y(a[i])[t](r), o = o.concat(r);
                return this.pushStack(o, e, a.selector)
            }
        }), Y.extend({
            clone: function(e, t, n) {
                var r, i, o, a;
                if (Y.support.html5Clone || Y.isXMLDoc(e) || !Jt.test("<" + e.nodeName + ">") ? a = e.cloneNode(!0) : (tn.innerHTML = e.outerHTML, tn.removeChild(a = tn.firstChild)), !(Y.support.noCloneEvent && Y.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Y.isXMLDoc(e)))
                    for (d(e, a), r = f(e), i = f(a), o = 0; r[o]; ++o) i[o] && d(r[o], i[o]);
                if (t && (h(e, a), n))
                    for (r = f(e), i = f(a), o = 0; r[o]; ++o) h(r[o], i[o]);
                return r = i = null, a
            },
            clean: function(e, t, n, r) {
                var i, o, a, s, l, u, p, h, d, f, g, y = 0,
                    v = [];
                for (t && "undefined" != typeof t.createDocumentFragment || (t = I), o = t === I && en; null != (a = e[y]); y++)
                    if ("number" == typeof a && (a += ""), a) {
                        if ("string" == typeof a)
                            if (Vt.test(a)) {
                                for (o = o || c(t), p = p || o.appendChild(t.createElement("div")), a = a.replace(Bt, "<$1></$2>"), s = (zt.exec(a) || ["", ""])[1].toLowerCase(), l = Zt[s] || Zt._default, u = l[0], p.innerHTML = l[1] + a + l[2]; u--;) p = p.lastChild;
                                if (!Y.support.tbody)
                                    for (h = Wt.test(a), d = "table" !== s || h ? "<table>" !== l[1] || h ? [] : p.childNodes : p.firstChild && p.firstChild.childNodes, i = d.length - 1; i >= 0; --i) Y.nodeName(d[i], "tbody") && !d[i].childNodes.length && d[i].parentNode.removeChild(d[i]);
                                !Y.support.leadingWhitespace && It.test(a) && p.insertBefore(t.createTextNode(It.exec(a)[0]), p.firstChild), a = p.childNodes, p = o.lastChild
                            } else a = t.createTextNode(a);
                        a.nodeType ? v.push(a) : v = Y.merge(v, a)
                    }
                if (p && (o.removeChild(p), a = p = o = null), !Y.support.appendChecked)
                    for (y = 0; null != (a = v[y]); y++) Y.nodeName(a, "input") ? m(a) : "undefined" != typeof a.getElementsByTagName && Y.grep(a.getElementsByTagName("input"), m);
                if (n)
                    for (f = function(e) {
                        return !e.type || Kt.test(e.type) ? r ? r.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e) : void 0
                    }, y = 0; null != (a = v[y]); y++) Y.nodeName(a, "script") && f(a) || (n.appendChild(a), "undefined" != typeof a.getElementsByTagName && (g = Y.grep(Y.merge([], a.getElementsByTagName("script")), f), v.splice.apply(v, [y + 1, 0].concat(g)), y += g.length));
                return v
            },
            cleanData: function(e, t) {
                for (var n, r, i, o, a = 0, s = Y.expando, l = Y.cache, u = Y.support.deleteExpando, c = Y.event.special; null != (i = e[a]); a++)
                    if ((t || Y.acceptData(i)) && (r = i[s], n = r && l[r])) {
                        if (n.events)
                            for (o in n.events) c[o] ? Y.event.remove(i, o) : Y.removeEvent(i, o, n.handle);
                        l[r] && (delete l[r], u ? delete i[s] : i.removeAttribute ? i.removeAttribute(s) : i[s] = null, Y.deletedIds.push(r))
                    }
            }
        }),
            function() {
                var e, t;
                Y.uaMatch = function(e) {
                    e = e.toLowerCase();
                    var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
                    return {
                        browser: t[1] || "",
                        version: t[2] || "0"
                    }
                }, e = Y.uaMatch(z.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), t.webkit && (t.safari = !0), Y.browser = t, Y.sub = function() {
                    function e(t, n) {
                        return new e.fn.init(t, n)
                    }
                    Y.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function n(n, r) {
                        return r && r instanceof Y && !(r instanceof e) && (r = e(r)), Y.fn.init.call(this, n, r, t)
                    }, e.fn.init.prototype = e.fn;
                    var t = e(I);
                    return e
                }
            }();
        var nn, rn, on, an = /alpha\([^)]*\)/i,
            sn = /opacity=([^)]*)/,
            ln = /^(top|right|bottom|left)$/,
            un = /^margin/,
            cn = new RegExp("^(" + Z + ")(.*)$", "i"),
            pn = new RegExp("^(" + Z + ")(?!px)[a-z%]+$", "i"),
            hn = new RegExp("^([-+])=(" + Z + ")", "i"),
            dn = {},
            fn = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            mn = {
                letterSpacing: 0,
                fontWeight: 400,
                lineHeight: 1
            },
            gn = ["Top", "Right", "Bottom", "Left"],
            yn = ["Webkit", "O", "Moz", "ms"],
            vn = Y.fn.toggle;
        Y.fn.extend({
            css: function(e, n) {
                return Y.access(this, function(e, n, r) {
                    return r !== t ? Y.style(e, n, r) : Y.css(e, n)
                }, e, n, arguments.length > 1)
            },
            show: function() {
                return v(this, !0)
            },
            hide: function() {
                return v(this)
            },
            toggle: function(e, t) {
                var n = "boolean" == typeof e;
                return Y.isFunction(e) && Y.isFunction(t) ? vn.apply(this, arguments) : this.each(function() {
                    (n ? e : y(this)) ? Y(this).show(): Y(this).hide()
                })
            }
        }), Y.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = nn(e, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": Y.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(e, n, r, i) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o, a, s, l = Y.camelCase(n),
                        u = e.style;
                    if (n = Y.cssProps[l] || (Y.cssProps[l] = g(u, l)), s = Y.cssHooks[n] || Y.cssHooks[l], r === t) return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n];
                    if (a = typeof r, "string" === a && (o = hn.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(Y.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" === a && !Y.cssNumber[l] && (r += "px"), s && "set" in s && (r = s.set(e, r, i)) === t))) try {
                        u[n] = r
                    } catch (c) {}
                }
            },
            css: function(e, n, r, i) {
                var o, a, s, l = Y.camelCase(n);
                return n = Y.cssProps[l] || (Y.cssProps[l] = g(e.style, l)), s = Y.cssHooks[n] || Y.cssHooks[l], s && "get" in s && (o = s.get(e, !0, i)), o === t && (o = nn(e, n)), "normal" === o && n in mn && (o = mn[n]), r || i !== t ? (a = parseFloat(o), r || Y.isNumeric(a) ? a || 0 : o) : o
            },
            swap: function(e, t, n) {
                var r, i, o = {};
                for (i in t) o[i] = e.style[i], e.style[i] = t[i];
                r = n.call(e);
                for (i in t) e.style[i] = o[i];
                return r
            }
        }), e.getComputedStyle ? nn = function(e, t) {
            var n, r, i, o, a = getComputedStyle(e, null),
                s = e.style;
            return a && (n = a[t], "" === n && !Y.contains(e.ownerDocument.documentElement, e) && (n = Y.style(e, t)), pn.test(n) && un.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = n, n = a.width, s.width = r, s.minWidth = i, s.maxWidth = o)), n
        } : I.documentElement.currentStyle && (nn = function(e, t) {
            var n, r, i = e.currentStyle && e.currentStyle[t],
                o = e.style;
            return null == i && o && o[t] && (i = o[t]), pn.test(i) && !ln.test(t) && (n = o.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), o.left = "fontSize" === t ? "1em" : i, i = o.pixelLeft + "px", o.left = n, r && (e.runtimeStyle.left = r)), "" === i ? "auto" : i
        }), Y.each(["height", "width"], function(e, t) {
            Y.cssHooks[t] = {
                get: function(e, n, r) {
                    return n ? 0 !== e.offsetWidth || "none" !== nn(e, "display") ? w(e, t, r) : Y.swap(e, fn, function() {
                        return w(e, t, r)
                    }) : void 0
                },
                set: function(e, n, r) {
                    return b(e, n, r ? x(e, t, r, Y.support.boxSizing && "border-box" === Y.css(e, "boxSizing")) : 0)
                }
            }
        }), Y.support.opacity || (Y.cssHooks.opacity = {
            get: function(e, t) {
                return sn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
            },
            set: function(e, t) {
                var n = e.style,
                    r = e.currentStyle,
                    i = Y.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                    o = r && r.filter || n.filter || "";
                n.zoom = 1, t >= 1 && "" === Y.trim(o.replace(an, "")) && n.removeAttribute && (n.removeAttribute("filter"), r && !r.filter) || (n.filter = an.test(o) ? o.replace(an, i) : o + " " + i)
            }
        }), Y(function() {
            Y.support.reliableMarginRight || (Y.cssHooks.marginRight = {
                get: function(e, t) {
                    return Y.swap(e, {
                        display: "inline-block"
                    }, function() {
                        return t ? nn(e, "marginRight") : void 0
                    })
                }
            }), !Y.support.pixelPosition && Y.fn.position && Y.each(["top", "left"], function(e, t) {
                Y.cssHooks[t] = {
                    get: function(e, n) {
                        if (n) {
                            var r = nn(e, t);
                            return pn.test(r) ? Y(e).position()[t] + "px" : r
                        }
                    }
                }
            })
        }), Y.expr && Y.expr.filters && (Y.expr.filters.hidden = function(e) {
            return 0 === e.offsetWidth && 0 === e.offsetHeight || !Y.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || nn(e, "display"))
        }, Y.expr.filters.visible = function(e) {
            return !Y.expr.filters.hidden(e)
        }), Y.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            Y.cssHooks[e + t] = {
                expand: function(n) {
                    var r, i = "string" == typeof n ? n.split(" ") : [n],
                        o = {};
                    for (r = 0; 4 > r; r++) o[e + gn[r] + t] = i[r] || i[r - 2] || i[0];
                    return o
                }
            }, un.test(e) || (Y.cssHooks[e + t].set = b)
        });
        var bn = /%20/g,
            xn = /\[\]$/,
            wn = /\r?\n/g,
            Sn = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            kn = /^(?:select|textarea)/i;
        Y.fn.extend({
            serialize: function() {
                return Y.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    return this.elements ? Y.makeArray(this.elements) : this
                }).filter(function() {
                    return this.name && !this.disabled && (this.checked || kn.test(this.nodeName) || Sn.test(this.type))
                }).map(function(e, t) {
                    var n = Y(this).val();
                    return null == n ? null : Y.isArray(n) ? Y.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(wn, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(wn, "\r\n")
                    }
                }).get()
            }
        }), Y.param = function(e, n) {
            var r, i = [],
                o = function(e, t) {
                    t = Y.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            if (n === t && (n = Y.ajaxSettings && Y.ajaxSettings.traditional), Y.isArray(e) || e.jquery && !Y.isPlainObject(e)) Y.each(e, function() {
                o(this.name, this.value)
            });
            else
                for (r in e) k(r, e[r], n, o);
            return i.join("&").replace(bn, "+")
        };
        var Tn, En, Cn = /#.*$/,
            Nn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            _n = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
            An = /^(?:GET|HEAD)$/,
            jn = /^\/\//,
            Hn = /\?/,
            Ln = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            Dn = /([?&])_=[^&]*/,
            On = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
            qn = Y.fn.load,
            Rn = {},
            Pn = {},
            Mn = ["*/"] + ["*"];
        try {
            Tn = B.href
        } catch ($n) {
            Tn = I.createElement("a"), Tn.href = "", Tn = Tn.href
        }
        En = On.exec(Tn.toLowerCase()) || [], Y.fn.load = function(e, n, r) {
            if ("string" != typeof e && qn) return qn.apply(this, arguments);
            if (!this.length) return this;
            var i, o, a, s = this,
                l = e.indexOf(" ");
            return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), Y.isFunction(n) ? (r = n, n = t) : "object" == typeof n && (o = "POST"), Y.ajax({
                url: e,
                type: o,
                dataType: "html",
                data: n,
                complete: function(e, t) {
                    r && s.each(r, a || [e.responseText, t, e])
                }
            }).done(function(e) {
                a = arguments, s.html(i ? Y("<div>").append(e.replace(Ln, "")).find(i) : e)
            }), this
        }, Y.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
            Y.fn[t] = function(e) {
                return this.on(t, e)
            }
        }), Y.each(["get", "post"], function(e, n) {
            Y[n] = function(e, r, i, o) {
                return Y.isFunction(r) && (o = o || i, i = r, r = t), Y.ajax({
                    type: n,
                    url: e,
                    data: r,
                    success: i,
                    dataType: o
                })
            }
        }), Y.extend({
            getScript: function(e, n) {
                return Y.get(e, t, n, "script")
            },
            getJSON: function(e, t, n) {
                return Y.get(e, t, n, "json")
            },
            ajaxSetup: function(e, t) {
                return t ? C(e, Y.ajaxSettings) : (t = e, e = Y.ajaxSettings), C(e, t), e
            },
            ajaxSettings: {
                url: Tn,
                isLocal: _n.test(En[1]),
                global: !0,
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: !0,
                async: !0,
                accepts: {
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    text: "text/plain",
                    json: "application/json, text/javascript",
                    "*": Mn
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText"
                },
                converters: {
                    "* text": e.String,
                    "text html": !0,
                    "text json": Y.parseJSON,
                    "text xml": Y.parseXML
                },
                flatOptions: {
                    context: !0,
                    url: !0
                }
            },
            ajaxPrefilter: T(Rn),
            ajaxTransport: T(Pn),
            ajax: function(e, n) {
                function r(e, n, r, a) {
                    var u, p, v, b, w, k = n;
                    2 !== x && (x = 2, l && clearTimeout(l), s = t, o = a || "", S.readyState = e > 0 ? 4 : 0, r && (b = N(h, S, r)), e >= 200 && 300 > e || 304 === e ? (h.ifModified && (w = S.getResponseHeader("Last-Modified"), w && (Y.lastModified[i] = w), w = S.getResponseHeader("Etag"), w && (Y.etag[i] = w)), 304 === e ? (k = "notmodified", u = !0) : (u = _(h, b), k = u.state, p = u.data, v = u.error, u = !v)) : (v = k, (!k || e) && (k = "error", 0 > e && (e = 0))), S.status = e, S.statusText = "" + (n || k), u ? m.resolveWith(d, [p, k, S]) : m.rejectWith(d, [S, k, v]), S.statusCode(y), y = t, c && f.trigger("ajax" + (u ? "Success" : "Error"), [S, h, u ? p : v]), g.fireWith(d, [S, k]), c && (f.trigger("ajaxComplete", [S, h]), --Y.active || Y.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (n = e, e = t), n = n || {};
                var i, o, a, s, l, u, c, p, h = Y.ajaxSetup({}, n),
                    d = h.context || h,
                    f = d !== h && (d.nodeType || d instanceof Y) ? Y(d) : Y.event,
                    m = Y.Deferred(),
                    g = Y.Callbacks("once memory"),
                    y = h.statusCode || {},
                    v = {},
                    b = {},
                    x = 0,
                    w = "canceled",
                    S = {
                        readyState: 0,
                        setRequestHeader: function(e, t) {
                            if (!x) {
                                var n = e.toLowerCase();
                                e = b[n] = b[n] || e, v[e] = t
                            }
                            return this
                        },
                        getAllResponseHeaders: function() {
                            return 2 === x ? o : null
                        },
                        getResponseHeader: function(e) {
                            var n;
                            if (2 === x) {
                                if (!a)
                                    for (a = {}; n = Nn.exec(o);) a[n[1].toLowerCase()] = n[2];
                                n = a[e.toLowerCase()]
                            }
                            return n === t ? null : n
                        },
                        overrideMimeType: function(e) {
                            return x || (h.mimeType = e), this
                        },
                        abort: function(e) {
                            return e = e || w, s && s.abort(e), r(0, e), this
                        }
                    };
                if (m.promise(S), S.success = S.done, S.error = S.fail, S.complete = g.add, S.statusCode = function(e) {
                        if (e) {
                            var t;
                            if (2 > x)
                                for (t in e) y[t] = [y[t], e[t]];
                            else t = e[S.status], S.always(t)
                        }
                        return this
                    }, h.url = ((e || h.url) + "").replace(Cn, "").replace(jn, En[1] + "//"), h.dataTypes = Y.trim(h.dataType || "*").toLowerCase().split(tt), null == h.crossDomain && (u = On.exec(h.url.toLowerCase()), h.crossDomain = !(!u || u[1] == En[1] && u[2] == En[2] && (u[3] || ("http:" === u[1] ? 80 : 443)) == (En[3] || ("http:" === En[1] ? 80 : 443)))), h.data && h.processData && "string" != typeof h.data && (h.data = Y.param(h.data, h.traditional)), E(Rn, h, n, S), 2 === x) return S;
                if (c = h.global, h.type = h.type.toUpperCase(), h.hasContent = !An.test(h.type), c && 0 === Y.active++ && Y.event.trigger("ajaxStart"), !h.hasContent && (h.data && (h.url += (Hn.test(h.url) ? "&" : "?") + h.data, delete h.data), i = h.url, h.cache === !1)) {
                    var k = Y.now(),
                        T = h.url.replace(Dn, "$1_=" + k);
                    h.url = T + (T === h.url ? (Hn.test(h.url) ? "&" : "?") + "_=" + k : "")
                }(h.data && h.hasContent && h.contentType !== !1 || n.contentType) && S.setRequestHeader("Content-Type", h.contentType), h.ifModified && (i = i || h.url, Y.lastModified[i] && S.setRequestHeader("If-Modified-Since", Y.lastModified[i]), Y.etag[i] && S.setRequestHeader("If-None-Match", Y.etag[i])), S.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Mn + "; q=0.01" : "") : h.accepts["*"]);
                for (p in h.headers) S.setRequestHeader(p, h.headers[p]);
                if (!h.beforeSend || h.beforeSend.call(d, S, h) !== !1 && 2 !== x) {
                    w = "abort";
                    for (p in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) S[p](h[p]);
                    if (s = E(Pn, h, n, S)) {
                        S.readyState = 1, c && f.trigger("ajaxSend", [S, h]), h.async && h.timeout > 0 && (l = setTimeout(function() {
                            S.abort("timeout")
                        }, h.timeout));
                        try {
                            x = 1, s.send(v, r)
                        } catch (C) {
                            if (!(2 > x)) throw C;
                            r(-1, C)
                        }
                    } else r(-1, "No Transport");
                    return S
                }
                return S.abort()
            },
            active: 0,
            lastModified: {},
            etag: {}
        });
        var Fn = [],
            In = /\?/,
            Bn = /(=)\?(?=&|$)|\?\?/,
            zn = Y.now();
        Y.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = Fn.pop() || Y.expando + "_" + zn++;
                return this[e] = !0, e
            }
        }), Y.ajaxPrefilter("json jsonp", function(n, r, i) {
            var o, a, s, l = n.data,
                u = n.url,
                c = n.jsonp !== !1,
                p = c && Bn.test(u),
                h = c && !p && "string" == typeof l && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(l);
            return "jsonp" === n.dataTypes[0] || p || h ? (o = n.jsonpCallback = Y.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, a = e[o], p ? n.url = u.replace(Bn, "$1" + o) : h ? n.data = l.replace(Bn, "$1" + o) : c && (n.url += (In.test(u) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function() {
                return s || Y.error(o + " was not called"), s[0]
            }, n.dataTypes[0] = "json", e[o] = function() {
                s = arguments
            }, i.always(function() {
                e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && Y.isFunction(a) && a(s[0]), s = a = t
            }), "script") : void 0
        }), Y.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /javascript|ecmascript/
            },
            converters: {
                "text script": function(e) {
                    return Y.globalEval(e), e
                }
            }
        }), Y.ajaxPrefilter("script", function(e) {
            e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
        }), Y.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var n, r = I.head || I.getElementsByTagName("head")[0] || I.documentElement;
                return {
                    send: function(i, o) {
                        n = I.createElement("script"), n.async = "async", e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, i) {
                            (i || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, r && n.parentNode && r.removeChild(n), n = t, i || o(200, "success"))
                        }, r.insertBefore(n, r.firstChild)
                    },
                    abort: function() {
                        n && n.onload(0, 1)
                    }
                }
            }
        });
        var Wn, Vn = e.ActiveXObject ? function() {
                for (var e in Wn) Wn[e](0, 1)
            } : !1,
            Un = 0;
        Y.ajaxSettings.xhr = e.ActiveXObject ? function() {
            return !this.isLocal && A() || j()
        } : A,
            function(e) {
                Y.extend(Y.support, {
                    ajax: !!e,
                    cors: !!e && "withCredentials" in e
                })
            }(Y.ajaxSettings.xhr()), Y.support.ajax && Y.ajaxTransport(function(n) {
            if (!n.crossDomain || Y.support.cors) {
                var r;
                return {
                    send: function(i, o) {
                        var a, s, l = n.xhr();
                        if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)
                            for (s in n.xhrFields) l[s] = n.xhrFields[s];
                        n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (s in i) l.setRequestHeader(s, i[s])
                        } catch (u) {}
                        l.send(n.hasContent && n.data || null), r = function(e, i) {
                            var s, u, c, p, h;
                            try {
                                if (r && (i || 4 === l.readyState))
                                    if (r = t, a && (l.onreadystatechange = Y.noop, Vn && delete Wn[a]), i) 4 !== l.readyState && l.abort();
                                    else {
                                        s = l.status, c = l.getAllResponseHeaders(), p = {}, h = l.responseXML, h && h.documentElement && (p.xml = h);
                                        try {
                                            p.text = l.responseText
                                        } catch (e) {}
                                        try {
                                            u = l.statusText
                                        } catch (d) {
                                            u = ""
                                        }
                                        s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404
                                    }
                            } catch (f) {
                                i || o(-1, f)
                            }
                            p && o(s, u, p, c)
                        }, n.async ? 4 === l.readyState ? setTimeout(r, 0) : (a = ++Un, Vn && (Wn || (Wn = {}, Y(e).unload(Vn)), Wn[a] = r), l.onreadystatechange = r) : r()
                    },
                    abort: function() {
                        r && r(0, 1)
                    }
                }
            }
        });
        var Xn, Jn, Qn = /^(?:toggle|show|hide)$/,
            Gn = new RegExp("^(?:([-+])=|)(" + Z + ")([a-z%]*)$", "i"),
            Kn = /queueHooks$/,
            Yn = [q],
            Zn = {
                "*": [function(e, t) {
                    var n, r, i, o = this.createTween(e, t),
                        a = Gn.exec(t),
                        s = o.cur(),
                        l = +s || 0,
                        u = 1;
                    if (a) {
                        if (n = +a[2], r = a[3] || (Y.cssNumber[e] ? "" : "px"), "px" !== r && l) {
                            l = Y.css(o.elem, e, !0) || n || 1;
                            do i = u = u || ".5", l /= u, Y.style(o.elem, e, l + r), u = o.cur() / s; while (1 !== u && u !== i)
                        }
                        o.unit = r, o.start = l, o.end = a[1] ? l + (a[1] + 1) * n : n
                    }
                    return o
                }]
            };
        Y.Animation = Y.extend(D, {
            tweener: function(e, t) {
                Y.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var n, r = 0, i = e.length; i > r; r++) n = e[r], Zn[n] = Zn[n] || [], Zn[n].unshift(t)
            },
            prefilter: function(e, t) {
                t ? Yn.unshift(e) : Yn.push(e)
            }
        }), Y.Tween = R, R.prototype = {
            constructor: R,
            init: function(e, t, n, r, i, o) {
                this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (Y.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = R.propHooks[this.prop];
                return e && e.get ? e.get(this) : R.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = R.propHooks[this.prop];
                return this.pos = t = Y.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration), this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : R.propHooks._default.set(this), this
            }
        }, R.prototype.init.prototype = R.prototype, R.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Y.css(e.elem, e.prop, !1, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                },
                set: function(e) {
                    Y.fx.step[e.prop] ? Y.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Y.cssProps[e.prop]] || Y.cssHooks[e.prop]) ? Y.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        }, R.propHooks.scrollTop = R.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, Y.each(["toggle", "show", "hide"], function(e, t) {
            var n = Y.fn[t];
            Y.fn[t] = function(r, i, o) {
                return null == r || "boolean" == typeof r || !e && Y.isFunction(r) && Y.isFunction(i) ? n.apply(this, arguments) : this.animate(P(t, !0), r, i, o)
            }
        }), Y.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(y).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r)
            },
            animate: function(e, t, n, r) {
                var i = Y.isEmptyObject(e),
                    o = Y.speed(t, n, r),
                    a = function() {
                        var t = D(this, Y.extend({}, e), o);
                        i && t.stop(!0)
                    };
                return i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
            },
            stop: function(e, n, r) {
                var i = function(e) {
                    var t = e.stop;
                    delete e.stop, t(r)
                };
                return "string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        n = null != e && e + "queueHooks",
                        o = Y.timers,
                        a = Y._data(this);
                    if (n) a[n] && a[n].stop && i(a[n]);
                    else
                        for (n in a) a[n] && a[n].stop && Kn.test(n) && i(a[n]);
                    for (n = o.length; n--;) o[n].elem === this && (null == e || o[n].queue === e) && (o[n].anim.stop(r), t = !1, o.splice(n, 1));
                    (t || !r) && Y.dequeue(this, e)
                })
            }
        }), Y.each({
            slideDown: P("show"),
            slideUp: P("hide"),
            slideToggle: P("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            Y.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r)
            }
        }), Y.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? Y.extend({}, e) : {
                complete: n || !n && t || Y.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !Y.isFunction(t) && t
            };
            return r.duration = Y.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in Y.fx.speeds ? Y.fx.speeds[r.duration] : Y.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                Y.isFunction(r.old) && r.old.call(this), r.queue && Y.dequeue(this, r.queue)
            }, r
        }, Y.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        }, Y.timers = [], Y.fx = R.prototype.init, Y.fx.tick = function() {
            for (var e, t = Y.timers, n = 0; n < t.length; n++) e = t[n], !e() && t[n] === e && t.splice(n--, 1);
            t.length || Y.fx.stop()
        }, Y.fx.timer = function(e) {
            e() && Y.timers.push(e) && !Jn && (Jn = setInterval(Y.fx.tick, Y.fx.interval))
        }, Y.fx.interval = 13, Y.fx.stop = function() {
            clearInterval(Jn), Jn = null
        }, Y.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, Y.fx.step = {}, Y.expr && Y.expr.filters && (Y.expr.filters.animated = function(e) {
            return Y.grep(Y.timers, function(t) {
                return e === t.elem
            }).length
        });
        var er = /^(?:body|html)$/i;
        Y.fn.offset = function(e) {
            if (arguments.length) return e === t ? this : this.each(function(t) {
                Y.offset.setOffset(this, e, t)
            });
            var n, r, i, o, a, s, l, u, c, p, h = this[0],
                d = h && h.ownerDocument;
            if (d) return (i = d.body) === h ? Y.offset.bodyOffset(h) : (r = d.documentElement, Y.contains(r, h) ? (n = h.getBoundingClientRect(), o = M(d), a = r.clientTop || i.clientTop || 0, s = r.clientLeft || i.clientLeft || 0, l = o.pageYOffset || r.scrollTop, u = o.pageXOffset || r.scrollLeft, c = n.top + l - a, p = n.left + u - s, {
                top: c,
                left: p
            }) : {
                top: 0,
                left: 0
            })
        }, Y.offset = {
            bodyOffset: function(e) {
                var t = e.offsetTop,
                    n = e.offsetLeft;
                return Y.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(Y.css(e, "marginTop")) || 0, n += parseFloat(Y.css(e, "marginLeft")) || 0), {
                    top: t,
                    left: n
                }
            },
            setOffset: function(e, t, n) {
                var r = Y.css(e, "position");
                "static" === r && (e.style.position = "relative");
                var i, o, a = Y(e),
                    s = a.offset(),
                    l = Y.css(e, "top"),
                    u = Y.css(e, "left"),
                    c = ("absolute" === r || "fixed" === r) && Y.inArray("auto", [l, u]) > -1,
                    p = {},
                    h = {};
                c ? (h = a.position(), i = h.top, o = h.left) : (i = parseFloat(l) || 0, o = parseFloat(u) || 0), Y.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (p.top = t.top - s.top + i), null != t.left && (p.left = t.left - s.left + o), "using" in t ? t.using.call(e, p) : a.css(p)
            }
        }, Y.fn.extend({
            position: function() {
                if (this[0]) {
                    var e = this[0],
                        t = this.offsetParent(),
                        n = this.offset(),
                        r = er.test(t[0].nodeName) ? {
                            top: 0,
                            left: 0
                        } : t.offset();
                    return n.top -= parseFloat(Y.css(e, "marginTop")) || 0, n.left -= parseFloat(Y.css(e, "marginLeft")) || 0, r.top += parseFloat(Y.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(Y.css(t[0], "borderLeftWidth")) || 0, {
                        top: n.top - r.top,
                        left: n.left - r.left
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent || I.body; e && !er.test(e.nodeName) && "static" === Y.css(e, "position");) e = e.offsetParent;
                    return e || I.body
                })
            }
        }), Y.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, n) {
            var r = /Y/.test(n);
            Y.fn[e] = function(i) {
                return Y.access(this, function(e, i, o) {
                    var a = M(e);
                    return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : void(a ? a.scrollTo(r ? Y(a).scrollLeft() : o, r ? o : Y(a).scrollTop()) : e[i] = o)
                }, e, i, arguments.length, null)
            }
        }), Y.each({
            Height: "height",
            Width: "width"
        }, function(e, n) {
            Y.each({
                padding: "inner" + e,
                content: n,
                "": "outer" + e
            }, function(r, i) {
                Y.fn[i] = function(i, o) {
                    var a = arguments.length && (r || "boolean" != typeof i),
                        s = r || (i === !0 || o === !0 ? "margin" : "border");
                    return Y.access(this, function(n, r, i) {
                        var o;
                        return Y.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? Y.css(n, r, i, s) : Y.style(n, r, i, s)
                    }, n, a ? i : t, a)
                }
            })
        }), e.jQuery = e.$ = Y, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
            return Y
        })
    }(window);