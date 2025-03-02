import { applyDecorators, UseGuards } from "@nestjs/common"
import { GQLAuthGuard } from "../guards/gql-auth.guard"

export const Authorization = () => applyDecorators(UseGuards(GQLAuthGuard))
