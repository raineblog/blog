# 欧几里得算法

## 定义

### 最大公约数

最大公约数即为 Greatest Common Divisor，常缩写为 gcd。

+ 一组整数的公约数，是指同时是这组数中每一个数的约数的数。$\pm 1$ 是任意一组整数的公约数；

+ 一组整数的最大公约数，是指所有公约数里面最大的一个。

特殊的，我们定义 $\gcd(a, 0) = a$。

### 最小公倍数

最小公倍数即为 Least Common Multiple，常缩写为 lcm。

+ 一组整数的公倍数，是指同时是这组数中每一个数的倍数的数。$0$ 是任意一组整数的公倍数；

+ 一组整数的最小公倍数（Least Common Multiple, LCM），是指所有正的公倍数里面，最小的一个数。

### 互质

如果两个数 $a$ 和 $b$ 满足 $\gcd(a, b) = 1$，我们称 $a$ 和 $b$ 互质，记作 $a\perp b$。

## 欧几里得算法

欧几里得算法（Euclidean algorithm），是求解两个数最大公约数的最常用的算法。

### 算法思想

$\gcd(a, b) = \gcd(b, a \bmod b)$

具体证明见：[OI-Wiki](https://oi-wiki.org/math/number-theory/gcd/#%E8%BF%87%E7%A8%8B "OI-Wiki")。

### 代码

```cpp
int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
```

因此也有递归写法：

```cpp
int gcd(int a, int b) {
    int tmp;
    while (b != 0) tmp = a, a = b, b = tmp % b;
    return a;
}
```

对于 C++14，我们可以使用 <algorithm> 中的 `__gcd(a,b)` 函数来求最大公约数。

### 时间复杂度

在输入为两个长为 $n$ 的二进制整数时，欧几里得算法的时间复杂度为 $O(n)$；

换句话说，在默认 $a, b$ 同阶的情况下，时间复杂度为 $O(\log\max(a, b))$。

欧几里得算法的最劣时间复杂度情况是 $\gcd(\operatorname{Fib}_{n + 1}, \operatorname{Fib}_n)$，其时间复杂度为 $O(n)$；

但是，有 $\gcd(\operatorname{Fib}_{n + 1}, \operatorname{Fib}_n) = \operatorname{Fib}_{\gcd(n + 1, n)}$。

## 更相减损术

更相减损术的性质一般用于推导关于 $\gcd$ 的性质，本身速度不快。

但是基于更相减损术的 Stein 算法 / Binary GCD 的速度反而比欧几里得算法快了。

### 基础形式

有性质，

$$
\gcd(a,b)=\gcd(a-b,b),a\ge b
$$

或者，

$$
\gcd(a,b)=\gcd(|a-b|,\min\{a,b\})
$$

根据这个可以直接求解，但是会被卡（例如 $a\gg b$）。

### Stein 算法 / Binary GCD

这两个是一个东西，详见 [Algorithmica / HPC](https://en.algorithmica.org/hpc/algorithms/gcd/#binary-gcd)。

我们直接讨论 $a,b$ 关于 $2$ 的同余类。

如果 $2\mid a,2\mid b$，那么 $\gcd(a,b)=2\gcd(a/2,b/2)$，这是显然的。

否则，若其中一个不存在 $2$ 的因子（钦定为 $b$），因此 $\gcd(a,b)=\gcd(a/2,b)$。

否则，进行更相减损术一次，那么 $a-b\equiv0\pmod2$ 又是显然的。

因为每一次一定会减半，因此复杂度是严格的 $\mathcal O(\log n)$。

同时，我们可以进行一些常数优化：注意到除以二是可以一次性除完的。

使用 $\text{\_\_builtin\_ctz}$ 计算二进制表示末尾 $0$ 的个数，然后除掉即可。

```cpp
#define ctz(x) __builtin_ctz(x)

int gcd(int a, int b) {
	if (!a | !b)
		return a + b;
	int az = ctz(a);
    int bz = ctz(b);
    int z = min(az, bz);
	a >>= az;
    b >>= bz;
	while (a != b) {
		int diff = b - a;
		az = ctz(diff);
		b = min(a, b);
        a = abs(diff) >> az;
	}
	return a << z;
}
```

## 最小公倍数

### 计算

$\gcd(a, b) \times \operatorname{lcm}(a, b) = a \times b$。

要求两个数的最小公倍数，先求出最大公约数即可。

### 证明

设 $a = p_1^{k_{a_1}}p_2^{k_{a_2}} \dots p_s^{k_{a_s}}$，$b = p_1^{k_{b_1}}p_2^{k_{b_2}} \dots p_s^{k_{b_s}}$。

我们发现，对于 $a$ 和 $b$ 的情况，二者的最大公约数等于 $p_1^{\min(k_{a_1}, k_{b_1})}p_2^{\min(k_{a_2}, k_{b_2})} \dots p_s^{\min(k_{a_s}, k_{b_s})}$。

最小公倍数等于 $p_1^{\max(k_{a_1}, k_{b_1})}p_2^{\max(k_{a_2}, k_{b_2})} \dots p_s^{\max(k_{a_s}, k_{b_s})}$。

由于 $k_a + k_b = \max(k_a, k_b) + \min(k_a, k_b)$，

所以得到结论是 $\gcd(a, b) \times \operatorname{lcm}(a, b) = a \times b$。
