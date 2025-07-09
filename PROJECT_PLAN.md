# Netto Shift Scheduler - Development Plan

## Project Overview
A Next.js web application for managing employee shift schedules at a Netto store, featuring AI-powered schedule generation and an interactive chat interface for modifications.

## Phase 1: Project Setup (Week 1)

### 1.1 Dependencies Installation
- Install shadcn/ui: `npx shadcn@latest init`
- Install framer-motion: `npm install framer-motion`
- Install OpenAI SDK: `npm install openai`
- Install Zustand: `npm install zustand`
- Install date utilities: `npm install date-fns`

### 1.2 Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── employees/
│   │   ├── schedule/
│   │   ├── history/
│   │   └── settings/
│   └── api/
│       └── openai/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── schedule/
│   └── chat/
├── lib/
│   ├── types/
│   ├── utils/
│   └── store/
└── data/
    └── rules/
```

## Phase 2: Core Data Models & Business Logic

### 2.1 Type Definitions
```typescript
interface Employee {
  id: string;
  name: string;
  age: number;
  type: 'leder' | 'ungarbejder';
  weeklyHours: number;
  availability?: Availability[];
}

interface Shift {
  id: string;
  day: DayOfWeek;
  startTime: string; // "07:00"
  endTime: string;   // "16:00"
  requiredStaff: {
    leder: number;
    ungarbejder: number;
    total: number;
  };
}

interface Schedule {
  id: string;
  weekStart: Date;
  shifts: ScheduledShift[];
  version: number;
  createdAt: Date;
}
```

### 2.2 Shift Rules Configuration
- **Weekdays (Mon-Fri)**:
  - Morning: 07:00-16:00 (3 employees)
  - Evening: 16:00-22:00 (3 employees)
  
- **Weekends (Sat-Sun)**:
  - Early: 07:00-14:00 (2 leder, 1 ungarbejder)
  - Mid: 10:00-17:00 (1 ungarbejder)
  - Late: 14:00-22:00 (3 employees)

### 2.3 Validation Rules
- Minimum 1 leder and 1 ungarbejder per shift
- Employee weekly hours limit check
- No double-booking of employees
- Proper rest time between shifts

## Phase 3: User Interface Components

### 3.1 Dashboard Layout
- Responsive sidebar navigation
- Main content area with routing
- User info and quick actions header

### 3.2 Core Pages
1. **Employees Management**
   - Table view with search/filter
   - Add/Edit employee modal
   - Bulk import option
   
2. **Schedule View**
   - Weekly calendar grid
   - Drag-and-drop functionality
   - Color coding for employee types
   - Shift details on hover
   
3. **Planning Interface**
   - Split view: Schedule + Chat
   - Real-time schedule updates
   - Message history
   - Suggested actions buttons
   
4. **Settings**
   - Shift rules configuration
   - Store hours settings
   - AI behavior preferences
   
5. **History**
   - List of past schedules
   - Version comparison
   - Restore previous versions

## Phase 4: AI Integration

### 4.1 OpenAI Setup
- API key configuration
- System prompt with all rules
- Function calling for schedule modifications
- Error handling and retries

### 4.2 Chat Features
- Natural language schedule generation
- Modification requests handling
- Validation before applying changes
- Explanations for decisions
- Conflict resolution suggestions

### 4.3 Prompt Engineering
- Include all shift rules in system prompt
- Employee constraints and preferences
- Optimization priorities (fairness, efficiency)
- Response format specifications

## Phase 5: State Management

### 5.1 Zustand Stores
- `useEmployeeStore`: Employee CRUD operations
- `useScheduleStore`: Current and historical schedules
- `useChatStore`: Conversation history
- `useSettingsStore`: App configuration

### 5.2 Local Storage
- Persist employee data
- Save schedule history
- Store user preferences
- Cache AI responses

## Phase 6: Key Features Implementation

### 6.1 Schedule Generation Algorithm
1. Gather all employees and their constraints
2. Apply shift rules and requirements
3. Optimize for fair hour distribution
4. Validate against all rules
5. Present to user with explanations

### 6.2 Interactive Modifications
- Click to swap employees
- Drag to change shift times
- Right-click context menu
- Undo/Redo functionality

### 6.3 Validation System
- Real-time rule checking
- Visual indicators for violations
- Blocking invalid operations
- Helpful error messages

## Phase 7: Polish & Optimization

### 7.1 Animations (Framer Motion)
- Page transitions
- Drag and drop feedback
- Loading states
- Success/error notifications

### 7.2 Responsive Design
- Mobile-friendly layout
- Touch-optimized interactions
- Adaptive UI components

### 7.3 Performance
- Efficient re-renders
- Optimistic UI updates
- Debounced API calls

## Technical Considerations

### Security
- Secure API key handling
- Input validation
- XSS prevention

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support

### Browser Support
- Modern browsers only for POC
- Progressive enhancement later

## Future Enhancements (Post-POC)
- Database integration (PostgreSQL)
- User authentication
- Email notifications
- Mobile app
- Export to PDF/Excel
- Employee preferences/requests
- Vacation/sick leave management
- Labor cost calculations
- Multi-store support

## Success Metrics
- Schedule generation < 3 seconds
- Zero rule violations in generated schedules
- Intuitive UI (minimal training needed)
- All shifts properly staffed

This plan creates a solid foundation for a POC that can be extended into a full production system.