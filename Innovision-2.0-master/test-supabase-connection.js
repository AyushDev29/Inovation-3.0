// Test Supabase Connection and Storage
// Run this in browser console to debug storage issues

import { supabase } from './src/supabaseClient.js';

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...');
    
    try {
        // 1. Test basic connection
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('Auth Status:', user ? 'Authenticated' : 'Anonymous');
        
        // 2. List all buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
            console.error('❌ Error listing buckets:', bucketsError);
            return;
        }
        
        console.log('📦 Available Buckets:');
        buckets.forEach(bucket => {
            console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
        });
        
        // 3. Check if payment-screenshots bucket exists
        const paymentBucket = buckets.find(b => b.name === 'payment-screenshots');
        const collegeBucket = buckets.find(b => b.name === 'college-ids');
        
        console.log('🎯 Payment Bucket Status:', paymentBucket ? '✅ Exists' : '❌ Missing');
        console.log('🎓 College Bucket Status:', collegeBucket ? '✅ Exists' : '❌ Missing');
        
        // 4. Test file upload to available bucket
        if (paymentBucket) {
            console.log('🧪 Testing upload to payment-screenshots bucket...');
            await testUpload('payment-screenshots', 'test/test-file.txt');
        } else if (collegeBucket) {
            console.log('🧪 Testing upload to college-ids bucket (fallback)...');
            await testUpload('college-ids', 'payments/test/test-file.txt');
        } else {
            console.error('❌ No suitable bucket found for testing');
        }
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

async function testUpload(bucketName, fileName) {
    try {
        // Create a small test file
        const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, testFile);
        
        if (error) {
            console.error(`❌ Upload to ${bucketName} failed:`, error);
        } else {
            console.log(`✅ Upload to ${bucketName} successful:`, data.path);
            
            // Clean up test file
            await supabase.storage.from(bucketName).remove([fileName]);
            console.log('🧹 Test file cleaned up');
        }
    } catch (error) {
        console.error(`❌ Upload test error:`, error);
    }
}

// Run the test
testSupabaseConnection();