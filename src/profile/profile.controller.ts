import { Body, Controller, Post } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { RegisterDto } from "./dto/register.dto";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Register a new user
   * @param dto RegisterDto
   * @returns Success message
   */
  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<string> {
    return this.profileService.register(dto);
  }
}