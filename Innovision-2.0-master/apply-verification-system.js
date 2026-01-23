const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function addVerificationSystem() {
    console.log('🔄 Adding verification system to database...');
    
    try {
        // Add verification_status column
        console.log('Adding verification_status column...');
        const { error: error1 } = await supabase.rpc('exec_sql', { 
            sql_query: `ALTER TABLE registrations 
                       ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' 
                       CHECK (verification_status IN ('pending', 'verified', 'rejected'));`
        });
        
        if (error1) {
            console.error('❌ Error adding verification_status:', error1);
        } else {
            console.log('✅ verification_status column added');
        }

        // Add verification timestamp and admin info
        console.log('Adding verification metadata columns...');
        const { error: error2 } = await supabase.rpc('exec_sql', { 
            sql_query: `ALTER TABLE registrations 
                       ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
                       ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
                       ADD COLUMN IF NOT EXISTS rejection_reason TEXT;`
        });
        
        if (error2) {
            console.error('❌ Error adding metadata columns:', error2);
        } else {
            console.log('✅ Metadata columns added');
        }

        // Create indexes
        console.log('Creating indexes...');
        const { error: error3 } = await supabase.rpc('exec_sql', { 
            sql_query: `CREATE INDEX IF NOT EXISTS idx_registrations_verification_status ON registrations(verification_status);`
        });
        
        if (error3) {
            console.error('❌ Error creating verification index:', error3);
        } else {
            console.log('✅ Verification index created');
        }

        const { error: error4 } = await supabase.rpc('exec_sql', { 
            sql_query: `CREATE INDEX IF NOT EXISTS idx_registrations_verified_at ON registrations(verified_at);`
        });
        
        if (error4) {
            console.error('❌ Error creating verified_at index:', error4);
        } else {
            console.log('✅ Verified_at index created');
        }

        // Update existing registrations
        console.log('Updating existing registrations...');
        const { error: error5 } = await supabase.rpc('exec_sql', { 
            sql_query: `UPDATE registrations 
                       SET verification_status = 'pending' 
                       WHERE verification_status IS NULL;`
        });
        
        if (error5) {
            console.error('❌ Error updating existing records:', error5);
        } else {
            console.log('✅ Existing records updated');
        }
        
        console.log('🎉 Verification system added successfully!');
        
        // Test the new columns
        console.log('🔍 Testing new columns...');
        const { data, error } = await supabase
            .from('registrations')
            .select('id, name, verification_status, verified_at, verified_by')
            .limit(3);
            
        if (error) {
            console.error('❌ Test query failed:', error);
        } else {
            console.log('✅ Test successful. Sample data:', data);
        }
        
    } catch (error) {
        console.error('❌ Failed to add verification system:', error);
    }
}

addVerificationSystem();