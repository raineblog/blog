# 素数

## 定义

小学数学。

素数定义为除了 $1$ 和它本身外没有正因子的数，反之为合数。

一般不讨论小于 $2$ 的数，特殊定义 $1$ 既不是素数也不是合数。

拓展：

+ 反素数：对于反素数 $n$，任何小于 $n$ 的正数的约数个数都小于 $n$ 的约数个数。

+ Emirp（也译为反素数）：逐位反转后是不同素数的素数（如 $149$ 和 $941$，但 $101$ 不是）。

## 有趣的东西

### 素数计数函数

素数计数函数：表示小于或等于某个实数 $x$ 的素数的个数的函数，记为 $\pi(x)$。即，

$$
\pi(x)=\sum_{i=1}^n[i\in\mathbb P]
$$

同时，用 $\pi(x;N,r)$ 表示小于等于 $x$ 的质数中，模 $N$ 同余于 $r$ 的质数个数。即，

$$
\pi(x;N,r)=\sum_{i=1}^n[i\in\mathbb P][i\equiv r\,(N)]
$$

其中，$\mathbb P$ 表示质数集合，此处省略 $\bmod$ 符号，注意是表示同余。

### 素数定理

素数定理，描述了素数在自然数中分布的渐进情况。

它给出随着数字的增大，素数的密度逐渐降低的直觉的形式化描述。

一般描述：

$$
\pi(x)\sim{x\over\ln x}
$$

或者，

$$
\lim_{x\to\infty}\left({\pi(x)\over x/\ln x}\right)=1
$$

### 狄利克雷定理

狄利克雷定理，是关于质数在同余类中分布的定理。

其简化形式为（这是 3b1b 的形式化版本）：

$$
\lim_{x\to\infty}\left({\text{\# of primes $p$ where $p\le x$ and $p\equiv r\pmod N$}\over\text{\# of primes $p$ where $p\le x$}}\right)={1\over\varphi(p)}
\\[0.5em]
\text{$N$ is any number, $r$ is coprime to $N$}
$$

这个玩意没必要翻译了，毕竟看符号也能看懂。

形式化的版本：

$$
\lim_{x\to\infty}\left({\pi(x;N,r)\over\pi(x)}\right)={1\over\varphi(p)}
\\[0.5em]
\text{$N$ is any number, $r$ is coprime to $N$}
$$

其中，$\varphi$ 为欧拉函数。

### 伯特兰-切比雪夫定理

它指出，对于整数 $n>3$，至少存在一个质数 $p$ 满足 $n<p<2n-2$。

一个经典的弱化版本是，在 $[n,2n]$ 之间一定存在至少一个质数，证明略。

## 素数判断

试除法：找 $n$ 可能存在的因子 $k$，判断 $k \mid n$。

素性测试：在不用分解因数的方式，判断一个数是否为素数。

素性测试分为两种：

* 确定性测试：（绝对正确的）确定一个数是否为素数。

* 概率性测试：具有较高正确率，但是不完全保证准确。

### 试除法

#### 暴力

我们根据定义，枚举 $[2,n-1]$ 的每一个数，判断是否整除，

```cpp
bool isPrime(int n) {
	if (n <= 1)
		return false;
	for (int i = 2; i < n; ++i)
		if (n % i == 0)
			return false;
	return true;
}
```

时间复杂度显然是 $\mathcal O(n^2)$ 的。

#### 优化

注意到如果 $x$ 是 $n$ 的因数，那么 $n/x$ 也是。

我们钦定，

$$
\begin{aligned}
x&\le\frac{n}{x}\\
x^2&\le n\\
x&\le\sqrt{n}
\end{aligned}
$$

也就是我们只需要枚举 $[2,\lfloor\sqrt n\rfloor]$ 即可。

```cpp
bool isPrime(int n) {
	if (n <= 1)
		return false;
	for (int i = 2; 1ll * i * i <= n; ++i)
		if (n % i == 0)
			return false;
	return true;
}
```

#### 常数优化

注意到一个 $>3$ 的质数，模 $6$ 只可能等于 $1,5$。

而此时我们也只需要判断模 $5+6k,7+6k,k\in\mathbb N$ 即可。

```cpp
bool isPrime(int n) {
	if (n <= 1)
		return false;
	if (n <= 3)
		return true;
	if (n % 6 != 1 && n % 6 != 5)
		return false;
	for (int i = 5; 1ll * i * i <= n; i += 6)
		if (n % i == 0 || n % (i + 2) == 0)
			return false;
	return true;
}
```

这个时间复杂度也是 $\mathcal O(\sqrt n)$ 的，但是带 $1/3$ 的常数。

### Fermat 素性检验

我们知道有费马小定理：$a^{p-1} \equiv 1 \pmod p$（$p \in \mathbb P,a \perp p$）。

据此，我们得出费马小定理的逆否命题：

若有 $a \perp p$ 且 $a^{p - 1} \not\equiv 1 \pmod p$，则 $p$ 一定不是素数。

???+ note "Fermat 素性测试的正确性"
    逆否命题不意味着逆命题成立，因此，满足上一命题的，不一定完全是素数。

    此类满足费马小定理逆否命题，但不是素数的数，称为 Carmichael 数。

    在大部分情况下，我们使用（并不正确的）费马小定理逆定理，判定一个素数。

具体的，我们一般从 $[2,n-1]$ 中挑选基 $a$ 判断 $a^{n-1}\equiv\pmod n$ 是否成立。

假设我们选择 $k$ 个数，那么使用快速幂实现，

不考虑高精度的复杂度，Fermat 素性测试的复杂度是 $\mathcal O(n\log n)$ 的。

### Miller-Rabin 素性检验

Miller–Rabin 素性测试是根据费马测试和二次探测定理优化得到的。

其复杂度为 $\mathcal O(k \log n)$，表示对 $n$ 进行 $k$ 次测试。

#### 二次探测定理

如果 $p$ 是奇素数（只有素数 $2$ 不是奇素数），则:

$$
x^2 \equiv 1 \pmod p
$$

的解为

$$
x \equiv \pm1 \pmod p
$$

???+ note "证明"
    平方差公式展开即可：

    $$
    \begin{array}{rcl}
    x^2 &\equiv& 1 \pmod p\\
    x^2-1 &\equiv& 0 \pmod p\\
    (x+1)(x-1) &\equiv& 0 \pmod p \quad\square
    \end{array}
    $$

#### 过程

假设 $n$ 是奇素数（特判 $2$ 即可），那么一定有 $n-1$ 是偶数，即，

$$
n-1=2^sd,\text{with $d$ odd.}
$$

由费马小定理，

$$
\begin{aligned}
a^{n-1}&\equiv1\pmod n\\
a^{2^sd}-1&\equiv0\pmod n\\
(a^{2^{s-1}d}-1)(a^{2^{s-1}d}+1)&\equiv0\pmod n\\
(a^{2^{s-2}d}-1)(a^{2^{s-2}d}+1)(a^{2^{s-1}d}+1)&\equiv0\pmod n\\
\dots\\
(a^d-1)(a^d+1)\dots(a^{2^{s-2}d}+1)(a^{2^{s-1}d}+1)&\equiv0\pmod n
\end{aligned}
$$

也就是说若 $n$ 通过了该次测试，有，

$$
\begin{aligned}
a^d&\equiv1\pmod n\\
a^{2^rd}&\equiv-1\pmod n,r\in[0,s-1]
\end{aligned}
$$

满足其一。

我们结合二次探测定理，容易发现这个过程相当于，对

$$
a^{n-1}\equiv a^{2^sd}\equiv1\pmod n
$$

不断开根，如果 $n$ 是素数，那么得到的是 $\pm1$，

+ 如果开到了 $-1$ 那么意味着满足下式，通过测试。

+ 如果最后开到了 $1$ 那么意味着满足上式，通过测试。

+ 否则不通过测试，$n$ 一定不是素数。

我们称使 $n$ 不通过测试的 $a$ 为证明 $n$ 是合数的凭证。

如果不存在这种凭证，那么称这些 $a$ 可能为证明 $n$ 是素数的强伪证。

每个奇合数的凭证可能很多，但是要找到这些事很困难的。

于是我们一般随机选择若干个数字 $a\in[2,n-1]$ 进行测试，正确性比较高。

???+ note "相对确定性的做法"
    详见：<https://miller-rabin.appspot.com/>。

    对于 $32$ 位整形，我们只需要测试 $2,3,5,7$ 这四个底数即可。

    对于 $64$ 位整形，我们只需要测试前 $12$ 个素数 $2,3,5,7,11,13,17,19,23,29,31,37$ 即可。

    这些是经过验证的，可以放心使用。

??? note "点击查看代码"
    ```cpp
    using u64 = uint64_t;
    using u128 = __uint128_t;

    u64 Pow(u64 a, u64 b, u64 p) {
        u64 r = 1;
        for (; b; b >>= 1) {
            if (b & 1)
                r = (u128)r * a % p;
            a = (u128)a * a % p;
        }
        return r;
    }

    bool Miller_Rabin(u64 a, u64 n, u64 d, int r) {
        u64 k = Pow(a, d, n);
        if (k == 1)
            return true;
        for (int i = 0; i < r; ++i) {
            if (k == n - 1)
                return true;
            k = (u128)k * k % n;
        }
        return false;
    }

    vector<int> pri{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};

    bool isPrime(u64 n) {
        if (n < 3 || n % 2 == 0)
            return n == 2;
        int r = __builtin_ctzll(n - 1);
        u64 d = (n - 1) >> r;
        for (int i : pri) {
            if (n == i)
                return true;
            if (!Miller_Rabin(i, n, d, r))
                return false;
        }
        return true;
    }
    ```

## Reference

[1] <https://oi-wiki.org/math/number-theory/prime/>  
[2] <https://www.luogu.com.cn/blog/wangrx/miller-rabin>
