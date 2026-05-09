import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# --- 1. 参数设置 ---
V_SIZE = 20      # 词表大小
SEQ_L = 10       # 序列最大长度
D_MODEL = 64     # 词向量维度
NUM_HEADS = 4    # 多头注意力头数
DFF = 128        # 前馈网络中间层维度

# --- 2. 位置编码层 (Positional Embedding) ---
class PositionalEmbedding(layers.Layer):
    def __init__(self, vocab_size, d_model, max_len):
        super().__init__()
        self.embedding = layers.Embedding(vocab_size, d_model)
        # 简单起见，这里使用可学习的位置嵌入
        self.pos_encoding = layers.Embedding(max_len, d_model)
        
    def call(self, x):
        length = tf.shape(x)[-1]
        positions = tf.range(start=0, limit=length, delta=1)
        embedded_tokens = self.embedding(x)
        embedded_positions = self.pos_encoding(positions)
        return embedded_tokens + embedded_positions # 词义 + 位置 🧩

# --- 3. 唯一的加工单元：Decoder Block ---
def transformer_block(d_model, num_heads, dff, rate=0.1):
    inputs = layers.Input(shape=(None, d_model))
    
    # 核心：带掩码的自注意力层 🚫
    # use_causal_mask=True 确保当前词看不到未来的词
    attn = layers.MultiHeadAttention(num_heads=num_heads, key_dim=d_model)(
        inputs, inputs, use_causal_mask=True
    )
    attn = layers.Dropout(rate)(attn)
    out1 = layers.LayerNormalization(epsilon=1e-6)(inputs + attn) # 残差 🔗

    # 前馈网络层 ⚙️
    ffn = layers.Dense(dff, activation='relu')(out1)
    ffn = layers.Dense(d_model)(ffn)
    ffn = layers.Dropout(rate)(ffn)
    out2 = layers.LayerNormalization(epsilon=1e-6)(out1 + ffn) # 残差 🔗
    
    return keras.Model(inputs=inputs, outputs=out2)

# --- 4. 组装 GPT 风格模型 ---
def build_gpt(vocab_size, max_len, d_model, num_heads, dff):
    inputs = layers.Input(shape=(max_len,))
    
    # 第一步：嵌入词义和位置
    x = PositionalEmbedding(vocab_size, d_model, max_len)(inputs)
    
    # 第二步：堆叠 Transformer 块 (这里只堆叠一层作为演示)
    x = transformer_block(d_model, num_heads, dff)(x)
    
    # 第三步：映射回词表概率 🎯
    outputs = layers.Dense(vocab_size, activation='softmax')(x)
    
    return keras.Model(inputs=inputs, outputs=outputs)

# --- 5. 运行与测试 ---
model = build_gpt(V_SIZE, SEQ_L, D_MODEL, NUM_HEADS, DFF)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# 模拟数据
# x 是“问题 + 答案的前 N 个字”
x_train = np.random.randint(1, V_SIZE, (100, SEQ_L))
# y 是 x 整体向后移一位的结果
y_train = np.random.randint(0, V_SIZE, (100, SEQ_L, 1))

print("模型结构摘要：")
model.summary()

# 训练一步试试
model.fit(x_train, y_train, epochs=1, batch_size=32)