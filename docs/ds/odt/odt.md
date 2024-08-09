# 珂朵莉树

珂朵莉树（Chtholly Tree），又名老司机树 ODT（Old Driver Tree）。

起源自 lxl 的 [CF896C Willem, Chtholly and Seniorious](https://codeforces.com/problemset/problem/896/C)。

前置知识：`std::set`。

## 思想

将区间用 set 维护，每次对一个区间进行操作的时候，就将这个区间分离（split）出来。

复杂度的保证依靠推平操作，由于这个操作大幅减少了节点的数量，因此可以达到减少操作次数的目的；而对于每一个查询操作，暴力求解。

因此，我们可以得出卡死珂朵莉树的方法：避免推平操作，甚至没有推平操作，这样珂朵莉树就退化为暴力的 $\mathcal O(nm)$ 了。（珂朵莉很伤心~）

## 用途

珂朵莉树比较好写，且对于随机数据复杂度较快。

适用于：

+ 区间操作，需要有区间推平（赋值）操作，具体可以看下面的。

+ 区间查询，尤其是一些奇怪的操作。

**保证数据随机**：$n$ 个数 $m$ 个操作，均摊复杂度 $\mathcal O(m \log n)$。

在数据不随机的情况下，需要一些技巧例如树链剖分，线段树、平衡树维护 ODT 等，才能过。

极少数题目是珂朵莉树为正解的，有一些上古题目没有 Hack 珂朵莉树的仍然可以来做。

对于现代题目，珂朵莉树的主要作用是来骗分、对拍。

## 操作

#### 节点的存储

```cpp
struct node_t {
	int l, r; mutable int v;
	node_t(int l): l(l) {}
	node_t(int l, int r, int v): l(l), r(r), v(v) {}
	friend bool operator <(const node_t &a, const node_t &b)
	{ return a.l < b.l; }
};
```

- 显然的，使用结构体存储区间为一个节点，每个节点对于它的范围 $[l,r]$ 和值 $v$，此处的 $v$ 显然是你指定的数据。
- 标识符 `mutable` 表示「可修改的」，与 `const` 对应，其作用是，对于放入 set 中的节点，可以在不取出的情况下，修改其 $v$ 的值。

#### 珂朵莉树本珂

```cpp
set<node_t> odt;
```

- 显然的，没有解释。

#### 区间分裂

```cpp
auto split(int x) {
	auto it = --odt.upper_bound(node_t(x));
	if (it->l == x) return it;
	auto [l, r, v] = *it;
	odt.erase(it); odt.emplace(l, x - 1, v);
	return odt.emplace(x, r, v).first;
}
```

- `split` 操作是珂朵莉树的根本操作，其作用是，对于包含一个 $x$ 的区间，将其分裂为两个区间 $[l,x),[x,r]$，并返回 $x$ 处的迭代器。
- `upper_bound` 表示找到第一个 $\ge x$ 的节点，然后将其自减，即可以找到第一个 $l \le x$ 的节点了。
- `it->l == x` 如果 $x$ 已经是这个区间的左端点，那么就没有必要分裂，直接返回此迭代器即可。
- 否则，删除这个节点，并添加上对于的节点。注意 set 的 insert 返回值为一个 `pair<iterator, bool>` 分别表示加入的元素的迭代器，以及是否成功添加。

#### 区间分离

```cpp
auto get(int l, int r) {
	auto itr = split(r + 1), itl = split(l);
	return make_pair(itl, itr);
}
```

- 表示将区间 $[l,r]$ 分离出来，并返回其迭代器 $[itl,itr)$。
- 关于为什么要 split 的是 $r + 1$ 而不是 $r$，其实是因为，我们的 split 可以将区间从 $x$ 处分开，而想要将 $[l,r]$ 分离出来，就需要从 $r+1$ 断开，而不是 $r$。（说这个的原因是 [这篇文章](https://blog.csdn.net/weixin_45826022/article/details/109301573) 给出解释显然是错的）
- **注意**（易错点）：此处要先 split 右端点 $r+1$ 然后再 split 左端点 $l$，因为当我们将右端点分离时，如果 $l$ 和 $r+1$ 位于一个节点中，那么我们在 split 端点 $r+1$ 时，就会将端点 $l$ 所在的节点 erase 掉，如此就迭代器失效，导致 RE。

#### 区间插入

```cpp
void insert(int l, int r, int v) {
	odt.emplace(l, r, v);
}
```

- 显然的，没有解释。

#### 区间推平

```cpp
void assign(int l, int r, int v) {
	auto [itl, itr] = get(l, r);
	odt.erase(itl, itr);
	odt.emplace(l, r, v);
}
```

- 先将区间 $[l,r]$ 分离出来，然后删除 $[itl,itr)$ 内的所有节点，最后加入新增的节点。
- 注意这里用到了 set 的 erase 用法，传入左、右迭代器，删除两个迭代器之间的节点。

#### 其他操作

```cpp
void performance(int l, int r, auto op) {
	auto [itl, itr] = get(l, r);
	for (; itl != itr; ++itl) op(itl);
}
```

- 套板子就好了，下文会总结一些常见的操作。

## 常见操作

#### 区间加

```cpp
void add(int l, int r, ll v) {
	auto [itl, itr] = get(l, r);
	for (; itl != itr; ++itl) itl->v += v;
}
```

#### 区间 rk.k

```cpp
auto rank_k(int l, int r, int k) -> ll {
	vector<pair<ll, int>> bucket;
	auto [itl, itr] = get(l, r);
	for (; itl != itr; ++itl) bucket.push_back({itl->v, itl->r - itl->l + 1});
	sort(bucket.begin(), bucket.end());
	for (auto i : bucket) if ((k -= i.second) <= 0) return i.first;
	return -1;
}
```

#### 求差推平

有时我们需要快速求出一些数据，比如区间内 $1$ 的个数，在只有推平的情况下，我们可以在推平的过程中实时记录变化值 $\Delta\mathit{sum}$。

```cpp
int assign_result(int l, int r, int v) {
	auto [itl, itr] = get(l, r);
	auto itb = itl; int res = 0;
	for (; itl != itr; ++itl) if (itl->v != v)
	res += (v - itl->v) * (itl->r - itl->l + 1);
	odt.erase(itb, itr), odt.emplace(l, r, v);
	return res;
}
```

#### 处理细节问题

关于 Debug：

```cpp
void debug() {
	for (auto [l, r, v] : odt)
	cerr << "(" << l << " " << r << ": " << v << ")";
	cerr << endl;
}
```

关于 $n+1$：

我们推荐在初始化（insert）之后再添加一个区间 $[n+1,n+1]$，因为如果不添加的话，查询区间 $[*,n]$ 就会导致不可预料的错误。

## 关于非随机数据

在数据随机的情况下，显然珂朵莉树的复杂度为 $\mathcal O(m\log n)$，但是前文也说过，珂朵莉树的复杂度是不正确的，出题人就算用脚造数据也能随随便便的卡死珂朵莉树（伤心

于是我们就需要一些优化的技巧，或者其他方式维护 ODT 了。

还有一类问题（[P4979 矿洞：坍塌](https://www.luogu.com.cn/problem/P4979)），查询一个区间是否值相同。我们会发现，理论上，值相同的区间最好由节点表示，因此我们可以得出优化的方法，一边查询一边讲等值的区间推平，注意到推平操作也是有 $\mathcal O(\log n)$ 的复杂度的，因此我们记录一下，最远可以延伸到的位置，使得这个区间值全都相等，再推平这个区间即可。

PS：这个不知道将来会不会被 hack，详见我发的讨论 <https://www.luogu.com.cn/discuss/732354>。

## 关于吸氧

珂朵莉树不是正解的题，大部分时候需要吸氧，可能是因为珂朵莉掉水里了（威廉快去救你老婆。

## 例题

链接：<https://www.luogu.com.cn/training/418574>。

最后的最后，放一个大模板吧。

??? note "点击查看代码"
    ```cpp
    class odt_t {

    private:

    struct node_t {
        int l, r; mutable int v;
        node_t(int l): l(l) {}
        node_t(int l, int r, int v): l(l), r(r), v(v) {}
        friend bool operator <(const node_t &a, const node_t &b)
        { return a.l < b.l; }
    };

    set<node_t> odt;

    auto split(int x) {
        auto it = --odt.upper_bound(node_t(x));
        if (it->l == x) return it;
        auto [l, r, v] = *it;
        odt.erase(it); odt.emplace(l, x - 1, v);
        return odt.emplace(x, r, v).first;
    }

    auto get(int l, int r) {
        auto itr = split(r + 1), itl = split(l);
        return make_pair(itl, itr);
    }

    public:

    void insert(int l, int r, int v) {
        odt.emplace(l, r, v);
    }

    void assign(int l, int r, int v) {
        auto [itl, itr] = get(l, r);
        odt.erase(itl, itr);
        odt.emplace(l, r, v);
    }

    int assign_result(int l, int r, int v) {
        auto [itl, itr] = get(l, r);
        auto itb = itl; int res = 0;
        for (; itl != itr; ++itl) if (itl->v != v)
        res += (v - itl->v) * (itl->r - itl->l + 1);
        odt.erase(itb, itr), odt.emplace(l, r, v);
        return res;
    }

    void add(int l, int r, ll v) {
        auto [itl, itr] = get(l, r);
        for (; itl != itr; ++itl) itl->v += v;
    }

    auto rank_k(int l, int r, int k) -> ll {
        vector<pair<ll, int>> bucket;
        auto [itl, itr] = get(l, r);
        for (; itl != itr; ++itl) bucket.push_back({itl->v, itl->r - itl->l + 1});
        sort(bucket.begin(), bucket.end());
        for (auto i : bucket) if ((k -= i.second) <= 0) return i.first;
        return -1;
    }

    void debug() {
        for (auto [l, r, v] : odt)
        cerr << "(" << l << " " << r << ": " << v << ")";
        cerr << endl;
    }

    };
    ```
