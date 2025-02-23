import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { ERole } from "./enums/role.enum";
import { EStatus } from "./enums/status.enum";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Register user
   * @param dto REGISTER DTO
   */
  async register(dto: RegisterDto) {
    const { email, password, username, name: fullname } = dto;

    return this.prismaService.$transaction(async (tx) => {
      // Check if user already exists
      const user = await tx.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });
      const userProfile = await tx.userProfile.findFirst({
        where: { name: fullname },
      });
      if (user || userProfile)
        throw new BadRequestException("User already exists");

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          role: ERole.CUSTOMER,
          status: EStatus.NEW,
        },
      });
      if (newUser == null || newUser.id == null)
        throw new BadRequestException(
          "Unable to create user! Please check your input.",
        );

      // Create user profile
      await tx.userProfile.create({
        data: {
          name: fullname,
          userId: newUser.id,
        },
      });

      return `Check your email (${newUser.email}) to verify your account.`;
    });
  }

  /**
   * Hash password
   * @param password Password to hash
   * @returns password hash
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }
}