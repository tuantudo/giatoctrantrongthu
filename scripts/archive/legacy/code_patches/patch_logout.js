const fs = require('fs');
let code = fs.readFileSync('server/member.js', 'utf8');

const logoutRoute = `
    // GET /logout (Member explicit logout route)
    router.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.clearCookie('sid', { path: '/' });
            res.redirect('/');
        });
    });
`;

if (!code.includes("router.get('/logout'")) {
    code = code.replace("return router;", logoutRoute + "\n    return router;");
    // Also update the logout link in the HTML
    code = code.replace(/\/api\/auth\/logout/g, "/logout");
    fs.writeFileSync('server/member.js', code);
    console.log("Patched member.js logout");
} else {
    console.log("Already patched");
}
