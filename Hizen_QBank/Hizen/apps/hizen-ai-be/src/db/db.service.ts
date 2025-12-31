import { Injectable } from "@nestjs/common";
import { PrismaClient } from "prisma/prisma-generated";

@Injectable()
export class DbService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  get Prisma(): PrismaClient {
    return this.prisma;
  }
}
