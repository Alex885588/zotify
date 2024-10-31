import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import * as fs from "fs";
import { UserService } from "../services/user.service";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const userSeeder = app.get(UserService);
    const count = await userSeeder.getTableLength();
    if (count === 0) {
        const jsonFilePathPlatforms = "./src/utils/user.seed.tamplate.json"
        const jsonDataPlatform = fs.readFileSync(jsonFilePathPlatforms, "utf8")
        const newJsonPlatform = JSON.parse(jsonDataPlatform);
        await userSeeder.create(newJsonPlatform);
        await app.close();
    }
    await app.close();
}

bootstrap();
