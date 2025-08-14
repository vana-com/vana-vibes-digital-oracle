-- Fix OTP expiry security warning by setting a more secure OTP expiry time
-- Note: This updates the auth.config table which controls authentication settings
UPDATE auth.config 
SET 
  otp_expiry = 3600  -- Set OTP expiry to 1 hour (3600 seconds) instead of default longer period
WHERE 
  parameter = 'otp_expiry';