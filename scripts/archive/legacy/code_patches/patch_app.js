const fs = require('fs');
let code = fs.readFileSync('src/js/app-v2.js', 'utf8');

const sessionLogic = `
  function checkSession() {
    fetch(API_BASE + "/api/auth/me/identity")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.account) {
          // Update top utility link
          const memberEntry = document.querySelector('.member-entry');
          if (memberEntry) {
            memberEntry.textContent = 'Hồ sơ: ' + data.account.username + ' →';
            memberEntry.href = '/me';
          }
          
          // Update big CTA button in member section
          const pathCta = document.querySelector('a.path-cta[href="/login"]');
          if (pathCta) {
            pathCta.textContent = 'Vào Không gian của bạn →';
            pathCta.href = '/me';
          }
        }
      })
      .catch(e => console.log('Not logged in or error checking session'));
  }
`;

if (!code.includes('checkSession()')) {
  // Insert checkSession function before fetchRealData
  code = code.replace('function fetchRealData()', sessionLogic + '\n  function fetchRealData()');
  // Call it inside boot()
  code = code.replace('fetchRealData();', 'fetchRealData();\n    checkSession();');
  fs.writeFileSync('src/js/app-v2.js', code);
  console.log('Patched app-v2.js');
} else {
  console.log('Already patched');
}
