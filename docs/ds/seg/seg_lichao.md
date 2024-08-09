# 李超线段树

## 维护直线

考虑线段树维护区间最优线段。

+ 其中，最优线段指的是，在区间 $[l,r]$ 中，中点 $mid$ 处最优的线段。

+ 我们称一个线段在单点更优 / 最优，显然，是指此处的函数值更大。

+ 我们下面称一个线段在区间内更优 / 最优，是指在中点处的比较。

+ 我们称一个线段在区间 / 单点严格更优，是指在该区间任何一处都更优。

### 插入直线

首先考虑在区间 $[l,r]$ 中插入线段：

+ 若该区间无线段，那么直接让他成为最优线段。

+ 如果已经有了，注意到我们不方便将一个区间下传，因此标记永久化。

设新线段为 $f$，当前的最优线段为 $g$，考虑合并，

+ 我们钦定 $f$ 在区间 $[l,r]$ 弱于 $g$，如果不满足那么交换即可。

1. 若在左右端点 $f$ 都更弱，那么 $g$ 严格优于 $f$，$f$ 不可能成为答案，不需要下传。

2. 若在左端点 $f$ 更优，因为 $f$ 在中点更弱，因此左侧一定存在分界点，递归左侧。

3. 若在右端点 $f$ 更优，因为 $f$ 在中点更弱，因此右侧一定存在分界点，递归右侧。

复杂度分析：

+ 因为两直线最多只有一个交点，因此左右最多递归一个。

+ 因此，时间复杂度为，单次 $\mathcal O(n\log n)$。

---

为何不能钦定 $f$ 强于 $g$ 然后加入 $f$ 捏？

注意到如果 $f$ 严格强于 $g$，那么为了更新答案，我们还是需要交换 $f,g$。

然后这样这个问题相当于没有。

### 查询最值

标记永久化之后，我们需要把从根到叶子节点的每一个最优线段计算。

注意到是区最值，是可以重复的，那么我们随便搞就可以了。

时间复杂度同线段树，为单次 $\mathcal O(\log n)$。

### 代码

[P4254 [JSOI2008] Blue Mary 开公司](https://www.luogu.com.cn/problem/P4254)

??? note "点击查看代码"
	```cpp
	struct line {
		double k, b;
	} p[M];

	int tot;

	double calc(int u, int t) {
		return p[u].b + p[u].k * t;
	}

	#define ls(k) ((k) << 1)
	#define rs(k) ((k) << 1 | 1)

	int best[N << 2];

	void modify(int k, int l, int r, int u) {
		int &v = best[k];
		int mid = (l + r) >> 1;
		if (calc(u, mid) > calc(v, mid)) swap(u, v);
		if (calc(u, l) > calc(v, l)) modify(ls(k), l, mid, u);
		if (calc(u, r) > calc(v, r)) modify(rs(k), mid + 1, r, u);
	}

	double query(int k, int l, int r, int t) {
		double res = calc(best[k], t);
		if (l == r) return res;
		int mid = (l + r) >> 1;
		if (t <= mid) res = max(res, query(ls(k), l, mid, t));
		else res = max(res, query(rs(k), mid + 1, r, t));
		return res;
	}

	void Insert(double k, double b) {
		p[++tot] = {k, b};
		modify(1, 1, (int)5e4, tot);
	}

	double Query(int t) {
		return query(1, 1, (int)5e4, t);
	}
	```

## 维护线段

### 插入线段

我们延续上面的思路，但是。

我们需要线段树式的遍历到每一个节点，才能更新最优线段。

+ 注意到线段树会把区间分为 $\mathcal O(\log n)$ 个区间，

+ 我们需要对每个区间进行 $\mathcal O(\log n)$ 的更新，

+ 因此，总时间复杂度是 $\mathcal O(\log^2n)$ 的。

### 查询最值

和上面没有变化。

### 代码

下面是和上面类似的代码，也很好写。

??? note "点击查看代码"
	```cpp
	struct line {
		double k, b;
	} p[M];

	int tot;

	double calc(int u, int t) {
		return p[u].b + p[u].k * t;
	}

	#define ls(k) ((k) << 1)
	#define rs(k) ((k) << 1 | 1)

	int best[N << 2];

	void update(int k, int l, int r, int u) {
		int &v = best[k];
		int mid = (l + r) >> 1;
		if (calc(u, mid) > calc(v, mid)) swap(u, v);
		if (calc(u, l) > calc(v, l)) update(ls(k), l, mid, u);
		if (calc(u, r) > calc(v, r)) update(rs(k), mid + 1, r, u);
	}

	void modify(int k, int l, int r, int p, int q, int u) {
		if (l >= p && r <= q) return update(k, l, r, u);
		int mid = (l + r) >> 1;
		if (q <= mid) return modify(ls(k), l, mid, p, q, u);
		if (p >= mid + 1) return modify(rs(k), mid + 1, r, p, q, u);
		modify(ls(k), l, mid, p, q, u), modify(rs(k), mid + 1, r, p, q, u);
	}

	double query(int k, int l, int r, int t) {
		double res = calc(best[k], t);
		if (l == r) return res;
		int mid = (l + r) >> 1;
		if (t <= mid) res = max(res, query(ls(k), l, mid, t));
		else res = max(res, query(rs(k), mid + 1, r, t));
		return res;
	}

	void Insert(double k, double b) {
		p[++tot] = {k, b};
		modify(1, 1, (int)5e4, tot);
	}

	double Query(int t) {
		return query(1, 1, (int)5e4, t);
	}
	```

[P4097 【模板】李超线段树 / [HEOI2013] Segment](https://www.luogu.com.cn/problem/P4097)

这个题目强制在线，且需要输出最优线段且编号最小，因此可能会被卡精度，

??? note "精度处理"
	```cpp
	constexpr double eps = 1e-8;

	inline int Cmp(double x, double y) {
		if (x - y > eps) return 1;
		if (y - x > eps) return -1;
		return 0;
	}

	inline pair<double, int> Max(const pair<double, int> &a,
								const pair<double, int> &b) {
		int c = Cmp(a.first, b.first);
		if (c == 0) return a.second < b.second ? a : b;
		return c == 1 ? a : b;
	}
	```