import "dotenv/config";
import app from "./src/app.js";

const PORT = Number.parseInt(process.env.PORT ?? "", 10) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
