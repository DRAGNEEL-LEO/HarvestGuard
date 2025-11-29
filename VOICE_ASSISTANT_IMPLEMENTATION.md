# Voice Assistant Implementation - Bangla Q/A with Gemini API

## Overview
The voice assistant has been enhanced to provide intelligent, context-aware agricultural answers in Bengali using the Gemini 2.0 Flash API, integrated with the Web Speech API for speech recognition and synthesis.

## Components

### 1. Backend API: `/app/api/voice/answer/route.ts`

**Purpose**: Generate intelligent agricultural answers in Bangla using Gemini API

**Features**:
- Accepts POST requests with Bengali questions
- Calls Gemini 2.0 Flash API with agricultural context prompt
- Returns structured JSON response with English and Bangla answers
- Includes confidence score for each response
- Error handling with fallback responses
- Uses streaming-capable JSON parsing for Gemini responses

**Response Structure**:
```json
{
  "data": {
    "answer": "Answer in English",
    "answerBangla": "উত্তর বাংলায়",
    "confidence": 0.95
  }
}
```

**Gemini Prompt Context**:
- Agricultural advisor expertise (Bangladeshi farming focus)
- Instructions for Bangla output with practical, actionable advice
- Support for various topics: crops, pest management, storage, harvest timing
- Emphasis on local/traditional methods applicable to Bangladesh

### 2. Frontend Component: `app/voice-assistant/page.tsx`

**Features**:
- **Web Speech API Integration**:
  - Speech Recognition (bn-BD language)
  - Speech Synthesis for text-to-speech responses
  - Real-time transcript display during listening
  
- **User Interface**:
  - Chat-style message display (user on right, assistant on left)
  - Voice input button (Start/Stop listening)
  - Text input fallback for typing questions
  - Common questions quick-select buttons
  - Loading state with animated dots while API processes
  - Language support (English/Bangla)

- **Workflow**:
  1. User speaks or types a question in Bengali
  2. Question sent to `/api/voice/answer` API
  3. Gemini generates context-aware Bangla response
  4. Response displayed in chat and spoken via TTS
  5. Conversation history maintained in UI

### 3. Data Flow

```
User Question (Voice/Text in Bengali)
    ↓
Web Speech API (captures Bengali speech)
    ↓
Frontend fetches /api/voice/answer
    ↓
Backend sends Bengali question to Gemini 2.0 Flash
    ↓
Gemini generates JSON with English + Bangla answer
    ↓
Response returned to frontend
    ↓
Display in chat + Speak via Speech Synthesis API (bn-BD)
```

## Technical Details

### Environment Configuration
- **Required**: `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`
- Currently set to: `AIzaSyB4fe1DUGVXqd5LHcAMMkJ4Chj3wE5nz2c`

### Gemini API Settings
- **Model**: `gemini-2.0-flash` (fast, cost-efficient)
- **Temperature**: 0.5 (balanced between creativity and accuracy)
- **Max Output Tokens**: 512 (concise Bangla responses)
- **Response Format**: Strict JSON for reliable parsing

### Web Speech API Languages
- **Speech Recognition**: `bn-BD` (Bengali - Bangladesh)
- **Speech Synthesis**: `bn-BD` (Bengali - Bangladesh)
- **Speech Rate**: 0.9x (slightly slower for clarity)

### Error Handling
1. **Missing API Key**: Returns error message
2. **Gemini API Failure**: Falls back to generic agricultural advisory message
3. **JSON Parse Failure**: Attempts cleanup of markdown formatting, then fallback response
4. **Network Error**: Graceful error display with retry capability

## Usage Examples

### Question Types Supported
- **Crop Management**: "আমার ধানের ফসল কীভাবে রক্ষা করব?" (How to protect my rice crop?)
- **Storage Tips**: "গুদামের আর্দ্রতা কীভাবে নিয়ন্ত্রণ করব?" (How to control storage humidity?)
- **Pest Control**: "কীটনাশক কখন প্রয়োগ করব?" (When to apply pesticide?)
- **Harvest Timing**: "ধান কখন কাটব?" (When to harvest rice?)
- **Weather Related**: "আগামীকাল বৃষ্টি হবে কিনা?" (Will it rain tomorrow?)

### Workflow
1. Click **"মাইক শুরু করুন"** button to start listening
2. Speak your question in Bengali
3. Transcript appears in real-time
4. Stop listening or wait for recognition to complete
5. API generates answer
6. Answer displays in chat and is spoken aloud
7. Alternatively, type question and click **"উত্তর"** button

## Testing

### API Test (POST Request)
```bash
curl -X POST http://localhost:3000/api/voice/answer \
  -H "Content-Type: application/json" \
  -d '{"question": "ধান সংরক্ষণের সেরা পদ্ধতি কী?"}'
```

Expected Response:
```json
{
  "data": {
    "answer": "Store rice at moisture content below 14% in a cool, dry place...",
    "answerBangla": "ধান ১৪% এর নিচে আর্দ্রতায় ঠান্ডা, শুষ্ক স্থানে সংরক্ষণ করুন...",
    "confidence": 0.92
  }
}
```

### Browser Test
1. Open http://localhost:3000/voice-assistant
2. Try speaking or typing questions in Bengali
3. Verify answers appear in chat and are spoken aloud
4. Check browser console for any API errors

## Build Status
✅ Production build successful
✅ `/api/voice/answer` route compiled and deployed
✅ All pages render without SSR issues
✅ Web Speech API works in Chromium/Chrome browsers

## Browser Compatibility
- **Chromium-based**: Full support (Chrome, Edge, Opera)
- **Firefox**: Partial support (speech recognition may not work for all locales)
- **Safari**: Limited support (speech recognition varies by version)

## Future Enhancements
- [ ] Persist conversation history to Supabase
- [ ] Add conversation context to API (use previous Q/A for continuity)
- [ ] Implement voice command for actions (e.g., "add crop batch")
- [ ] Add confidence threshold - warn user if confidence < 0.6
- [ ] Implement offline fallback with mock responses
- [ ] Add multi-language support (currently Bangla-optimized)

## Known Limitations
1. Web Speech API browser support varies (best on Chrome/Edge)
2. Bangla speech recognition accuracy depends on user pronunciation
3. API response latency (typically 2-3 seconds with Gemini)
4. Session-only conversation history (not persisted)
5. No voice commands for app navigation (only for questions)

## Dependencies
- `google-generative-ai` (implicit via REST API calls)
- Web Speech API (browser native)
- Next.js 16 (server route handling)
- React 19 (state management, hooks)

## Related Files
- `app/voice-assistant/page.tsx` - Frontend component
- `app/api/voice/answer/route.ts` - Backend API
- `.env.local` - Configuration (Gemini API key)
- `lib/i18n.ts` - Language strings for UI
