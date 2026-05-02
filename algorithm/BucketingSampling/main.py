import random
from collections import defaultdict, Counter

class BucketProbabilisticModel:
    def __init__(self, context_size=2):
        # context_size 相当于 N-gram 中的 N-1
        # 我们用字典模拟“桶”，Key 是上下文，Value 是后续词的计数桶
        self.buckets = defaultdict(Counter)
        self.context_size = context_size

    def train(self, text):
        """
        通过扫描文本来填充‘概率桶’
        """
        tokens = text.split()
        for i in range(len(tokens) - self.context_size):
            # 获取当前上下文作为‘桶标签’
            context = tuple(tokens[i : i + self.context_size])
            next_token = tokens[i + self.context_size]
            # 在对应的桶里给这个词加一票
            self.buckets[context][next_token] += 1

    def generate(self, start_context, max_len=20):
        """
        基于桶内概率分布进行采样生成
        """
        result = list(start_context.split())
        current_context = tuple(result[-self.context_size:])

        for _ in range(max_len):
            bucket = self.buckets.get(current_context)
            
            if not bucket:
                break # 遇到没见过的组合（稀疏性问题），模型直接宕机
            
            # Bucketing Sampling 逻辑：根据权重随机抽取
            words = list(bucket.keys())
            counts = list(bucket.values())
            next_word = random.choices(words, weights=counts, k=1)[0]
            
            result.append(next_word)
            current_context = tuple(result[-self.context_size:])
            
        return " ".join(result)

# --- 模拟运行 ---
corpus = """
人工智能 是 趋势 。 人工智能 是 未来 。 人工智能 改变 世界 。
深度学习 是 核心 。 深度学习 驱动 人工智能 。
"""

# 初始化一个 2-gram 纯统计模型
model = BucketProbabilisticModel(context_size=1)
model.train(corpus)

print("--- 纯概率模型输出 ---")
# 模拟自回归生成
print(model.generate("人工智能"))