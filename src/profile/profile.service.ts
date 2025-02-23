import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Register a new user
   * @param dto RegisterDto
   * @returns Success message
   */
  async register(dto: RegisterDto): Promise<string> {
    const { email, password, username, name: fullname } = dto;

    // Check if user already exists
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (user) {
      throw new BadRequestException("User already exists");
    }

    // Hash password
    const hashedPassword = this.hashPassword(password);

    // Create new user
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: "CUSTOMER",
        status: "NEW",
      },
    });

    // Create user profile
    await this.prismaService.userProfile.create({
      data: {
        name: fullname,
        userId: newUser.id,
      },
    });

    // Log verification link
    const verificationLink = `http://localhost:8080/api/auth/verify?token=${newUser.id}`;
    console.log(`Verification link: ${verificationLink}`);

    return `Check your email (${newUser.email}) to verify your account.`;
  }

  /**
   * Hash password
   * @param password Password to hash
   * @returns Hashed password
   */
  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }
}