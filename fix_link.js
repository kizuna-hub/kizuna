const fs = require('fs');
const file = 'app/[locale]/founder-workspace/venture-connect/page.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/<Link href=\{[^}]*\}>Xem/g, '<Link href={\/mentor-profile/\\}>Xem');
fs.writeFileSync(file, data);
