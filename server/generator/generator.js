function generateCode(length) {
  const symbols =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * symbols.length);
    code += symbols[random];
  }

  return code;
}

// Асинхронная обертка для генератора
async function generator(length) {
  return new Promise((resolve) => {
    const code = generateCode(length);
    resolve(code);
  });
}

module.exports.generator = generator;
