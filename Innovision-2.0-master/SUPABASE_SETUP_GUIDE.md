# 🗄️ Supabase Database Setup Guide for Innovision 3.0

## Step 1: Access Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project: `xoodmjzorcqqzmbhpbuy`
3. Click on **"SQL Editor"** in the left sidebar (icon looks like `</>`)

## Step 2: Run the Database Schema

1. Click **"New Query"** button
2. Copy the entire content from `supabase-schema.sql` file
3. Paste it into the SQL editor
4. Click **"Run"** button (or press Ctrl+Enter)

## Step 3: Verify Tables Were Created

After running the schema, you should see:
- ✅ `events` table created with 8 events
- ✅ `registrations` table created (empty initially)
- ✅ Indexes created for performance
- ✅ Row Level Security (RLS) enabled
- ✅ Policies created for public and admin access

## Step 4: Check Your Tables

### View Events Table:
```sql
SELECT * FROM events;
```

### View Registrations Table:
```sql
SELECT * FROM registrations;
```

## Step 5: Create Admin User (For Admin Panel Login)

1. Go to **"Authentication"** in the left sidebar
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `admin@innovision.com` (or your preferred email)
   - **Password**: Create a strong password
4. Click **"Create user"**

## Step 6: Test Registration Form

1. Go to your deployed website
2. Click on any event
3. Fill out the registration form
4. Submit the form
5. Check Supabase → **"Table Editor"** → **"registrations"** to see the new entry

## Step 7: Test Admin Panel

1. Go to your website: `https://your-site.netlify.app/admin`
2. Login with the admin credentials you created
3. You should see all registrations in the dashboard
4. Test the filters and Excel export

## 📊 Database Structure

### Events Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_name | TEXT | Event name (unique) |
| category | TEXT | E-Sports, Technical, Fun |
| description | TEXT | Event description |
| date | TEXT | Event date and time |
| venue | TEXT | Event location |
| team_size | TEXT | Team size requirement |
| prize | TEXT | Prize money |
| created_at | TIMESTAMP | Creation timestamp |

### Registrations Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | Foreign key to events |
| name | TEXT | Leader/Individual name |
| email | TEXT | Email (unique per event) |
| phone | TEXT | Phone number |
| class | TEXT | Class/Year |
| college | TEXT | College name |
| team_name | TEXT | Team name (nullable) |
| player2_name | TEXT | Team member 2 (nullable) |
| player3_name | TEXT | Team member 3 (nullable) |
| player4_name | TEXT | Team member 4 (nullable) |
| created_at | TIMESTAMP | Registration timestamp |

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Public read access** to events table
- ✅ **Public insert access** to registrations (for form submissions)
- ✅ **Authenticated access** for admin panel (read all registrations)
- ✅ **Unique constraint** prevents duplicate registrations (same email + event)

## 🎯 Features Implemented

1. ✅ Event registration with form validation
2. ✅ Team-based events (Free Fire, Hackathon)
3. ✅ Individual events (Blind Type, UI/UX, etc.)
4. ✅ Admin authentication
5. ✅ Registration dashboard with filters
6. ✅ Search functionality (name, email, phone)
7. ✅ Event-based filtering
8. ✅ Excel export for registrations
9. ✅ Duplicate registration prevention
10. ✅ Real-time data updates

## 🐛 Troubleshooting

### Issue: "Event not found in database"
**Solution**: Make sure all events in your `Events.jsx` match exactly with the `event_name` in the database.

### Issue: "Permission denied"
**Solution**: Check that RLS policies are correctly set up. Run the schema again if needed.

### Issue: "Admin login not working"
**Solution**: Make sure you created an admin user in Supabase Authentication section.

### Issue: "Registrations not showing in admin panel"
**Solution**: Check browser console for errors. Verify the admin user is authenticated.

## 📝 Notes

- The anon key is safe to use in client-side code (it's public)
- Never expose the service_role key in your frontend
- All form data is validated before insertion
- Timestamps are automatically added to all records
- The database prevents duplicate registrations automatically

## 🚀 You're All Set!

Your Innovision 3.0 registration system is now fully functional with:
- ✅ Database schema created
- ✅ Events populated
- ✅ Registration form connected
- ✅ Admin panel ready
- ✅ Security configured

Happy event management! 🎉