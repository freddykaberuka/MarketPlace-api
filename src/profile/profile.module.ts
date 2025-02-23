import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [ConfigModule],
  controllers: [ProfileController],
  providers: [ProfileService, ConfigService],
  exports: [ProfileService],
})
export class AuthModule {}