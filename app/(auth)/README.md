# Authentication Routes

## Current Structure
```
(auth)/
├── _layout.tsx         # Auth layout configuration
├── index.tsx          # Auth landing/redirect page
├── login.tsx         # Login screen
└── signup.tsx       # Signup screen
```

## Route Definitions

### _layout.tsx
```typescript
<Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="login" />
  <Stack.Screen name="signup" />
</Stack>
```

### Routes
- `/(auth)` - Landing/redirect page
- `/(auth)/login` - Login screen
- `/(auth)/signup` - Signup screen

## Usage
```typescript
// Navigate to auth
router.replace('/(auth)');

// Navigate to login
router.replace('/(auth)/login');

// Navigate to signup
router.replace('/(auth)/signup');
```

## Future Considerations

### Potential Additional Routes
1. `/(auth)/forgot-password`
   - Password reset functionality
   - Email verification

2. `/(auth)/verify-email`
   - Email verification page
   - Confirmation handling

3. `/(auth)/reset-password`
   - Password reset form
   - Token verification

4. `/(auth)/social-auth`
   - Social login integrations
   - OAuth handling

### Security Considerations
- All routes in this group should be accessible only to non-authenticated users
- Use `redirect={isAuthenticated}` to prevent authenticated users from accessing these routes
- Implement rate limiting for login attempts
- Add CAPTCHA for signup/login forms

### Best Practices
- Keep authentication logic in dedicated hooks/services
- Implement proper error handling and user feedback
- Use secure storage for tokens
- Clear sensitive data on logout 