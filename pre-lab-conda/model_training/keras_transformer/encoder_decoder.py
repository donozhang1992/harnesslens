import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# --- 1. 核心模块：Transformer Block ---

def transformer_encoder_block(d_model, num_heads, dff, rate=0.1):
    # 多头自注意力层 🧠
    inputs = layers.Input(shape=(None, d_model)) ？
    attn_output = layers.MultiHeadAttention(num_heads=num_heads, key_dim=d_model//num_heads)(inputs, inputs)
    attn_output = layers.Dropout(rate)(attn_output)
    out1 = layers.LayerNormalization(epsilon=1e-6)(inputs + attn_output) # 残差连接 🔗

    # 前馈网络层 ⚙️
    ffn_output = layers.Dense(dff, activation='relu')(out1)
    ffn_output = layers.Dense(d_model)(ffn_output)
    ffn_output = layers.Dropout(rate)(ffn_output)
    out2 = layers.LayerNormalization(epsilon=1e-6)(out1 + ffn_output) # 残差连接 🔗
    
    return keras.Model(inputs=inputs, outputs=out2)

def transformer_decoder_block(d_model, num_heads, dff, rate=0.1):
    inputs = layers.Input(shape=(None, d_model))
    enc_output = layers.Input(shape=(None, d_model))
    
    # A. 掩码自注意力 (Masked Self-Attention) 屏蔽未来信息 🚫
    attn1 = layers.MultiHeadAttention(num_heads=num_heads, key_dim=d_model)(inputs, inputs, use_causal_mask=True)
    out1 = layers.LayerNormalization(epsilon=1e-6)(inputs + attn1)

    # B. 交叉注意力 (Cross-Attention) 查阅 Encoder 的信息 🌉
    attn2 = layers.MultiHeadAttention(num_heads=num_heads, key_dim=d_model)(out1, enc_output)
    out2 = layers.LayerNormalization(epsilon=1e-6)(out1 + attn2)

    # C. 前馈网络 ⚙️
    ffn_output = layers.Dense(dff, activation='relu')(out2)
    ffn_output = layers.Dense(d_model)(ffn_output)
    out3 = layers.LayerNormalization(epsilon=1e-6)(out2 + ffn_output)
    return keras.Model(inputs=[inputs, enc_output], outputs=out3)

# --- 2. 组装完整模型 ---

def build_transformer(vocab_size, max_len, d_model, num_heads, dff):
    # Encoder 部分
    enc_inputs = layers.Input(shape=(max_len,))
    x = layers.Embedding(vocab_size, d_model)(enc_inputs) # 词嵌入 🗂️
    # 简化版：这里略过了 Positional Encoding，实际生产需要加上
    enc_out = transformer_encoder_block(d_model, num_heads, dff)(x)

    # Decoder 部分
    dec_inputs = layers.Input(shape=(max_len,))
    x = layers.Embedding(vocab_size, d_model)(dec_inputs)
    dec_out = transformer_decoder_block(d_model, num_heads, dff)([x, enc_out])

    # 输出层：预测下一个词的概率 🎯
    outputs = layers.Dense(vocab_size, activation='softmax')(dec_out)
    
    return keras.Model(inputs=[enc_inputs, dec_inputs], outputs=outputs)

# --- 3. 准备模拟数据并训练 ---

# 参数设置
V_SIZE, SEQ_L, D_MOD = 20, 10, 64
model = build_transformer(V_SIZE, SEQ_L, D_MOD, 4, 128)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")

# 模拟数据：输入 [1, 2, 3...]，目标输出 [3, 2, 1...]
x_enc = np.random.randint(1, V_SIZE, (100, SEQ_L))
x_dec = np.random.randint(1, V_SIZE, (100, SEQ_L))
y = np.random.randint(0, V_SIZE, (100, SEQ_L, 1))

print("开始训练...")
model.fit([x_enc, x_dec], y, epochs=2, batch_size=16)
print("模型跑通了！")