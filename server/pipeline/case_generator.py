from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatGroq

llama = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0.8
)

gpt_mini = ChatOpenAI(
    model="gpt-4.1-mini",
    temperature=0.2
)

gpt_full = ChatOpenAI(
    model="gpt-4.1",
    temperature=0.1
)
