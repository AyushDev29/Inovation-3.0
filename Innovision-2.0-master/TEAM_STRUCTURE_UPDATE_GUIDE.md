# Team Structure Migration Guide

## Overview
This guide outlines the major database and form changes to implement the new team structure where all team members must be from the same college.

## Changes Made

### Database Changes
1. **New Fields Added**:
   - `player2_class` - Class name for team member 2
   - `player3_class` - Class name for team member 3  
   - `player4_class` - Class name for team member 4

2. **Field Usage Change**:
   - `college` field now represents the **TEAM COLLEGE** (common for all members)
   - Individual `player2_college`, `player3_college`, `player4_college` fields replaced with class fields

3. **New Rules**:
   - All team members must be from the same college
   - Team leader provides common college name
   - Individual class names required for each team member

### Form Changes
1. **BGMI Registration** ✅ Updated
   - Changed college fields to class fields for team members
   - Added team college rule warning
   - Updated validation and database insertion

2. **Other Team Forms** (Need Updates):
   - Free Fire Registration
   - Hackastra Registration  
   - Fun Fusion Registration
   - Fashion Flex Registration (if team event)

### Migration Steps

#### Step 1: Database Migration
```sql
-- Run the migrate-team-structure.sql script in Supabase
-- This adds new class fields and validation
```

#### Step 2: Update Registration Forms
- Update form state to use class fields instead of college fields
- Update validation logic
- Update database insertion logic
- Update UI labels and placeholders
- Add team college rule warnings

#### Step 3: Update Rules Modal
- Add new team rules about same college requirement
- Update event descriptions

#### Step 4: Testing
- Test all team registration forms
- Verify database insertions work correctly
- Test validation rules

## Implementation Status

### ✅ Completed
- Database migration script created
- BGMI Registration form updated
- Team college rule validation added

### 🔄 In Progress  
- Other team registration forms need updates

### ⏳ Pending
- Rules modal updates
- Admin panel updates (if needed)
- Testing and deployment

## Database Schema Changes

### Before
```
registrations:
- college (leader college)
- player2_college (individual)
- player3_college (individual) 
- player4_college (individual)
```

### After
```
registrations:
- college (TEAM college - common for all)
- player2_class (individual class)
- player3_class (individual class)
- player4_class (individual class)
```

## Form Field Changes

### Before
- Team Member 2: Name, Roll No, College
- Team Member 3: Name, Roll No, College  
- Team Member 4: Name, Roll No, College

### After
- Team College: Single field for entire team
- Team Member 2: Name, Roll No, Class
- Team Member 3: Name, Roll No, Class
- Team Member 4: Name, Roll No, Class

## Validation Rules

1. **Same College Rule**: All team members must be from the college specified in the team college field
2. **Class Format**: Class names should follow standard format (e.g., SYBSCIT, TYBCA, etc.)
3. **Required Fields**: All class fields are required for team events

## Safety Measures

1. **Backward Compatibility**: Old college fields are preserved during migration
2. **Gradual Migration**: Forms updated one by one
3. **Rollback Script**: Available in migrate-team-structure.sql
4. **Testing**: Thorough testing before production deployment

## Next Steps

1. Update remaining team registration forms
2. Run database migration script
3. Update rules and documentation
4. Test all functionality
5. Deploy changes
6. Monitor for issues

## Notes

- This is a major structural change that affects all team registrations
- Existing registrations will not be affected (old structure preserved)
- New registrations will use the new structure
- Admin panel may need updates to handle new field structure