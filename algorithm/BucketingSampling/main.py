import random
from collections import defaultdict, Counter

class NGramStatisticalModel:
    def __init__(self, n=2):
        self.n_context = n - 1
        self.lookup_table=defaultdict(Counter)
        
    def train(self, text):
        tokens = text.split()
        for i in range(len(tokens) - self.n_context):
            context = tuple(tokens[i : i + self.n_context])
            target_word = tokens[i + self.n_context]
            self.lookup_table[context][target_word] += 1
                        
    def generate(self, start_text, max_len=20):
        generated_sequence = start_text.split()
        
        for _ in range(max_len):
            current_context = tuple(generated_sequence[-self.n_context :])
            prediction_bucket = self.lookup_table[current_context]
            if not prediction_bucket:
                break
            
            candidate_words = list(prediction_bucket.keys())
            candidate_weights = list(prediction_bucket.values())
            next_word = random.choices(candidate_words, weights=candidate_weights, k=1)[0]
            generated_sequence.append(next_word)
        
        return " ".join(generated_sequence)

model = NGramStatisticalModel(n=3)
model.train("Artificial intelligence is transforming industries, reshaping work, and influencing daily life, creating both opportunities and challenges across society. Transforming Industries AI is revolutionizing sectors such as healthcare, finance, manufacturing, and education. In healthcare, AI-powered tools like convolutional neural networks (CNNs) analyze medical images to detect diseases such as cancer and Alzheimer’s with accuracy rivaling human experts, while machine learning accelerates drug discovery and enables personalized treatment plans tailored to individual patients’ genomic and lifestyle data. In finance and retail, AI optimizes decision-making, improves customer service, and enhances supply chain efficiency. Manufacturing lines now run smoother with AI-driven analytics, reducing waste and increasing productivity. California Learning Resource Network +1 Redefining Work and Society AI is reshaping the nature of work, automating repetitive tasks while creating new roles. Globally, AI has already generated millions of jobs, with industries exposed to AI seeing revenue growth nearly four times faster than before. Tools like ChatGPT, Google Gemini, and Anthropic’s Claude are enabling hybrid workforces, enhancing productivity, and supporting decision-making. However, automation also poses risks to certain white-collar roles, requiring society to adapt through reskilling and workforce planning. Analytics Insight +1 Enhancing Daily Life AI is increasingly integrated into everyday life, from smart assistants and autonomous vehicles to city planning and personalized learning. Generative AI models can produce text, images, and audio, expanding creative possibilities and making complex tasks more accessible. AI also contributes to environmental monitoring, energy optimization, and urban traffic management, demonstrating its potential to improve quality of life. Analytics Insight +1 Ethical and Societal Considerations The rapid adoption of AI raises ethical and societal challenges, including privacy concerns, bias in decision-making, and the need for responsible AI governance. As AI becomes more capable, society must balance innovation with regulation to ensure equitable benefits and mitigate risks. sciencenewstoday.org +1 Global Impact and Future Outlook AI is a global phenomenon, with the US, China, and emerging regions like Southeast Asia and Latin America driving innovation. Investment in AI continues to grow, with companies planning to expand AI deployment across industries from 2025 to 2028. The technology is not just a tool but a transformative force shaping the future of work, creativity, and human interaction. Analytics Insight +2 In summary, AI is already changing the world by enhancing efficiency, creating new opportunities, and challenging traditional systems, while also demanding careful consideration of ethical, social, and economic implications. Built In +3")
print(model.generate("Artificial intelligence", 5))
    