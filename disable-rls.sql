-- Disable Row Level Security on storage.objects
-- This will allow public listing of all buckets

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
