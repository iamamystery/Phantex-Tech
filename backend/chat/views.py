import os
import uuid
from groq import Groq
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import ChatSession, ChatMessage

SYSTEM_PROMPT = """You are the AI assistant for Phantex Tech (phantextech.com), a web automation agency.

COMPANY OVERVIEW:
Phantex Tech helps SaaS startups scale through web scraping, automation, backend development, AI pipelines, frontend development, and API integrations.

TEAM:
- Muhammad Jawad — CEO & Founder
- Syed Muhammad Awais — CTO

SERVICES (be specific about these):
1. Web Scraping & Data Extraction — We scrape any website at scale, clean the data, and deliver it in your preferred format (JSON, CSV, database). Pricing starts at $1,500/project.
2. Browser Automation — We automate repetitive browser tasks: form filling, login flows, data entry, monitoring. Pricing starts at $1,200/project.
3. Backend Development — Custom APIs, microservices, Django/FastAPI backends, database design. Pricing starts at $3,000/project.
4. Frontend Development — React/Next.js frontends, dashboards, admin panels. Pricing starts at $2,500/project.
5. API Development & Integration — Connect your tools together. Custom REST/GraphQL APIs, third-party integrations. Pricing starts at $2,000/project.
6. AI Integration & Pipelines — LLM integration, RAG pipelines, AI automation workflows. Pricing starts at $4,000/project.

BUDGET TIERS:
- Under $5K — Good for single-feature projects
- $5K–$15K — Mid-size projects
- $15K–$50K — Full system builds
- Over $50K — Enterprise partnerships

YOUR GOAL:
1. Answer any question about Phantex Tech's services, process, team, or pricing honestly.
2. Qualify leads by asking: what service they need, their timeline, and their budget range.
3. If they seem ready to move forward, suggest they book a meeting: "You can schedule a call with our team at phantextech.com/schedule"
4. Be concise, professional, and friendly. Never make up information. Keep responses under 120 words unless the user asks for detail.
5. Do NOT discuss competitors. Do NOT discuss politics or anything unrelated to Phantex Tech.
"""


class ChatAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_id = request.data.get("session_id") or str(uuid.uuid4())
        user_message = request.data.get("message", "").strip()

        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create session
        session, _ = ChatSession.objects.get_or_create(session_id=session_id)

        # Save user message
        ChatMessage.objects.create(session=session, role="user", content=user_message)

        # Build message history for Claude
        history = list(session.messages.order_by("timestamp").values("role", "content"))
        claude_messages = [{"role": m["role"], "content": m["content"]} for m in history]

        # Call Groq API with streaming
        try:
            client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
            stream = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}] + claude_messages,
                temperature=1,
                max_completion_tokens=300,
                top_p=1,
                reasoning_effort="medium",
                stream=True,
                stop=None,
            )
            assistant_reply = ""
            for chunk in stream:
                assistant_reply += chunk.choices[0].delta.content or ""
        except Exception as e:
            return Response({"error": f"AI error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save assistant reply
        ChatMessage.objects.create(session=session, role="assistant", content=assistant_reply)

        # Simple lead detection
        lower_msg = user_message.lower()
        if any(word in lower_msg for word in ["budget", "hire", "project", "cost", "price", "work with"]):
            session.is_lead = True
            session.save()

        return Response({
            "session_id": session_id,
            "reply": assistant_reply,
            "is_lead": session.is_lead,
        })
