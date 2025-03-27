# Root Routes

## Current Structure
```
app/
├── _layout.tsx              # Root layout (main navigation)
├── index.tsx               # Home screen
├── explore.tsx            # Explore/search screen
├── profile.tsx           # Profile overview
├── saved.tsx            # Saved items
├── sell.tsx            # Create listing
├── (auth)/            # Auth routes group
├── chat/             # Chat routes group
└── user/            # User settings group
```

## Route Definitions

### _layout.tsx
```typescript
<Stack screenOptions={{ headerShown: false }}>
  {/* Auth Group */}
  <Stack.Screen name="(auth)" redirect={isAuthenticated} />

  {/* Main Routes */}
  <Stack.Screen name="index" redirect={!isAuthenticated} />
  <Stack.Screen name="explore" redirect={!isAuthenticated} />
  <Stack.Screen name="saved" redirect={!isAuthenticated} />
  <Stack.Screen name="sell" redirect={!isAuthenticated} />
  <Stack.Screen name="profile" redirect={!isAuthenticated} />
  
  {/* Feature Groups */}
  <Stack.Screen name="user" redirect={!isAuthenticated} />
  <Stack.Screen name="chat" redirect={!isAuthenticated} />
</Stack>
```

### Main Routes
- `/` - Home screen
- `/explore` - Browse/search listings
- `/saved` - Saved items
- `/sell` - Create new listing
- `/profile` - User profile

## Usage
```typescript
// Navigate to home
router.replace('/');

// Navigate to explore with search
router.push({
  pathname: '/explore',
  params: { search: 'query' }
});

// Navigate to sell
router.push('/sell');
```

## Future Considerations

### Potential Additional Routes
1. `/categories`
   - Category browsing
   - Filtered views

2. `/notifications`
   - System notifications
   - Alerts center

3. `/search`
   - Advanced search
   - Filters and sorting

4. `/trending`
   - Popular items
   - Featured listings

### Feature Groups
Consider adding these route groups:
1. `/(admin)/`
   - Admin dashboard
   - User management
   - Content moderation

2. `/(marketplace)/`
   - Shopping cart
   - Checkout process
   - Order management

3. `/(community)/`
   - Forums
   - Discussion boards
   - User reviews

### Best Practices
- Keep route names consistent and meaningful
- Use route groups for related features
- Implement proper loading states
- Handle deep linking
- Manage navigation history
- Implement proper error boundaries
- Use TypeScript for route typing
- Document route parameters

### Authentication
- Protect routes appropriately
- Handle session expiration
- Manage auth state consistently
- Implement proper redirects
- Cache auth state efficiently

### Performance
- Implement route preloading
- Use route-based code splitting
- Cache route data appropriately
- Optimize navigation animations
- Handle back navigation efficiently 