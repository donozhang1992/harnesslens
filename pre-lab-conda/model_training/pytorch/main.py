import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 1. Prepare Data
transform = transforms.Compose([transforms.ToTensor()])
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

# 2. Define model
class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__() # super().__init__() should also work in python3
        
        # CNN Layer 1
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2)
        
        # CNN Layer 2
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2)
        
        # Fully Connected Layer
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(64 * 5 * 5, 64)
        self.relu3 = nn.ReLU()
        self.fc2 = nn.Linear(64, 10)
        
    def forward(self, x):
        x = self.pool1(self.relu1(self.conv1(x)))
        x = self.pool2(self.relu2(self.conv2(x)))
        x = self.flatten(x)
        x = self.relu3(self.fc1(x))
        x = self.fc2(x)
        return x
    
model = SimpleCNN()

# Loss and Optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr = 0.001)

# Training
epochs = 3
for epoch in range(epochs):
    for batch_idx, (images, labels) in enumerate(train_loader):
        # Zero Gradients
        optimizer.zero_grad()
        # Forward Pass
        prediction = model(images)
        # Calculate Loss
        loss = criterion(prediction, labels)
        # Backward Pass
        loss.backward()
        # Optimizer Weight
        optimizer.step()        