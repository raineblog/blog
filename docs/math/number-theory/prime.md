# 素数判定

## 素数

小学数学。

素数定义为除了 $1$ 和它本身外没有正因子的数，反之为合数。

一般不讨论小于 $2$ 的数，特殊定义 $1$ 既不是素数也不是合数。

拓展：

+ 反素数：对于反素数 $n$，任何小于 $n$ 的正数的约数个数都小于 $n$ 的约数个数。

+ Emirp（也译为反素数）：逐位反转后是不同素数的素数（如 $149$ 和 $941$，但 $101$ 不是）。

## 定义

试除法：所有的试除法，无论是 $\mathcal O(n)$ 的还是 $\mathcal O(\sqrt n)$ 的，其本质都相同：

* 即找 $n$ 可能存在的因子 $k$，判断 $k \mid n$。

素性测试：旨在不用分解因数的方式，判断一个数是否为质数；素性测试分为两种：

* 确定性测试：（绝对正确的）确定一个数是否为素数。
* 概率性测试：具有较高正确率，但是不完全保证准确。

## 试除法判定素数

咕咕咕。

## Miller-Rabin 素性检验

### Fermat 素性检验

我们知道有费马小定理：$a^{p-1} \equiv 1 \pmod p$（$p \in \mathbb P,a \perp p$）。

据此，我们得出费马小定理的逆否命题：

若有 $a \perp p$ 且 $a^{p - 1} \not\equiv 1 \pmod p$，则 $p$ 一定不是质数。

但是逆否命题不意味着逆命题成立，因此，满足上一命题的，不一定完全是质数。

此类满足费马小定理逆否命题，但不是质数的数，称为 Carmichael 数。

在大部分情况下，我们使用（并不正确的）费马小定理逆定理，判定一个质数。

这个过程称为 Fermat 素性检验。

### 二次探测定理

如果 $p$ 是奇质数（只有质数 $2$ 不是奇质数），则:

$x^2 \equiv 1 \pmod p$ 的解为 $x \equiv 1 \pmod p$ 或 $x \equiv p-1 \pmod p$。

证明：

$$
\begin{array}{rcl}
x^2 &\equiv& 1 \pmod p\\
x^2-1 &\equiv& 0 \pmod p\\
(x+1)(x-1) &\equiv& 0 \pmod p\\
\end{array}
$$

因此 $x \equiv 1 \pmod p$ 或 $x \equiv p-1 \pmod p$。

### Miller-Rabin 素性检验

Miller–Rabin 素性测试是根据费马测试和二次探测定理优化得到的。

其准确性较高，目前已知没有通过 Miller–Rabin 素性测试而非质数的。

因此我们可以（在 OI 中）放心使用。

其复杂度为 $\mathcal O(k \log n)$，表示对 $n$ 进行 $k$ 次测试。

思想：

将 $a^{p-1} \equiv 1 \pmod p$ 中的指数 $p−1$ 分解为 $p−1=u \times 2^t$。

对随机出来的 $a$ 先求出 $v = a^{u} \bmod n$，之后对这个值执行最多 $t$ 次平方操作。

若发现非平凡平方根时即可判断出其不是素数，否则再使用 Fermat 素性测试判断。

代码：

```cpp
using ll = long long;

ll Pow(ll a, ll b, ll p) {
    ll r = 1;
    for (; b; b >>= 1) {
        if (b & 1) r = (__int128)r * a % p;
        a = (__int128)a * a % p;
    } return r;
}

bool Miller_Rabbin(ll a, ll n) {
    ll s = n - 1, r = 0;
    while ((s & 1) == 0) s >>= 1, ++r;
    ll k = Pow(a, s, n);
    if (k == 1) return true;
    for (int i = 0; i < r; ++i) {
        if (k == n - 1) return true;
        k = (__int128)k * k % n;
    } return false;
}

bool isPrime(ll n) {
    if (n <= 1) return false;
    ll cnt = 7, pri[10] = {2, 3, 4, 5, 11, 233, 331};
    for (int i = 0; i < cnt; ++i) {
        if (n == pri[i]) return true;
        if (!Miller_Rabbin(pri[i], n)) return false;
    } return true;
}
```

## Reference

[1] <https://oi-wiki.org/math/number-theory/prime/>  
[2] <https://www.luogu.com.cn/blog/wangrx/miller-rabin>
