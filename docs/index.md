# 简介

## 测试

```cpp
// Source: 洛谷
// Problem: P9753 [CSP-S 2023] 消消乐
// Algorithm:
// Memory Limit: 512 MB
// Time Limit: 1000 ms
// Author: RainPPR
// Datetime: 2024-08-09 10:13

#ifndef M_DEBUG
#define NDEBUG 1
#define FAST_IO 1

#define D(x) ({ void(0); })
#else
#define D(x) ({ auto t = (x); cerr << "| DEBUG #" << __LINE__ << " IN " << __FUNCTION__ << "() \t| \t" << #x << " = \t[" << t << "]\n"; void(0); })
#endif

#include <bits/stdc++.h>

#ifdef FAST_IO
#define endl "\n"
#endif

using namespace std;

// -----------------------------------------------------------------------------

using ll = long long;

ll qpow(ll a, ll b, ll p) {
	a %= p;
	ll r = 1;
	for (; b; b >>= 1) {
		if (b & 1)
			r = r * a % p;
		a = a * a % p;
	}
	return r;
}

ll inv(ll a, ll p) {
	a %= p;
	assert(a != 0);
	return qpow(a, p - 2, p);
}

template<const ll MOD>
struct mod_matrix {
	ll a, c;
	ll b, d;
	mod_matrix() = default;
	mod_matrix(ll a, ll b, ll c, ll d): a(a % MOD), b(b % MOD), c(c % MOD), d(d % MOD) {}
	friend bool operator ==(const mod_matrix &x, const mod_matrix &y) {
		return x.a == y.a && x.b == y.b && x.c == y.c && x.d == y.d;
	}
	friend mod_matrix operator *(const mod_matrix &x, const mod_matrix &y) {
		mod_matrix r(x.a * y.a + x.c * y.b, x.b * y.a + x.d * y.b, x.a * y.c + x.c * y.d, x.b * y.c + x.d * y.d);
		return r;
	}
	friend mod_matrix operator *(const mod_matrix &x, const int &y) {
		mod_matrix r(x.a * y, x.b * y, x.c * y, x.d * y);
		return r;
	}
	friend mod_matrix operator *(const int &y, const mod_matrix &x) {
		mod_matrix r(x.a * y, x.b * y, x.c * y, x.d * y);
		return r;
	}
	friend mod_matrix operator !(const mod_matrix &x) {
		ll div = inv((x.a * x.d - x.b * x.c) % MOD + MOD, MOD);
		mod_matrix<MOD> r(x.d, MOD - x.b, MOD - x.c, x.a);
		return r * div;
	}
	friend ostream &operator <<(ostream &out, const mod_matrix &x) {
		out << "[(" << x.a << ", " << x.b << "), (" << x.c << ", " << x.d << ")]";
		return out;
	}
};

// -----------------------------------------------------------------------------

constexpr ll MOD = 1e9 + 7;

using matrix = mod_matrix < MOD >;

struct my_hash {
	size_t operator () (const matrix &x) const {
		size_t res1 = x.a ^ x.b ^ x.c ^ x.d;
		return res1 + x.a + x.b + x.c;
	}
};

mt19937 rnd(time(0));

#define random_matrix() ({ \
		matrix __m_r__(rnd() % MOD + 1, rnd() % MOD + 1, rnd() % MOD + 1, rnd() % MOD + 1); \
		if ((__m_r__.a * __m_r__.d - __m_r__.b * __m_r__.c) % MOD == 0) ++__m_r__.a; \
		__m_r__; \
	})

// -----------------------------------------------------------------------------

matrix matrices[30], rmatrices[30];

const matrix Imatrix(1, 0, 0, 1);

constexpr int N = 2e6 + 10;

int bucket[N];

matrix arr[N];

ll Main() {
	for (int i = 0; i < 26; ++i) {
		matrices[i] = random_matrix();
		rmatrices[i] = !matrices[i];
		assert(matrices[i] * rmatrices[i] == Imatrix);
	}
	int n;
	cin >> n;
	string str;
	cin >> str;
	for (int i = 0; i < n; ++i) {
		int c = str[i] - 'a';
		++bucket[c];
		arr[i] = (bucket[c] & 1 ? matrices : rmatrices)[c];
	}
	ll ans = 0;
	unordered_map<matrix, int, my_hash> bucket;
	matrix pre = Imatrix;
	for (int i = 0; i < n; ++i) {
		++bucket[pre];
		pre = pre * arr[i];
		ans += bucket.count(pre) ? bucket[pre] : 0;
	}
	return ans;
}

// -----------------------------------------------------------------------------

signed main() {
#ifdef FAST_IO
	ios::sync_with_stdio(false);
	cin.tie(nullptr), cout.tie(nullptr);
#endif
	cout << Main() << endl;
	return 0;
}

```

$$
a+b
$$

$a+b$

## Material color palette 颜色主题

### Color Scheme 配色方案

根据浏览器与系统设置自动切换明暗主题，也可手动切换
<div class="tx-switch">
<button data-md-color-scheme="default"><code>Default</code></button>
<button data-md-color-scheme="slate"><code>Slate</code></button>
</div>
<script>
  var buttons = document.querySelectorAll("button[data-md-color-scheme]")
  Array.prototype.forEach.call(buttons, function(button) {
    button.addEventListener("click", function() {
      document.body.dataset.mdColorScheme = this.dataset.mdColorScheme;
      localStorage.setItem("data-md-color-scheme",this.dataset.mdColorScheme);
    })
  })
</script>

### Primary colors 主色

点击色块可更换主题的主色
<div class="tx-switch">
<button data-md-color-primary="red"><code>Red</code></button>
<button data-md-color-primary="pink"><code>Pink</code></button>
<button data-md-color-primary="purple"><code>Purple</code></button>
<button data-md-color-primary="deep-purple"><code>Deep Purple</code></button>
<button data-md-color-primary="indigo"><code>Indigo</code></button>
<button data-md-color-primary="blue"><code>Blue</code></button>
<button data-md-color-primary="light-blue"><code>Light Blue</code></button>
<button data-md-color-primary="cyan"><code>Cyan</code></button>
<button data-md-color-primary="teal"><code>Teal</code></button>
<button data-md-color-primary="green"><code>Green</code></button>
<button data-md-color-primary="light-green"><code>Light Green</code></button>
<button data-md-color-primary="lime"><code>Lime</code></button>
<button data-md-color-primary="yellow"><code>Yellow</code></button>
<button data-md-color-primary="amber"><code>Amber</code></button>
<button data-md-color-primary="orange"><code>Orange</code></button>
<button data-md-color-primary="deep-orange"><code>Deep Orange</code></button>
<button data-md-color-primary="brown"><code>Brown</code></button>
<button data-md-color-primary="grey"><code>Grey</code></button>
<button data-md-color-primary="blue-grey"><code>Blue Grey</code></button>
<button data-md-color-primary="white"><code>White</code></button>
</div>
<script>
  var buttons = document.querySelectorAll("button[data-md-color-primary]");
  Array.prototype.forEach.call(buttons, function(button) {
    button.addEventListener("click", function() {
      document.body.dataset.mdColorPrimary = this.dataset.mdColorPrimary;
      localStorage.setItem("data-md-color-primary",this.dataset.mdColorPrimary);
    })
  })
</script>

### Accent colors 辅助色

点击色块更换主题的辅助色
<div class="tx-switch">
<button data-md-color-accent="red"><code>Red</code></button>
<button data-md-color-accent="pink"><code>Pink</code></button>
<button data-md-color-accent="purple"><code>Purple</code></button>
<button data-md-color-accent="deep-purple"><code>Deep Purple</code></button>
<button data-md-color-accent="indigo"><code>Indigo</code></button>
<button data-md-color-accent="blue"><code>Blue</code></button>
<button data-md-color-accent="light-blue"><code>Light Blue</code></button>
<button data-md-color-accent="cyan"><code>Cyan</code></button>
<button data-md-color-accent="teal"><code>Teal</code></button>
<button data-md-color-accent="green"><code>Green</code></button>
<button data-md-color-accent="light-green"><code>Light Green</code></button>
<button data-md-color-accent="lime"><code>Lime</code></button>
<button data-md-color-accent="yellow"><code>Yellow</code></button>
<button data-md-color-accent="amber"><code>Amber</code></button>
<button data-md-color-accent="orange"><code>Orange</code></button>
<button data-md-color-accent="deep-orange"><code>Deep Orange</code></button>
</div>
<script>
  var buttons = document.querySelectorAll("button[data-md-color-accent]");
  Array.prototype.forEach.call(buttons, function(button) {
    button.addEventListener("click", function() {
      document.body.dataset.mdColorAccent = this.dataset.mdColorAccent;
      localStorage.setItem("data-md-color-accent",this.dataset.mdColorAccent);
    })
  })
</script>

<style>
button[data-md-color-accent]> code {
    background-color: var(--md-code-bg-color);
    color: var(--md-accent-fg-color);
  }
button[data-md-color-primary] > code {
    background-color: var(--md-code-bg-color);
    color: var(--md-primary-fg-color);
  }
button[data-md-color-primary='white'] > code {
    background-color: var(--md-primary-bg-color);
    color: var(--md-primary-fg-color);
  }
button[data-md-color-accent],button[data-md-color-primary],button[data-md-color-scheme]{
    width: 8.4rem;
    margin-bottom: .4rem;
    padding: 2.4rem .4rem .4rem;
    transition: background-color .25s,opacity .25s;
    border-radius: .2rem;
    color: #fff;
    font-size: .8rem;
    text-align: left;
    cursor: pointer;
}
button[data-md-color-accent]{
  background-color: var(--md-accent-fg-color);
}
button[data-md-color-primary]{
  background-color: var(--md-primary-fg-color);
}
button[data-md-color-scheme='default']{
  background-color: hsla(0, 0%, 100%, 1);
}
button[data-md-color-scheme='slate']{
  background-color: var(--md-default-bg-color);
}
button[data-md-color-accent]:hover, button[data-md-color-primary]:hover {
    opacity: .75;
}
</style>
