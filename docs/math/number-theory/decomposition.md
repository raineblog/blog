# 数论分块

数论分块可以快速的求解形如，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\sum_{i=1}^nf(i)g\left(\floor{n\over i}\right)
$$

的求和式。

不考虑 $f,g$ 的复杂度，数论分块的复杂度是 $\mathcal O(\sqrt n)$ 的。

其思想是将函数分段（分块），因此叫做数论分块。

## 性质和结论

### 下取整的性质

容易发现，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\floor{n\over i}
$$

下文所说个数均为规模，表示大概。

在 $i\in[1,\sqrt n)$ 的时候，一共只有 $\sqrt n$ 个式子。

在 $i\in[\sqrt n,n]$ 的时候，一共只有 $\sqrt n$ 种不同的结果。

因此，我们可以对此分块，使总复杂度降为 $\mathcal O(\sqrt n)$。

### 数论分块的结论

对于常熟 $n$，使得

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\floor{n\over i}=\floor{n\over j}
$$

成立的最大 $i\le j\le n$ 的 $j$ 为，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\floor{n\over\floor{n/i}}
$$

于是，我们可以根据左端点，推断出右端点，进而推断出下一个块的左端点。

这就是数论分块的本质。

证明不会。

## 过程

考虑最简单的形式，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\sum_{i=1}^nf(i)\floor{n\over i}
$$

显然我们要处理 $f$ 的前缀和，记为 $s$。

由于后面的东西是块状分布的，因此数论分块。

每次以一块，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
[l,r]=\left[l,\floor{n\over\floor{n/i}}\right]
$$

随后对于下一块，更新区间左端点，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
l\gets r+1=\floor{n\over\floor{n/i}}+1
$$

参考代码，

```cpp
int solev(int n) {
	int l = 1, r, ans = 0;
	while (l <= n) {
		r = n / (n / l);
		ans += (n / l) * (s(r) - s(l - 1));
		// ans += (n / l) * calc(l, r);
		l = r + 1;
	}
	return ans;
}
```

## 例题

### 例题一：P3935 Calculating

第一步推式子，题中给出函数 $f(x)$ 表示 $x$ 的因数个数，因此答案，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\sum_{x=l}^r\sum_{i=1}^x\floor{x\over i}
$$

左侧用差分，因此要求，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
f(x)=\sum_{i=1}^x\floor{x\over i}
$$

即标准形式的数论分块，代码，

```cpp
ll solev(ll n) {
	ll l = 1, r, ans = 0;
	while (l <= n) {
		r = n / (n / l);
		ans = (ans + (n / l) * (r - l + 1) % mod) % mod;
		l = r + 1;
	}
	return ans;
}
```

### 例题二：P2424 约数和

已经给出了式子，整理，即

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\sum_{x=l}^r\sum_{i=1}^xi\floor{x\over i}
$$

左侧用差分，因此要求，

$$
\def\floor#1{\left\lfloor{#1}\right\rfloor}
\sum_{i=1}^xi\floor{x\over i}
$$

即标准形式的数论分块，代码，

```cpp
ll calc(int l, int r) {
	return ((ll)l + r) * (r - l + 1) / 2;
}

ll solev(int x) {
	int l = 1, r;
	ll ans = 0;
	while (l <= x) {
		r = x / (x / l);
		ans += calc(l, r) * (x / l);
		l = r + 1;
	}
	return ans;
}
```

### 例题三：P2261 [CQOI2007] 余数求和

有点技巧，因为容易发现枚举上界和被除数不统一。

回归数论分块的本质，容易发现其实只需要知道块的左右端点就可以了。

于是也容易得出，我们对右端点取 $n$ 的 $\min$，注意除数不为零即可。

代码，

```cpp
ll calc(int l, int r) {
	return ((ll)l + r) * (r - l + 1) / 2;
}

ll solev(int n, int x) {
	int l = 1, r;
	ll ans = 0;
	while (l <= n) {
		r = n;
		if (x / l) r = min(r, x / (x / l));
		ans += calc(l, r) * (x / l);
		l = r + 1;
	}
	return ans;
}
```

### 例题四：[[ARC068E] Snuke Line](https://www.luogu.com.cn/problem/AT_arc068_c)

多维数论分块。

容易发现，一个步长 $d$ 在某个颜色的区间 $[l,r]$ 有贡献，当且仅当存在正整数 $x$，使得，

$$
l\le dx\le r
$$

$$
\left\lceil{l\over d}\right\rceil\le x\le\left\lfloor{r\over d}\right\rfloor
$$

根据取整的性质，

$$
\left\lfloor{l-1\over d}\right\rfloor<x\le\left\lfloor{r\over d}\right\rfloor
$$

$$
\left\lfloor{l-1\over d}\right\rfloor<\left\lfloor{r\over d}\right\rfloor
$$

我们注意到 $d$ 是变量，我们可以对于 $l,r$ 用数论分块求出有贡献的 $d$ 的取值范围。

差分一下即可，同时注意到数论分块求不到 $[l,r]$ 区间本身的答案，我们手动加上即可。

```cpp
constexpr int N = 1e5 + 10;

int sum[N];

void Main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        int x, y;
        cin >> x >> y;
        --x;
        int l = 1, r;
        while (l <= x) {
            r = min(x / (x / l), y / (y / l));
            if (x / l < y / l) ++sum[l], --sum[r + 1];
            l = r + 1;
        }
        ++sum[x + 1], --sum[y + 1];
    }
    int ans = 0;
    for (int i = 1; i <= m; ++i) {
        ans += sum[i];
        cout << ans << endl;
    }
}
```
