
function showWelcomeMessage(message = "欢迎来到 Nexus", color = "#9180ff", fontSize = "20px") {
  const welcomeWithHeart = `${message}`;
  console.log(`%c${welcomeWithHeart}`, `color: ${color}; font-size: ${fontSize}; font-weight: bold;`);
}
module.exports = {
    showWelcomeMessage
}