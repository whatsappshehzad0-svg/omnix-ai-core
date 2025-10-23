-- Fix search path security warning
ALTER FUNCTION update_conversations_updated_at() SET search_path = public;