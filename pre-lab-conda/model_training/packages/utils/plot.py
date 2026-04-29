import matplotlib.pyplot as plt

def plot_history(history, dropout_rate, save_path=None):
    plt.figure(figsize=(12,4))

    # --- Loss 图 ---
    plt.subplot(1,2,1)
    train_loss = history.history['loss']
    val_loss = history.history['val_loss']

    plt.plot(train_loss, label='train_loss')
    plt.plot(val_loss, label='val_loss')

    # 标注最终数值
    plt.text(len(train_loss)-1, train_loss[-1], f"{train_loss[-1]:.4f}", color='blue')
    plt.text(len(val_loss)-1, val_loss[-1], f"{val_loss[-1]:.4f}", color='orange')

    plt.title(f'Loss (Dropout={dropout_rate})')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()

    # --- Accuracy 图 ---
    plt.subplot(1,2,2)
    train_acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']

    plt.plot(train_acc, label='train_acc')
    plt.plot(val_acc, label='val_acc')

    # 标注最终数值
    plt.text(len(train_acc)-1, train_acc[-1], f"{train_acc[-1]:.4f}", color='blue')
    plt.text(len(val_acc)-1, val_acc[-1], f"{val_acc[-1]:.4f}", color='orange')

    plt.title(f'Accuracy (Dropout={dropout_rate})')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    # 保存或显示
    plt.savefig(save_path, dpi=200, bbox_inches='tight')
    plt.close()
