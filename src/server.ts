import app from "./app";
import AppConfig from "./configs/app.config";

app.listen(AppConfig.server.PORT, () => console.log(`Server running \nPORT: ${AppConfig.server.PORT}`))