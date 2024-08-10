# 初等数论

初等数论是研究数的规律，特别是整数性质的数学分支。它是数论的一个最古老的分支。

它以算术方法为主要研究方法，主要内容有整数的整除理论、同余理论、连分数理论和某些特殊不定方程。

## 定义

一些不值得单独开文章的内容。

### 整除

对于整数 $a,b$ $(b\neq0)$，如果存在整数 $c$，使得 $a=bc$，

则称 $b$ 整除 $a$，记作 $b \mid a$；否则称 $b$ 不整除 $a$，记作 $b \nmid a$。

**性质**：

$$
\def\arraystretch{1.1}
\begin{array}{rlrl}
1.&a\mid b&\Longrightarrow&\pm a \mid \pm b\\
2.&a \mid b,\ b\mid c&\Longrightarrow&a \mid c\\
3.&\forall i:b\mid a_i&\Longrightarrow&b\mid\Sigma\ a_ik_i\\
4.&b\mid a&\Longrightarrow&bc\mid ac\ (c\in\mathbb Z,c\neq0)\\
5.&b\mid a\ (a\neq0)&\Longrightarrow&|b|\le|a|\\
5.&b\mid a,\ |a|<|b|&\Longrightarrow&a=0\\
\end{array}
$$

### 完全剩余系

若 $a_1,a_2,\dots,a_m$ 对模 $m$ 两两不同余，则这 $m$ 个数构成模 $m$ 的一个完全剩余系。

特殊的，任意连续的 $m$ 个整数都构成模 $m$ 的一个完全剩余系。

## 例题

数竞向，建议先学完整章。

### 例题一

给定模 $m$ 的一组完全剩余系 $x_1,\dots,x_m$，若 $a \perp m$，请证明 $ax_1,\dots,ax_m$ 也是模 $m$ 的一组完全剩余系。

**反证**：假设 $ax_1,\dots,ax_m$ 不是模 $m$ 的完全剩余系。

则一定存在 $i\neq j$ 使得 $ax_i\equiv ax_j\pmod m$。

因为 $a \perp m$，因此有 $x_i\equiv x_j\pmod m$。

与 $x_1,\dots,x_m$ 为模 $m$ 的完全剩余系不符。

假设不成立，故 $ax_1,\dots,ax_m$ 是模 $m$ 的完全剩余系。

### 例题二

设 $n$ 是整数，请证明：$120 \mid n(n^2-1)(n^2-5n+26)$。

**定理**：连续 $n$ 个整数的乘积一定被 $n!$ 整除。

对于这 $n$ 个数都是正整数的：

$$
\begin{array}{l}
(a+1)(a+2)\dots(a+n)=\frac{(a+n)!}{a!}=n!\frac{(a+n)!}{n!a!}=n!\binom{a+n}{a}
\end{array}
$$

而如果这 $n$ 个数存在不是正整数的，那么一定跨过了 $0$，乘积为 $0$，整除是显然的。

**证明**：

$$
\def\arraystretch{1.1}
\begin{array}{ll}
&n(n^2-1)(n^2-5n+26)\\
=&n(n+1)(n-1)[(n-2)(n-3)+20]\\
=&(n-3)(n-2)(n-1)n(n+1)+20(n-1)n(n+1)
\end{array}
$$

因为：

$$
\def\arraystretch{1.1}
\begin{array}{rcl}
120&\mid& (n-3)(n-2)(n-1)n(n+1)\\
6&\mid& (n-1)n(n+1)\\
120&\mid& 20(n-1)n(n+1)
\end{array}
$$

因此 $120\mid(n-3)(n-2)(n-1)n(n+1)+20(n-1)n(n+1)$。

即 $120 \mid n(n^2-1)(n^2-5n+26)$。

### 例题三

设 $n$ 是正整数，且 $2n+1$ 与 $3n+1$ 都是完全平方数。请证明：$40 \mid n$。

**性质１**：奇数的完全平方数模 $8$ 同余于 $1$。

$$(2k+1)^2\equiv4k(k+1)+1\equiv1\pmod8$$

**性质２**：任何一个数的平方模 $5$ 同余于 $0,\pm1$。

$$
\def\arraystretch{1.1}
\begin{array}{lcll}
t&\equiv&0,\pm1,\pm2&\pmod5\\
t^2&\equiv&0,\pm1&\pmod5
\end{array}
$$

**证明**：

因为 $2n+1$ 是奇数且是完全平方数，则

$$
\def\arraystretch{1.1}
\begin{array}{rcll}
2n+1&\equiv&1&\pmod8\\
n&\equiv&0&\pmod4
\end{array}
$$

所以，$n$ 是偶数，$3n+1$ 是奇数且是完全平方数，则

$$
\def\arraystretch{1.1}
\begin{array}{rcll}
3n+1&\equiv&1&\pmod8\\
n&\equiv&0&\pmod8
\end{array}
$$

且

$$
\def\arraystretch{1.1}
\begin{array}{rcll}
2n+1&\equiv&0,\pm1&\pmod5\\
3n+1&\equiv&0,\pm1&\pmod5
\end{array}
$$

则有

$$
\def\arraystretch{1.1}
\begin{array}{rcll}
(2n+1)+(3n+1)&\equiv&2&\pmod5\\
2n+1&\equiv&1&\pmod5\\
3n+1&\equiv&1&\pmod5\\
n&\equiv&0&\pmod5
\end{array}
$$

因此 $n\equiv0\pmod{40}$，即 $40 \mid n$。

### 例题四

求 $10^{10} \bmod 7$。

$$
\def\arraystretch{1.1}
\begin{array}{ll}
&10^{10} \bmod 7\\
=&(10 \bmod 7)^{10\bmod 6}\bmod 7\\
=&3^4\bmod7\\
=&81\bmod7\\
=&4
\end{array}
$$

即 $10^{10}\bmod7=4$。

### 例题五

求满足以下条件的正整数解：$(a,b)+[a,b]+a+b=ab$。

设 $d=(a,b)$，则记 $a=a_0d$，$b=b_0d$（$a_0\perp b_0$）。

$$
\def\arraystretch{1.1}
\begin{array}{rcl}
(a,b)+[a,b]+a+b&=&ab\\
d+a_0b_0d+a_0d+b_0d&=&a_0b_0d^2\\
a_0b_0+a_0+b_0+1&=&a_0b_0d
\end{array}
$$

因为 $a_0b_0\ge a_0b_0,a_0,b_0\ge1$，所以 $0<d\le4$。

当 $d=1$ 时，$a_0+b_0+1=0$，无解。

当 $d=2$ 时，

$$
\def\arraystretch{1.1}
\begin{array}{rcl}
a_0b_0+a_0+b_0+1&=&2a_0b_0\\
a_0b_0-a_0-b_0&=&1\\
a_0(b_0-1)-(b_0-1)&=&2\\
(a_0-1)(b_0-1)&=&2\\
\end{array}
$$

- $a_0-1=1$，$b_0-1=2$；$a_0=2$，$b_2=3$；$a=4$，$b=6$。
- $a_0-1=2$，$b_0-1=1$；$a_0=3$，$b_2=2$；$a=6$，$b=4$。

当 $d=3$ 时，

$$
\def\arraystretch{1.1}
\begin{array}{rcl}
a_0b_0+a_0+b_0+1&=&3a_0b_0\\
2a_0b_0-a_0-b_0&=&1\\
4a_0b_0-2a_0-2b_0&=&2\\
2a_0(2b_0-1)-(2b_0-1)&=&3\\
(2a_0-1)(2b_0-1)&=&3\\
\end{array}
$$

- $2a_0-1=1$，$2b_0-1=3$；$a_0=1$，$b_2=2$；$a=3$，$b=6$。
- $2a_0-1=3$，$2b_0-1=1$；$a_0=2$，$b_2=1$；$a=6$，$b=3$。

当 $d=4$ 时，

$$
\def\arraystretch{1.1}
\begin{array}{rcl}
a_0b_0+a_0+b_0+1&=&4a_0b_0\\
3a_0b_0-a_0-b_0&=&1\\
9a_0b_0-3a_0-3b_0&=&3\\
3a_0(3b_0-1)-(3b_0-1)&=&4\\
(3a_0-1)(3b_0-1)&=&4\\
\end{array}
$$

- $3a_0-1=2$，$3b_0-1=2$；$a_0=b_0=1$；$a=b=4$。
- $2a_0-1=1$，$2b_0-1=4$；不存在整数解。
- $2a_0-1=4$，$2b_0-1=1$；不存在整数解。

因此，可行解有：

$$
(a,b)=(4,6),(6,4),(3,6),(6,3),(4,4)
$$