const assert = require('assert');
const { randomUUID } = require('crypto');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log("Running P0.1 Automated Tests...");
    
    // Create cookie jar mechanism using fetch
    let cookies = '';
    const fetchAuth = async (url, options = {}) => {
        options.headers = options.headers || {};
        if (cookies) options.headers['Cookie'] = cookies;
        const res = await fetch(url, options);
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            // Simplified cookie extraction for testing
            cookies = setCookie.split(';')[0];
        }
        return res;
    };

    // 1. Provisioning is tested via dev_setup_onboarding.js that we ran earlier.
    // Username generated: tuantq, password: 050787, status: PROVISIONED

    // 2. Authentication flow
    console.log("Testing Login with Initial Credentials...");
    let res = await fetchAuth(`${BASE_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tuantq', password: 'wrongpassword' })
    });
    assert.strictEqual(res.status, 401, "Should fail with wrong password");

    res = await fetchAuth(`${BASE_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tuantq', password: '050787' })
    });
    assert.strictEqual(res.status, 200, "Should login with temp password");
    let data = await res.json();
    assert.strictEqual(data.status, 'PROVISIONED', "Account status should be PROVISIONED");

    // Check Member Home (should redirect to change-password)
    console.log("Testing Member Home forced redirect...");
    res = await fetchAuth(`${BASE_URL}/me`);
    assert.strictEqual(res.redirected, true, "Should redirect to change-password");
    assert.ok(res.url.includes('/me/change-password'), "Redirect URL should be /me/change-password");

    // Change Password
    console.log("Testing Forced Password Change...");
    res = await fetchAuth(`${BASE_URL}/api/member/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: '050787', newPassword: 'newsecurepassword' })
    });
    assert.strictEqual(res.status, 200, "Should succeed password change");

    // Verify status is ACTIVE and /me works
    console.log("Testing Member Home after activation...");
    res = await fetchAuth(`${BASE_URL}/me`);
    assert.strictEqual(res.redirected, false, "Should NOT redirect this time");
    const html = await res.text();
    assert.ok(html.includes('Trần Quốc Tuấn'), "Should show Identity from genealogy");

    // Old password should fail
    console.log("Testing Old Password Rejection...");
    cookies = ''; // clear cookies
    res = await fetchAuth(`${BASE_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tuantq', password: '050787' })
    });
    assert.strictEqual(res.status, 401, "Old password should fail");

    // New password should succeed and return ACTIVE
    console.log("Testing New Password Login...");
    res = await fetchAuth(`${BASE_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tuantq', password: 'newsecurepassword' })
    });
    assert.strictEqual(res.status, 200, "New password should succeed");
    data = await res.json();
    assert.strictEqual(data.status, 'ACTIVE', "Status should be ACTIVE");

    console.log("All Automated Tests PASSED ✅");
}

runTests().catch(e => {
    console.error("Test Failed:", e.message);
    process.exit(1);
});
