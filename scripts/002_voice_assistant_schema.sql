-- Voice Assistant Conversations Table
CREATE TABLE IF NOT EXISTS voice_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Messages (Questions & Answers)
CREATE TABLE IF NOT EXISTS voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES voice_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user_question', 'assistant_answer')),
  message_text TEXT NOT NULL,
  message_text_bangla TEXT,
  audio_url TEXT, -- URL to recorded audio file
  language VARCHAR(10) DEFAULT 'bn', -- 'bn' for Bangla, 'en' for English
  confidence_score FLOAT DEFAULT 0.0, -- 0-1 for speech recognition confidence
  is_corrected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Assistant Settings (User Preferences)
CREATE TABLE IF NOT EXISTS voice_assistant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) DEFAULT 'bn', -- 'bn' or 'en'
  tts_speed FLOAT DEFAULT 0.9, -- 0.5-2.0
  auto_submit_speech BOOLEAN DEFAULT TRUE,
  save_conversation_history BOOLEAN DEFAULT TRUE,
  notification_sound BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Command Shortcuts (for voice commands)
CREATE TABLE IF NOT EXISTS voice_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command_name VARCHAR(100) NOT NULL,
  command_name_bangla VARCHAR(100),
  command_text TEXT NOT NULL, -- The full text/phrase to trigger
  command_action VARCHAR(50) NOT NULL, -- 'navigate', 'add_crop', 'view_alerts', etc.
  action_params JSONB DEFAULT '{}', -- Additional parameters for the action
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, command_name)
);

-- TTS Request Logs (for monitoring and optimization)
CREATE TABLE IF NOT EXISTS tts_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text_length INT NOT NULL,
  language VARCHAR(10) NOT NULL,
  response_time_ms INT, -- milliseconds
  status VARCHAR(20) NOT NULL DEFAULT 'success', -- 'success', 'error', 'timeout'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speech Recognition Accuracy Tracking
CREATE TABLE IF NOT EXISTS speech_recognition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_duration_ms INT, -- duration of audio in milliseconds
  recognized_text TEXT NOT NULL,
  confidence_score FLOAT NOT NULL, -- 0-1
  language VARCHAR(10) NOT NULL,
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  browser_name VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_voice_conversations_user_id ON voice_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_messages_conversation_id ON voice_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_voice_messages_user_id ON voice_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_messages_created_at ON voice_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_commands_user_id ON voice_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_tts_request_logs_user_id ON tts_request_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_speech_recognition_logs_user_id ON speech_recognition_logs(user_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE voice_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_assistant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_request_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_recognition_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: voice_conversations - Users can only see their own conversations
CREATE POLICY "Users can only view their own voice conversations"
ON voice_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own voice conversations"
ON voice_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: voice_messages - Users can only see messages in their conversations
CREATE POLICY "Users can only view their own voice messages"
ON voice_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own voice messages"
ON voice_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: voice_assistant_settings - Users can only manage their own settings
CREATE POLICY "Users can only view their own voice assistant settings"
ON voice_assistant_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own voice assistant settings"
ON voice_assistant_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own voice assistant settings"
ON voice_assistant_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: voice_commands - Users can only manage their own commands
CREATE POLICY "Users can only view their own voice commands"
ON voice_commands FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own voice commands"
ON voice_commands FOR ALL
USING (auth.uid() = user_id);

-- RLS Policy: Logging tables - Users can only view their own logs
CREATE POLICY "Users can only view their own TTS logs"
ON tts_request_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own speech recognition logs"
ON speech_recognition_logs FOR SELECT
USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE voice_conversations IS 'Stores individual voice conversation sessions for users';
COMMENT ON TABLE voice_messages IS 'Stores individual messages (questions and answers) within conversations';
COMMENT ON TABLE voice_assistant_settings IS 'User preferences for voice assistant (language, speed, notifications)';
COMMENT ON TABLE voice_commands IS 'Custom voice commands that users can create for quick actions';
COMMENT ON TABLE tts_request_logs IS 'Logs for monitoring Text-to-Speech API performance and errors';
COMMENT ON TABLE speech_recognition_logs IS 'Logs for monitoring speech recognition accuracy and performance';
