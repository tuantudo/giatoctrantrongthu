(async () => {
    let cookies = '';
    const fetchAuth = async (url, options = {}) => {
        options.headers = options.headers || {};
        if (cookies) options.headers['Cookie'] = cookies;
        const res = await fetch(url, options);
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) cookies = setCookie.split(';')[0];
        return res;
    };

    let res = await fetchAuth('http://localhost:3000/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tuantq', password: '123' })
    });
    console.log("Login with 123:", res.status);

    res = await fetchAuth('http://localhost:3000/api/member/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: '123', newPassword: '050787' })
    });
    console.log("Change to 050787:", res.status);

    // Also need to set status back to PROVISIONED?
    // Wait, the API only sets it to ACTIVE. Let's see if the user cares about status being PROVISIONED.
})();
