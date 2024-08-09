# 线段树基础

## 咕咕咕

## 例题

```cpp
using ll = long long;
constexpr ll mod = 998244353;
constexpr int root = 1;
```

### 例题一：P3372 线段树 1

??? note "点击查看代码"
    ```cpp
    class seg_t {

    private:

    struct emm {
        int l, r;
        ll v, lz;
    };

    int n; vector<emm> a;

    void pushup(int k) {
        a[k].v = a[k * 2].v + a[k * 2 + 1].v;
    }

    void run(int k, ll v) {
        a[k].lz += v;
        a[k].v += v * (a[k].r - a[k].l + 1);
    }

    void pushdown(int k) {
        if (!a[k].lz) return;
        run(k * 2, a[k].lz);
        run(k * 2 + 1, a[k].lz);
        a[k].lz = 0;
    }

    void build(vector<ll> &q, int k, int l, int r) {
        a[k].lz = 0, a[k].l = l, a[k].r = r;
        if (l == r) { a[k].v = q[l]; return; }
        int mid = l + (r - l >> 1);
        build(q, k * 2, l, mid);
        build(q, k * 2 + 1, mid + 1, r);
        pushup(k);
    }

    void modify(int k, const int p, const int q, const ll v) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) { run(k, v); return; }
        pushdown(k);
        int mid = l + (r - l >> 1);
        if (mid >= p) modify(k * 2, p, q, v);
        if (mid + 1 <= q) modify(k * 2 + 1, p, q, v);
        pushup(k);
    }

    ll query(int k, const int p, const int q) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) return a[k].v;
        pushdown(k);
        int mid = l + (r - l >> 1); ll res = 0;
        if (mid >= p) res += query(k * 2, p, q);
        if (mid + 1 <= q) res += query(k * 2 + 1, p, q);
        return res;
    }

    public:

    seg_t(vector<ll> &q) { n = q.size(), a.resize(4 * n); build(q, 1, 1, n); }
    void add(int l, int r, ll v) { modify(1, l, r, v); }
    ll sum(int l, int r) { return query(1, l, r); }

    };
    ```

### 例题二：P3373 线段树 2

??? note "点击查看代码"
    ```cpp
    class seg_t {

    private:

    struct emm {
        int l, r;
        ll v, ad, ml;
    };

    int n; vector<emm> a;

    void push_up(int k) {
        (a[k].v = a[k * 2].v + a[k * 2 + 1].v) %= mod;
    }

    void action_add(int k, ll t) {
        (a[k].ad += t) %= mod;
        (a[k].v += t * (a[k].r - a[k].l + 1) % mod) %= mod;
    }

    void action_mul(int k, ll t) {
        (a[k].v *= t) %= mod;
        (a[k].ad *= t) %= mod, (a[k].ml *= t) %= mod;
    }

    void push_down(int k) {
        if (a[k].ml != 1) {
            action_mul(k * 2, a[k].ml);
            action_mul(k * 2 + 1, a[k].ml);
            a[k].ml = 1;
        } if (a[k].ad) {
            action_add(k * 2, a[k].ad);
            action_add(k * 2 + 1, a[k].ad);
            a[k].ad = 0;
        }
    }

    void build(vector<ll> &q, int k, int l, int r) {
        a[k].l = l, a[k].r = r; a[k].ad = 0, a[k].ml = 1;
        if (l == r) { a[k].v = q[l]; return; }
        int mid = l + (r - l >> 1);
        build(q, k * 2, l, mid);
        build(q, k * 2 + 1, mid + 1, r);
        push_up(k);
    }

    ll query(int k, int p, int q) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) return a[k].v;
        push_down(k); int mid = l + (r - l >> 1);
        ll res = 0;
        if (mid >= p) res += query(k * 2, p, q);
        if (mid + 1 <= q) res += query(k * 2 + 1, p, q);
        return res % mod;
    }

    void modify_add(int k, int p, int q, ll v) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) { action_add(k, v); return; }
        push_down(k); int mid = l + (r - l >> 1);
        if (mid >= p) modify_add(k * 2, p, q, v);
        if (mid + 1 <= q) modify_add(k * 2 + 1, p, q, v);
        push_up(k);
    }

    void modify_mul(int k, int p, int q, ll v) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) { action_mul(k, v); return; }
        push_down(k); int mid = l + (r - l >> 1);
        if (mid >= p) modify_mul(k * 2, p, q, v);
        if (mid + 1 <= q) modify_mul(k * 2 + 1, p, q, v);
        push_up(k);
    }

    public:

    seg_t(vector<ll> &q) { n = q.size(); a.resize(n * 4); build(q, root, 1, n); }
    ll sum(int l, int r) { return query(root, l, r); }
    void add(int l, int r, ll v) { modify_add(root, l, r, v); }
    void mul(int l, int r, ll v) { modify_mul(root, l, r, v); }

    };
    ```

### 例题三：CF438D The Child and Sequence

取模的两个定理。一个是不取模，一个是取了小于一半。

??? note "点击查看代码"
    ```cpp
    class seg_t {

    private:

    struct emm {
        int l, r;
        ll v, mx;
    };

    int n; vector<emm> a;

    void push_up(int k) {
        a[k].v = a[k * 2].v + a[k * 2 + 1].v;
        a[k].mx = max(a[k * 2].mx, a[k * 2 + 1].mx);
    }

    void build(vector<ll> &q, int k, int l, int r) {
        a[k].l = l, a[k].r = r;
        if (l == r) { a[k].v = a[k].mx = q[l]; return; }
        int mid = l + (r - l >> 1);
        build(q, k * 2, l, mid);
        build(q, k * 2 + 1, mid + 1, r);
        push_up(k);
    }

    ll query(int k, int p, int q) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) return a[k].v;
        int mid = l + (r - l >> 1); ll res = 0;
        if (mid >= p) res += query(k * 2, p, q);
        if (mid + 1 <= q) res += query(k * 2 + 1, p, q);
        return res;
    }

    void modify(int k, int x, ll v) {
        auto &l = a[k].l, &r = a[k].r;
        if (l == r) { a[k].v = a[k].mx = v; return; }
        int mid = l + (r - l >> 1);
        if (x <= mid) modify(k * 2, x, v);
        else modify(k * 2 + 1, x, v);
        push_up(k);
    }

    void putmod(int k, int p, int q, ll m) {
        auto &l = a[k].l, &r = a[k].r;
        if (l == r) { a[k].v = a[k].mx = a[k].v % m; return; }
        int mid = l + (r - l >> 1);
        if (mid >= p && a[k * 2].mx >= m) putmod(k * 2, p, q, m);
        if (mid + 1 <= q && a[k * 2 + 1].mx >= m) putmod(k * 2 + 1, p, q, m);
        push_up(k);
    }

    public:

    seg_t(vector<ll> &q) { n = q.size(); a.resize(n * 4); build(q, root, 1, n); }
    ll sum(int l, int r) { return query(root, l, r); }
    void mod(int l, int r, ll x) { putmod(root, l, r, x); }
    void change(int k, ll x) { modify(root, k, x); }

    };
    ```

### 例题四：最大字段和 GSS 系列

SP1043 GSS1 & SP1716 GSS3 & SP2916 GSS5。

??? note "点击查看代码"
    ```cpp
    class seg_t {

    private:

    struct v_t {
        int prefix, suffix; int sum, res;
        void set(const int x) { prefix = suffix = sum = res = x; }
        friend v_t operator+ (const v_t &a, const v_t &b) {
            v_t res; res.sum = a.sum + b.sum;
            res.prefix = max(a.prefix, a.sum + b.prefix);
            res.suffix = max(b.suffix, b.sum + a.suffix);
            res.res = max(max(a.res, b.res), a.suffix + b.prefix);
            return res;
        }
    };

    struct emm { int l, r; v_t v; };

    int n; vector<emm> a;

    void push_up(int k) {
        a[k].v = a[k * 2].v + a[k * 2 + 1].v;
    }

    void build(vector<int> &q, int k, int l, int r) {
        a[k].l = l, a[k].r = r;
        if (l == r) { a[k].v.set(q[l]); return; }
        int mid = l + (r - l >> 1);
        build(q, k * 2, l, mid);
        build(q, k * 2 + 1, mid + 1, r);
        push_up(k);
    }

    void modify(int k, int x, int v) {
        auto &l = a[k].l, &r = a[k].r;
        if (l == r) { a[k].v.set(v); return; }
        int mid = l + (r - l >> 1);
        if (x <= mid) modify(k * 2, x, v);
        else modify(k * 2 + 1, x, v);
        push_up(k);
    }

    v_t query(int k, int p, int q) {
        auto &l = a[k].l, &r = a[k].r;
        if (l >= p && r <= q) return a[k].v;
        int mid = l + (r - l >> 1);
        if (mid < p) return query(k * 2 + 1, p, q);
        if (mid + 1 > q) return query(k * 2, p, q);
        return query(k * 2, p, q) + query(k * 2 + 1, p, q);
    }

    public:

    seg_t(vector<int> &q) { n = q.size(); a.resize(4 * n); build(q, root, 1, n); }
    int mis(int l, int r) { return query(root, l, r).res; }
    int sum(int l, int r) { return query(root, l, r).sum; }
    int pre(int l, int r) { return query(root, l, r).prefix; }
    int suf(int l, int r) { return query(root, l, r).suffix; }
    void change(int x, int v) { modify(root, x, v); }

    };

    void solve(int n) {
        vector<int> a(n + 1);
        rep(i, n) a[i + 1] = rr;
        int m = ur; seg_t seg(a);
        auto query = [&] (int l1, int r1, int l2, int r2) {
            if (l1 == r1 && r1 == r2) return seg.mis(l1, r2);
            if (r1 < l2) return seg.sum(r1 + 1, l2 - 1) + seg.suf(l1, r1) +
                                                        seg.pre(l2, r2);
            int ans = seg.mis(l2, r1);
            if(l1 < l2) ans = max(ans, seg.suf(l1, l2) + seg.pre(l2, r2) - a[l2]);
            if(r2 > r1) ans = max(ans, seg.suf(l1, r1) + seg.pre(r1, r2) - a[r1]);
            return ans;
        }; while (m--) {
            int l1 = ur, r1 = ur, l2 = ur, r2 = ur;
            printf("%d\n", query(l1, r1, l2, r2));
        }
    }
    ```

### 例题五：P1253 扶苏的问题

曾经写的代码。和现在的线段树风格不一样。

??? note "点击查看代码"
    ```cpp
    template<typename tp, tp INIT>
    class segment {
    #define mid ((l + r) >> 1)
    #define vp vector<tp>
    private:
        int n; vp s, mad, mre;
        void _build(int k, int l, int r, vp &a) {
            if (l == r) { s[k] = a[l]; return; }
            _build(k * 2, l, mid, a), _build(k * 2 + 1, mid + 1, r, a);
            s[k] = max(s[k * 2], s[k * 2 + 1]);
        } void _addmad(int k, tp x) {
            s[k] += x;
            if (mad[k] == -INIT) mad[k] = x;
            else mad[k] += x;
        } void _addmre(int k, tp x) {
            s[k] = mre[k] = x, mad[k] = -INIT;
        } void _pushdown(int k) {
            if (mre[k] != -INIT) _addmre(k * 2, mre[k]), _addmre(k * 2 + 1, mre[k]), mre[k] = -INIT;
            if (mad[k] != -INIT) _addmad(k * 2, mad[k]), _addmad(k * 2 + 1, mad[k]), mad[k] = -INIT;
        } void _add(int k, int l, int r, int p, int q, tp x) {
            if (r < p || l > q) return;
            if (l >= p && r <= q) { _addmad(k, x); return; }
            _pushdown(k); _add(k * 2, l, mid, p, q, x), _add(k * 2 + 1, mid + 1, r, p, q, x);
            s[k] = max(s[k * 2], s[k * 2 + 1]);
        } void _modify(int k, int l, int r, int p, int q, tp x) {
            if (r < p || l > q) return;
            if (l >= p && r <= q) { _addmre(k, x); return; }
            _pushdown(k); _modify(k * 2, l, mid, p, q, x), _modify(k * 2 + 1, mid + 1, r, p, q, x);
            s[k] = max(s[k * 2], s[k * 2 + 1]);
        } tp _query(int k, int l, int r, int p, int q) {
            if (l >= p && r <= q) return s[k];
            _pushdown(k);
            if (mid < p) return _query(k * 2 + 1, mid + 1, r, p, q);
            if (mid >= q) return _query(k * 2, l, mid, p, q);
            return max(_query(k * 2 + 1, mid + 1, r, p, q), _query(k * 2, l, mid, p, q));
        }
    public:
        void build(vp &a) {
            n = (int)a.size() - 1, s = mad = mre = vp(3 * n, -INIT), _build(1, 1, n, a);
        } void add(int l, int r, tp x) {
            _add(1, 1, n, l, r, x);
        } void modify(int l, int r, tp x) {
            _modify(1, 1, n, l, r, x);
        } tp query(int l, int r) {
            return _query(1, 1, n, l, r);
        }
    #undef mid
    #undef vp
    };
    ```
