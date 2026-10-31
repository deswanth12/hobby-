import fs from 'fs';

let code = fs.readFileSync('server/apiRouter.cjs', 'utf8');

const oldMatch = `    const authorizedUsers = getAuthorizedUsers(db);
    const matchUser = authorizedUsers.find(u => {
      return (u.username === username || u.username === username.split('@')[0]);
    });`;

const newMatch = `    const authorizedUsers = getAuthorizedUsers(db);
    const matchUser = authorizedUsers.find(u => {
      const uName = u.username.toLowerCase();
      const input = username.toLowerCase();
      const inputPrefix = input.split('@')[0];

      if (uName === 'kavitha') {
        return (
          input === 'kavitha' || 
          inputPrefix === 'kavitha' || 
          input === 'cakavithasrj@gmail.com' || 
          inputPrefix === 'cakavithasrj'
        );
      }
      if (uName === 'admin') {
        return input === 'admin' || inputPrefix === 'admin';
      }
      return uName === input || uName === inputPrefix;
    });`;

code = code.replace(oldMatch, newMatch);

fs.writeFileSync('server/apiRouter.cjs', code, 'utf8');
console.log('Successfully updated username alias matching in server/apiRouter.cjs');
