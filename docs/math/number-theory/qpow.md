# 快速幂

## 基础快速幂

```cpp
template<typename T>

struct quick_pow {
	
	static constexpr T pow(T a, T b, T m) {
		T r = 1;
		for (a %= m; b--;)
			r = r * a % m;
		return r;
	}
	
	static constexpr T qpow(T a, T b, T m) {
		T r = 1;
		for (a %= m; b; b >>= 1) {
			if (b & 1)
				r = r * a % m;
			a = a * a % m;
		}
		return r % m;
	}

	static constexpr T spow(T a, const string& b, T m) {
		T res = a, ans = 1;
		for (auto it = b.rbegin(); it != b.rend(); ++it) {
			int x = *it - '0';
			ans = ans * qpow(res, x, m) % m;
			res = qpow(res, 10, m);
		}
		return ans;
	}

};
```

## 结合数论知识

咕咕咕
