# 乘法逆元

![image](img/3271231-20230920161237798-1880243093.png)

## 定义

### 有理数取模

加减法：$(a \pm b) \bmod p = (a \bmod p \pm b \bmod p) \bmod p$.

乘法：$(a \times b) \bmod p = (a \bmod p \times b \bmod p) \bmod p$.

那除法呢？举例可知 $\dfrac{a}{b} \bmod p$ 不一定等于 $\dfrac{a \bmod p}{b \bmod p}$.

如 $\dfrac{10}{2} \bmod 3 = 5 \bmod 3 = 2$，而 $\dfrac{10 \bmod 3}{2 \bmod 3} = \dfrac{1}{2}$.

### 模意义下的乘法逆元

若 $\dfrac{a}{b} \bmod p = (a \times x) \bmod p$，

则称 $x$ 为 $b$ 的模 $p$ 意义下的乘法逆元（或 $x$ 为 $b \bmod p$ 的逆元），记作 $x = b^{-1}$.

根据 $\dfrac{a}{b} \bmod p = (a \times x) \bmod p$ 可以写出同余方程：$\dfrac{a}{b} \equiv a \times x \pmod{p}$

两边同时乘以 $\dfrac{b}{a}$ 可以得到：$bx \equiv 1 \pmod{p}$；或者可以理解为 $x$ 在模 $p$ 意义下等价于 $\dfrac{1}{b}$。

转化一下就是 $xb + kp = 1$，而 $xb + kp = \gcd(b, p)$，

因此逆元并不是普遍存在的，条件是 $\gcd(b, p) = 1$，也就是 $b$ 与 $p$ 互质。

### 扩展欧几里得算法求逆元

上面已经得到了 $bx \equiv 1 \pmod{p}$ 及 $xb + kp = 1$，而这就是上面讲到的特殊化的线性同余方程，可以使用扩展欧几里得算法求逆元。

详见上面：线性同余方程。

### 快速幂求逆元

> 前置知识：快速幂、费马小定理
>
> 若 $p$ 为素数，$\gcd(a, p) = 1$，则 $a^{p - 1} \equiv 1 \pmod{p}$。  
> 证明见：[https://oi-wiki.org/math/number-theory/fermat/](https://oi-wiki.org/math/number-theory/fermat/#%E8%AF%81%E6%98%8E "https://oi-wiki.org/math/number-theory/fermat/")

仅当 $p$ 是质数时，即 $\gcd(b, p) = 1$ 时，也可以用快速幂求逆元：

+ 上面已得 $bx \equiv 1 \pmod{p}$，
+ 根据费马小定理，$b^{p - 1} \equiv 1 \pmod p$，
+ 可以转化为 $b \times b^{p - 2} \equiv 1 \pmod p$，
+ 而我们要求的是 $bx \equiv 1 \pmod p$。
+ 因此可得 $x = b^{p - 2}$。

### 代码实现

```cpp
// s1: exgcd
int inv1(int a, const int p) {
    int x, y;
    exgcd(a, p, x, y);
    return (x % p + p) % p;
}
```

```cpp
// s2: pow
int inv2(int a, const int p) {
    return quick_pow(a, p - 2, p);
}
```

## 线性求逆元

### 线性求任意 $n$ 个数的逆元

给定长度为 $n$ 的序列 $a$（$1 \le a_i < p$），求序列每个数的逆元。

> * $a_i$，表示原序列，即给定的序列；
> * $\displaystyle s_i = \prod_{i = 1}^n a_i$，表示原序列的前缀积。

> * $inv_i = {a_i}^{-1}$，表示原序列的乘法逆元，即待求的序列；
> * $\displaystyle sv_i = {s_i}^{-1} = \prod_{i = 1}^n sv_i$，表示原序列前缀积的乘法逆元，根据逆元性质也等于原序列乘法逆元的前缀积。

1. 计算给定序列 $a_i$ 的前缀积，记为 $s_i$；
2. 使用快速幂或扩展欧几里得法计算 $s_n$ 的逆元，记为 $sv_n$；
2. 因为 $sv_n$ 是 $n$ 个数的积的逆元，所以当我们把它乘上 $a_n$ 时，就会和 $a_n$ 的逆元抵消；这样就得到了 $a_1$ 到 $a_{n - 1}$ 的积逆元，记为 $sv_{n - 1}$；
3. 同理我们可以依次计算出所有的 $sv_i$，于是 ${a_i}^{-1}$ 就可以用 $s_{i - 1} \times sv_i$ 求得。

所以我们就在 $O(n + \log p)$ 的时间内计算出了 $n$ 个数的逆元。

```cpp
// 计算前缀积
s[0] = 1;
for (int i = 1; i <= n; ++i) s[i] = s[i - 1] * a[i] % p;
// 计算全部乘法逆元的前缀积
sv[n] = quick_pow(s[n], p - 2, p);
// 递推前缀积、求序列的乘法逆元
for (int i = n; i >= 1; --i) sv[i - 1] = sv[i] * a[i] % p;
for (int i = 1; i <= n; ++i) inv[i] = sv[i] * s[i - 1] % p;
```

<details>
<summary>来自 OI-Wiki 的代码</summary>

```cpp
s[0] = 1;
for (int i = 1; i <= n; ++i) s[i] = s[i - 1] * a[i] % p;
sv[n] = qpow(s[n], p - 2);
// 当然这里也可以用 exgcd 来求逆元,视个人喜好而定.
for (int i = n; i >= 1; --i) sv[i - 1] = sv[i] * a[i] % p;
for (int i = 1; i <= n; ++i) inv[i] = sv[i] * s[i - 1] % p;
```
</details>

### 特化：线性求 $1\sim n$ 的逆元

即原序列 $a_i = i$，此时有更加快速的方法，但是这里不讲（见 [OI-Wiki](https://oi-wiki.org/math/number-theory/inverse/#%E7%BA%BF%E6%80%A7%E6%B1%82%E9%80%86%E5%85%83 "OI-Wiki") 内）。

我们在此就简化原程序。

```cpp
s[0] = 1;
for (int i = 1; i <= n; ++i) s[i] = s[i - 1] * i % p;
sv[n] = quick_pow(s[n], p - 2, p);
for (int i = n; i >= 1; --i) sv[i - 1] = sv[i] * i % p;
for (int i = 1; i <= n; ++i) inv[i] = sv[i] * s[i - 1] % p;
```

## 例题

### 快速幂求逆元

??? note "点击查看代码"
    题目：[P2613 有理数取余](https://www.luogu.com.cn/problem/P2613)。

    ```cpp
    const ll MOD = 19260817;

    ll qpow(ll a, ll b, const ll p, ll res = 1)
    {
        for (; b; b >>= 1)
            b & 1 ? res = res * a % p, a = a *a % p : a = a * a % p;
        return res;
    }

    int main()
    {
        ll a = read(), b = read();
        if (b == 0)
            printf("Angry!\n"), exit(0);
        ll res = a * qpow(b, MOD - 2, MOD) % MOD;
        printf("%lld\n", res);
        return 0;
    }
    ```

### 线性求 $1\sim n$ 的逆元

??? note "点击查看代码"
    题目：[P3811 模意义下的乘法逆元](https://www.luogu.com.cn/problem/P3811)。

    ```cpp
    typedef long long ll;

    const int N = 3e6 + 10;

    ll s[N], sv[N];

    ll qpow(ll a, ll b, const ll p, ll r = 1)
    {
        for (; b; b >>= 1)
            b & 1 ? r = r * a % p, a = a * a % p : a = a * a % p;
        return r;
    }

    int main()
    {
        const int n = rr;
        const ll p = rr;

        s[0] = 1;
        for (int i = 1; i <= n; ++i)
            s[i] = s[i - 1] * i % p;

        sv[n] = qpow(s[n], p - 2, p);
        for (int i = n; i; --i)
            sv[i - 1] = sv[i] * i % p;

        for (int i = 1; i <= n; ++i)
            printf("%lld\n", sv[i] * s[i - 1] % p);
        return 0;
    }
    ```

### 线性求 $n$ 数的逆元

??? note "点击查看代码"
    题目：[P5431 模意义下的乘法逆元 2](https://www.luogu.com.cn/problem/P5431)。

    求：$\sum\limits_{i = 1}^n \frac{k^i}{a_i}$.

    ```cpp
    typedef long long ll;

    const int N = 5e6 + 10;

    ll a[N];
    ll s[N], sv[N];

    ll qpow(ll a, ll b, const ll p, ll r = 1)
    {
        for (; b; b >>= 1)
            b & 1 ? r = r * a % p, a = a *a % p : a = a * a % p;
        return r;
    }

    int main()
    {
        const int n = rr;
        const ll p = rr, k = rr;

        s[0] = 1;
        for (int i = 1; i <= n; ++i)
            a[i] = rr, s[i] = s[i - 1] * a[i] % p;

        sv[n] = qpow(s[n], p - 2, p);
        for (int i = n; i; --i)
            sv[i - 1] = sv[i] * a[i] % p;

        ll res = 0, kt = k;
        for (int i = 1; i <= n; ++i)
            res = (res + kt * (sv[i] * s[i - 1] % p) % p) % p, kt = kt * k % p;

        printf("%lld\n", res);
        return 0;
    }
    ```

## Reference

[1] <https://oi-wiki.org/math/number-theory/fermat/>  
[2] <https://oi-wiki.org/math/number-theory/inverse/>  
[3] <https://oi-wiki.org/math/number-theory/linear-equation/>
