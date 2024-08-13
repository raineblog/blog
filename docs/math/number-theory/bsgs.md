# BSGS 算法

## 基础 BSGS 算法

即 Baby-Step Giant-Step 算法。

### 过程

求解满足，

$$
a^x\equiv b\pmod p
$$

的最小非负整数解；其中 $a,b,m\in\mathbb Z^+$，$a\perp p$。

**性质**：一定有 $b\le\varphi(p)$（取等是求解最小正整数解）。

???+ note "证明"
    我们知道，

    $$
    x=q\times\varphi(p)+r,0\le r\le\varphi(p)
    $$

    那么，

    $$
    a^x=a^{q\times\varphi(p)+r}\equiv a^r\pmod p
    $$

    也就是说，如果 $x$ 满足条件，那么 $r$ 也满足条件。

    或者称为 $a^x$ 的循环节为 $\varphi(p)$，因此这个 $r\le\varphi(p)$ 的显然的。

考虑分块，记，

$$
m=\lceil\sqrt p\rceil
$$

设，

$$
x=Am-B
$$

其中 $A\in[1,m]$，$B\in[0,m-1]$（这是显然的）。

带入原式[^1]，

[^1]: 此处乘发需要 $a^B\perp p$，也就是 $a\perp p$，这就是为什么 BSGS 算法需要 $a,p$ 互质。

$$
\begin{aligned}
a^{Am-B}&\equiv b\pmod p\\
a^{Am}&\equiv ba^B\pmod p
\end{aligned}
$$

我们要求解使得等式成立的 $A,B$ 并最小化 $Am-B$。

+ 容易知道我们要最小化 $A$、最大化 $B$。

+ Baby-Step：我们枚举 $B$，将右侧的值用 `map` 记录下来最大的 $B$。

+ Giant-Step：我们枚举 $A$，计算左侧，寻找 `map` 中是否有与之相对的值。

那么时间复杂度就是 $\mathcal O(\sqrt p)$ 的（使用哈希表实现 `map` 的操作）。

### 实现

注意到如果 $p$ 本身是 `int64` 级别的，

那么两个 $p$ 级别的数相乘会爆掉，因此用 `int128` 即可。

```cpp
using ll = long long;

ll qpow(ll a, ll b, ll p) {
	ll r = 1;
	for (; b; b >>= 1) {
		if (b & 1)
			r = (__int128)r * a % p;
		a = (__int128)a * a % p;
	}
	return r % p;
}

ll bsgs(ll a, ll b, ll p) {
	a %= p;
	b %= p;
	if (b == 1)
		return 0;
	ll m = ceil(sqrtl(p)), r;
	unordered_map<ll, int> bucket;
	r = b;
	for (int B = 0; B < m; ++B) {
		bucket[r] = B;
		r = (__int128)r * a % p;
	}
	ll am = qpow(a, m, p);
	r = 1;
	for (int A = 1; A <= m; ++A) {
		r = (__int128)r * am % p;
		if (bucket.count(r))
			return A * m - bucket[r];
	}
	return -1;
}
```

其实复杂度瓶颈不在求 $a^m\bmod p$，但是快速幂写习惯了也没问题。