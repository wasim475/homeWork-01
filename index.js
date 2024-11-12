const fs = require("fs/promises");

(async () => {
  const CREATE_NAVBAR = "create navbar";
  const CREATE_BANNER = "create banner";
  const CREATE_BUTTON = "create button";
  const DELETE_NAVBAR = "delete navbar";
  const DELETE_BANNER = "delete banner";
  const DELETE_BUTTON = "delete button";
  
  const indexPath = "./index.html";

  // Initialize or update the HTML file
  const initializeHTMLFile = async () => {
    try {
      await fs.access(indexPath);
    } catch (e) {
      const initialContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic HTML Elements</title>
  <style>
    /* Styles will be added dynamically */
  </style>
</head>
<body>
</body>
</html>`;
      await fs.writeFile(indexPath, initialContent, "utf-8");
    }
  };

  // Append content to <body> tag
  const appendToBody = async (content) => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace("</body>", `${content}\n</body>`);
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
  };

  // Create button
  const appendButtonToHTML = async (color) => {
    const buttonHTML = `
<button style="background-color: ${color}; color: white; padding: 12px 24px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer;">
  Dynamic Button
</button>`;
    await appendToBody(buttonHTML);
    console.log(`Button added to ${indexPath} with color ${color}`);
  };

  // Create navbar
  const appendNavbarToHTML = async () => {
    const navbarHTML = `
<div class="navbar" style="display: flex; background-color: #333; padding: 12px;">
  <a href="#home" style="color: white; padding: 14px 20px; text-decoration: none; text-align: center;">Home</a>
  <a href="#about" style="color: white; padding: 14px 20px; text-decoration: none; text-align: center;">About</a>
  <a href="#services" style="color: white; padding: 14px 20px; text-decoration: none; text-align: center;">Services</a>
  <a href="#contact" style="color: white; padding: 14px 20px; text-decoration: none; text-align: center;">Contact</a>
</div>`;
    await appendToBody(navbarHTML);
    console.log("Navbar added to index.html");
  };

  // Create banner
  const appendBannerToHTML = async (message) => {
    const bannerHTML = `
<div class="banner" style="background-color: #FFA500; color: white; padding: 20px; text-align: center; font-size: 20px;">
  ${message || "Welcome to Node JS!"}
</div>`;
    await appendToBody(bannerHTML);
    console.log(`Banner added to ${indexPath} with message: "${message}"`);
  };

  // Delete button
  const deleteButtonFromHTML = async () => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace(/<button[^>]*>.*?<\/button>/i, "");
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
    console.log("Button removed from index.html");
  };

  // Delete navbar
  const deleteNavbarFromHTML = async () => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace(/<div class="navbar"[^>]*>([\s\S]*?)<\/div>/, "");
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
    console.log("Navbar removed from index.html");
  };

  // Delete banner
  const deleteBannerFromHTML = async () => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace(/<div class="banner"[^>]*>[\s\S]*?<\/div>/, "");
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
    console.log("Banner removed from index.html");
  };

  // Watch command file and act on changes
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      const command = await fs.readFile("./command.txt", "utf-8");
      await initializeHTMLFile();

      if (command.startsWith(CREATE_BUTTON)) {
        const color = command.split(" ").slice(2).join(" ") || "#4CAF50";
        await appendButtonToHTML(color);
      } else if (command === CREATE_NAVBAR) {
        await appendNavbarToHTML();
      } else if (command === DELETE_BUTTON) {
        await deleteButtonFromHTML();
      } else if (command === DELETE_NAVBAR) {
        await deleteNavbarFromHTML();
      } else if (command.startsWith(CREATE_BANNER)) {
        const message = command.split(" ").slice(2).join(" ") || "Welcome to our site!";
        await appendBannerToHTML(message);
      } else if (command === DELETE_BANNER) {
        await deleteBannerFromHTML();
      }
    }
  }
})();
